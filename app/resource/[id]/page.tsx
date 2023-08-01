import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import NotFoundPage from "@/app/not-found";
import { prisma } from "@/server/db";
import { ResolvingMetadata, type Metadata } from "next";
import { getServerSession } from "next-auth";
import { getGithubRepo } from "@/lib/server";
import Resource from "./Resource";
import { defaultMetadata } from "@/lib/constants";
import ResourceComment from "./ResourceComment";

type PageProps = {
    params: {
        id: string;
    };
    searchParams: {};
};

export async function generateMetadata(
    { params, }: PageProps,
    parent?: ResolvingMetadata
): Promise<Metadata | undefined> {
    const data = await prisma.nextResource.findUnique({
        where: {
            id: params.id
        },
        include: {
            tags: true,
            author: true
        }
    });

    if (data) {
        const title = data?.title;
        const description = data?.description;
        const parentMetadata = (await parent) || defaultMetadata;

        return {
            title,
            description,
            keywords: data.tags.map(item => item.name).join(","),
            openGraph: {
                ...(parentMetadata?.openGraph as any),
                title,
                description,
            },
            twitter: {
                ...(parentMetadata?.twitter as any),
                title,
                description,
            }
        };
    }

    return undefined;
}

export default async function ResourceDetail(props: PageProps) {
    const { id } = props.params;
    const session = await getServerSession(authOptions) as UserSession | null;
    const [
        data,
        comments,
        // commentCount
    ] = await prisma.$transaction([
        prisma.nextResource.findUnique({
            where: {
                id
            },
            include: {
                tags: true,
                author: true,
            }
        }),
        prisma.comment.findMany({
            where: {
                resourceId: id,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: true,
            }
        }),
        // prisma.comment.count(),
    ]);

    if (!data) {
        return <NotFoundPage />;
    }

    if (session?.user.id) {
        const liked = await prisma.like.findFirst({
            where: {
                resourceId: data.id,
                userId: session.user.id,
            }
        });

        if (liked) {
            (data as any).liked = true;
        }
    }

    const githubData = data.githubLink ? await getGithubRepo(data.githubLink) : undefined;

    if (githubData?.owner.avatar_url && (githubData.owner.avatar_url !== data.githubAvatar)) {
        prisma.nextResource.update({
            where: {
                id: data.id,
            },
            data: {
                githubAvatar: githubData.owner.avatar_url,
            }
        });
    }

    return (
        <div className="mx-auto w-full max-w-screen-xl px-4 py-12 md:py-24">
            <Resource
                session={session}
                githubData={githubData}
                data={data}
            />
            <ResourceComment
                comments={comments}
                commentCount={comments.length}
                session={session}
                resourceId={data.id}
            />
        </div>
    );
}   