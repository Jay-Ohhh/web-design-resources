import Link from "@/components/ui/Link";
import { prisma } from "@/server/db";
import Image from "next/image";
import { AiFillGithub, AiFillHeart } from "react-icons/ai";
import NotFoundPage from "../../not-found";
import { IoMdCreate } from "react-icons/io";
import { cn, slugify } from "@/lib/common";
import ResourceCard, { Resource } from "@/components/ResourceCard";
import { Prisma } from "@prisma/client";
import ButtonLink from "@/components/ui/ButtonLink";
import { fetchServerSession } from "@/app/api/auth/[...nextauth]/authOptions";

type PageProps = {
    params: {
        id: string;
    };
    searchParams: {
        tab?: string;
    };
};

const likeWithResource = Prisma.validator<Prisma.LikeFindManyArgs>()({
    include: { resource: { include: { tags: true } } },
});

type LikeWithResource = Prisma.LikeGetPayload<typeof likeWithResource>;

export default async function User(props: PageProps) {
    const { params, searchParams } = props;

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
    const taskValues = await Promise.all([
        fetchServerSession(),
        searchParams.tab === "added-resources"
            ? prisma.nextResource.findMany({
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
            })
            : prisma.like.findMany({
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
            })
    ]);
    const session = taskValues[0] as UserSession | null;
    let resources = taskValues[1] as Resource[];

    if (searchParams.tab === "added-resources") {
        if (session?.user.id) {
            const likes = await Promise.allSettled(resources.map(item => {
                return prisma.like.findFirst({
                    where: {
                        resourceId: item.id,
                        userId: session.user.id,
                    }
                });
            }));

            likes.forEach((data, index) => {
                if (data.status === "fulfilled" && !!data.value) {
                    (resources as Resource[])[index].liked = true;
                }
            });
        }
    } else {
        resources = (resources as unknown as LikeWithResource[]).map(item => {
            return {
                ...item.resource,
                liked: true
            };
        }) as Resource[];
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
                    {searchParams.tab === "added-resources" ? (
                        <h4 className="flex items-center justify-center gap-1 font-medium lg:text-lg">
                            <IoMdCreate /> Added: {resources.length}
                        </h4>
                    ) : (
                        <h4 className="flex items-center justify-center gap-1 font-medium lg:text-lg">
                            <AiFillHeart /> Liked: {resources.length}
                        </h4>
                    )}
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
            <div className="col-span-4 flex flex-col gap-12 rounded-lg md:gap-4 md:border md:p-4">
                <div className="flex justify-around">
                    <ButtonLink
                        className="flex items-center justify-center gap-2 p-4 text-xl font-medium md:p-0"
                        url={`/user/${params.id}`}
                    >
                        <div className={cn(
                            "relative",
                            !searchParams.tab && "after:absolute after:-bottom-3 after:left-1/2 after:-translate-x-1/2 after:w-16 after:border-b-[3px] after:border-[#ee9279]"
                        )}>
                            Favourite resources
                        </div>
                        <AiFillHeart
                            className="hidden sm:block text-slate-600 dark:text-slate-400"
                            size={20}
                        />
                    </ButtonLink>
                    <ButtonLink
                        className="flex items-center justify-center gap-2 p-4 text-xl font-medium md:p-0"
                        url={`/user/${params.id}?tab=added-resources`}
                    >
                        <div className={cn(
                            "relative",
                            searchParams.tab === "added-resources" &&
                            "after:absolute after:-bottom-3 after:left-1/2 after:-translate-x-1/2 after:w-16 after:border-b-[3px] after:border-[#ee9279]"
                        )}>
                            Added resources
                        </div>
                        <IoMdCreate
                            className="hidden sm:block text-slate-600 dark:text-slate-400"
                            size={20}
                        />
                    </ButtonLink>
                </div>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resources?.map((item) => (
                        <ResourceCard
                            key={item.id}
                            data={item}
                            session={session}
                            shadowEnabled={false}
                        />
                    ))}
                    {(!resources || resources.length <= 0) && (
                        <div className="mb-4 text-center text-lg">Nothing found</div>
                    )}
                </div>
            </div>
        </main>
    );
}