import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Link from "@/components/ui/Link";
import { prisma } from "@/server/db";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { AiFillGithub, AiFillHeart } from "react-icons/ai";
import NotFoundPage from "../../not-found";
import { IoMdCreate } from "react-icons/io";
import { slugify } from "@/lib/common";
import ResourceCard, { Resource } from "@/components/ResourceCard";

type PageProps = {
    params: {
        id: string;
    };
};

export default async function User(props: PageProps) {
    const { params } = props;

    const profile = await prisma.user.findUnique({
        where: {
            id: params.id,
        },
        include: {
            accounts: true,
        }
    });

    if (!profile) {
        return <NotFoundPage />;
    }

    const account = profile.accounts.find(item => item.userId === params.id);
    const session = await getServerSession(authOptions) as UserSession | null;
    const res = await prisma.$transaction([
        prisma.nextResource.findMany({
            where: {
                authorId: params.id
            },
            include: {
                tags: true,
                author: true,
            },
            orderBy: {
                createdAt: "desc",
            }
        }),
        prisma.like.findMany({
            where: {
                userId: params.id
            },
            include: {
                resource: {
                    include: {
                        tags: true,
                        author: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
        }),
    ]);

    const createdResources = res[0] as Resource[];
    const likes = res[1];
    const likedResources = likes.map(item => ({
        ...item.resource,
        liked: true
    })) as Resource[];

    if (session?.user.id) {
        const likes = await Promise.allSettled(createdResources.map(item => {
            return prisma.like.findFirst({
                where: {
                    resourceId: item.id,
                    userId: session.user.id,
                }
            });
        }));

        likes.forEach((data, index) => {
            if (data.status === "fulfilled" && !!data.value) {
                createdResources[index].liked = true;
            }
        });
    }

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col gap-4 px-4 py-12 md:grid md:grid-cols-5 md:py-24 lg:gap-8">
            <div className="col-span-1 flex flex-col items-center justify-center gap-4 rounded-lg border py-4 text-center md:sticky md:left-0 md:top-[100px] md:h-96 md:py-0">
                <Image
                    alt={`${profile.name || ""} profile picture`}
                    src={profile.image || "/images/icons/logo.svg"}
                    className="h-32 w-32 rounded-full border-2 border-slate-300 sm:h-24 sm:w-24 lg:h-36 lg:w-36"
                    width={128}
                    height={128}
                />
                <h2 className="truncate text-xl font-semibold sm:w-28 lg:w-40">
                    {profile.name}
                </h2>
                <div className="flex flex-col items-center gap-2">
                    <h4 className="flex items-center justify-center gap-1 font-medium lg:text-lg">
                        <AiFillHeart /> Liked: {likes.length}
                    </h4>
                    <h4 className="flex items-center justify-center gap-1 font-medium lg:text-lg">
                        <IoMdCreate /> Added: {createdResources.length}
                    </h4>
                    {account?.provider === "github" && profile.name && (
                        <Link
                            target="_blank"
                            href={`https://github.com/${slugify(profile.name)}`}
                        >
                            <AiFillGithub size={32} />
                        </Link>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-12 rounded-lg md:grid md:col-span-4 md:grid-cols-2 md:gap-4 md:border md:p-4">
                <div>
                    <h3 className="flex items-center justify-center gap-2 p-4 text-xl font-medium md:p-0">
                        Favourite resources
                        <AiFillHeart
                            className="text-slate-600 dark:text-slate-400"
                            size={20}
                        />
                    </h3>
                    <div className="mt-8 flex flex-col gap-4">
                        {likedResources?.map((item) => (
                            <ResourceCard
                                key={item.id}
                                data={item}
                                session={session}
                                shadowEnabled={false}
                            />
                        ))}
                        {likedResources.length <= 0 && (
                            <div className="mb-4 text-center text-lg">Nothing found</div>
                        )}
                    </div>
                </div>
                <div className="">
                    <h3 className="flex items-center justify-center gap-2 p-4 text-xl font-medium md:p-0">
                        Added resources
                        <IoMdCreate
                            className="text-slate-600 dark:text-slate-400"
                            size={20}
                        />
                    </h3>
                    <div className="mt-8 flex flex-col gap-4">
                        {createdResources?.map((item) => (
                            <ResourceCard
                                key={item.id}
                                data={item}
                                session={session}
                                shadowEnabled={false}
                            />
                        ))}
                        {createdResources.length <= 0 && (
                            <div className="mb-4 text-center text-lg">Nothing found 😞</div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}