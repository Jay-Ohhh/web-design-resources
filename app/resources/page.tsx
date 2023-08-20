import CategoriesNav from "@/components/CategoriesNav";
import { type RouterOutputs } from "@/lib/trpc";
import { prisma } from "@/server/db";
import SingleCategoryNavItem from "@/components/SingleCategoryNavItem";
import { homepageCards } from "@/lib/constants";
import { ResolvingMetadata, type Metadata } from "next";
import ResourceCard from "@/components/ResourceCard";
import ResPagination from "./ResPagination";
import { resourceCategoriesSlug } from "@/lib/constants";
import { fetchServerSession } from "../api/auth/[...nextauth]/authOptions";
import { type Prisma } from "@prisma/client";
import { headers } from "next/headers";

type Resource = RouterOutputs["resource"]["getAll"]["resources"][number];
type PageProps = {
    params: { category?: string; tag?: string; },
    searchParams: { offset?: string; limit?: string; public?: string; query?: string; };
};

export async function generateMetadata(
    { params, searchParams }: PageProps,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const { category, tag } = params;
    const title = tag
        ? `Web Design Resources - ${tag}`
        : resourceCategoriesSlug.includes(category as any)
            ? `Web Design Resources - ${category}`
            : "Web Design Resources - All";

    return {
        title,
    };
}

export default async function Resources(props: PageProps) {
    const { params, searchParams } = props;
    const { category, tag } = params;
    const headerList = headers();
    const urlObj = new URL(headerList.get("x-current-url")!);

    const _offset = Number(searchParams.offset);
    const offset = _offset > 0 ? _offset : 0;
    const _limit = Number(searchParams.limit);
    const limit = _limit > 0 ? _limit : 20;

    const session = await fetchServerSession();
    const isOpenSourceQuery = searchParams.public ? {
        githubLink: { not: null }
    } : {};

    const where: Prisma.NextResourceWhereInput = (tag && urlObj.pathname.startsWith("/tag/"))
        // tag query
        ? {
            tags: {
                some: {
                    name: tag,
                }
            },
            ...isOpenSourceQuery,
        }
        // search query
        : (searchParams.query && urlObj.pathname === "/search")
            ? {
                OR: [
                    {
                        title: {
                            contains: searchParams.query
                        }
                    },
                    {
                        description: {
                            contains: searchParams.query
                        }
                    },
                ],
                ...isOpenSourceQuery
            }
            // /resources/[category] query
            : resourceCategoriesSlug.includes(category as any)
                ? { categorySlug: category, ...isOpenSourceQuery }
                // default query
                : isOpenSourceQuery;

    const { resources, total } = await (async () => {
        const [res, total] = await prisma.$transaction([
            prisma.nextResource.findMany({
                skip: offset * limit,
                take: limit,
                include: {
                    tags: true,
                    author: true,
                },
                where,
                orderBy: {
                    likesCount: "desc"
                },
            }),
            prisma.nextResource.count({ where }),
        ]);

        const resources = res as (typeof res[number] & { liked?: boolean; })[];

        if (session?.user?.id) {
            const likes = await Promise.allSettled(resources.map(resource => {
                return prisma.like.findFirst({
                    where: {
                        resourceId: resource.id,
                        userId: session.user.id,
                    }
                });
            }));

            likes.forEach((data, index) => {
                if (data.status === "fulfilled" && !!data.value) {
                    resources[index].liked = true;
                }
            });
        }

        return { resources, total };
    })();

    const Nav = (
        <CategoriesNav
            resources={resources}
            NavItemRenderer={(
                <>
                    {homepageCards.map((card) => (
                        // @ts-ignore
                        <SingleCategoryNavItem
                            key={card.id}
                            coverImgUrl={card.coverImgUrl}
                            description={card.description}
                            link={card.link}
                            title={card.title}
                            slug={card.slug as any}
                        />
                    ))}
                </>
            )}
        />
    );

    return (
        <>
            {Nav}
            <main>
                <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 justify-center gap-4 px-4 pb-20 pt-6 md:grid-cols-2 md:pt-12">
                    {resources?.map((item) => (
                        <ResourceCard
                            key={item.id}
                            data={item}
                            shadowEnabled={true}
                            session={session}
                        />
                    ))}
                </div>
                <ResPagination
                    page={offset + 1}
                    pageSize={limit}
                    total={total}
                />
            </main>
        </>
    );
}