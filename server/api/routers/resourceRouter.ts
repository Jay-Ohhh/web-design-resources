import { z } from "zod";
import { type GithubData } from "@/types/GithubData";
import { createTRPCRouter, publicProcedure, privateProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { resourceCategories } from "@/lib/constants";
import { env } from "@/env/server.mjs";
import { type Prisma } from "@prisma/client";

async function getGithubRepo(url: string) {
    const urlWithoutProtocol = url.replace(/(^\w+:|^)\/\//, "");
    const path = urlWithoutProtocol.split("/").slice(1).join("/");
    /**
     * @see https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#get-a-repository
     */
    return await fetch(`https://api.github.com/repos/${path}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${env.GITHUB_TOKEN || ""}`,
        },
        cache: "no-store",
    }).then((res) => res.json()) as GithubData;
}

function purifyTags(tags: string) {
    return (
        tags
            .replace(/\s/g, "")
            .split(",")
            .reduce((acc, tag) => {
                tag && acc.push(tag);

                return acc;
            }, [] as string[])
    );
}

export const resourceRouter = createTRPCRouter({
    getAll: publicProcedure
        .input(z.object({
            page: z.number().default(0),
            pageSize: z.number().default(20),
        }))
        .query(async ({ ctx, input }) => {
            const { page, pageSize } = input;
            const [resources, count] = await ctx.prisma.$transaction([
                ctx.prisma.nextResource.findMany({
                    skip: page * pageSize,
                    take: pageSize,
                    include: {
                        tags: true,
                        author: true,
                    },
                    orderBy: {
                        likesCount: "desc"
                    }
                }),
                ctx.prisma.nextResource.count(),
            ]);

            return { resources, total: count };
        }),

    getSingle: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const { id } = input;

            const resource: any = await ctx.prisma.nextResource.findUnique({
                where: {
                    id
                },
                include: {
                    tags: true,
                    author: true
                }
            });

            if (!resource) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "resource not found",
                });
            }

            return resource;
        }),

    getByName: publicProcedure
        .input(z.object({ name: z.string() }))
        .query(async ({ ctx, input }) => {
            const { name } = input;

            const resources = await ctx.prisma.nextResource.findMany({
                where: {
                    OR: [
                        { title: { contains: name }, },
                        { description: { contains: name } },
                        { tags: { some: { name: { contains: name } } } },
                    ]
                },
                include: {
                    tags: true,
                    author: true,
                },
                orderBy: {
                    likesCount: "desc",
                }
            });

            return resources;
        }),

    getByTag: publicProcedure
        .input(z.object({ tag: z.string() }))
        .query(async ({ ctx, input }) => {
            const { tag } = input;

            const resources = await ctx.prisma.nextResource.findMany({
                where: {
                    tags: {
                        some: {
                            name: tag
                        }
                    }
                },
                include: {
                    tags: true,
                    author: true,
                },
                orderBy: {
                    likesCount: "desc",
                }
            });

            return resources;
        }),

    create: privateProcedure
        .input(
            z.object({
                description: z.string().min(5).max(400),
                title: z.string().min(1).max(50),
                tags: z.string().min(1).max(100),
                link: z.string().min(1).max(250),
                githubLink: z.string().max(250),
                category: z.enum(resourceCategories),
                categorySlug: z.string(),
                authType: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const authorId = ctx.userId;

            if (!authorId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You need to be signed in to create a resource.",
                });
            }

            const githubData = await getGithubRepo(input.githubLink);

            const tagArray = purifyTags(input.tags);

            const resource = await ctx.prisma.nextResource.create({
                data: {
                    authorId,
                    description: input.description,
                    link: input.link,
                    githubLink: input.githubLink,
                    title: input.title,
                    githubAvatar:
                        !githubData.owner
                            ? ""
                            : githubData.owner.avatar_url,
                    category: input.category,
                    categorySlug: input.categorySlug,
                    authType: input.authType,
                    tags: {
                        connectOrCreate: tagArray.map(tagName => ({
                            where: { name: tagName },
                            create: { name: tagName },
                        }))
                    },
                },
                include: {
                    tags: true,
                    author: true,
                }
            });

            return resource;
        }),

    update: privateProcedure
        .input(
            z.object({
                resourceId: z.string(),
                description: z.string().min(5).max(400),
                title: z.string().min(1).max(50),
                tags: z.string().min(5).max(100),
                link: z.string().min(1).max(250),
                githubLink: z.string().max(250),
                category: z.enum(resourceCategories),
                categorySlug: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const authorId = ctx.userId;
            const githubData = await getGithubRepo(input.githubLink);
            const {
                resourceId,
                description,
                title,
                tags,
                link,
                githubLink,
                category,
                categorySlug,
            } = input;

            const existingResource = await ctx.prisma.nextResource.findFirst({
                where: {
                    id: resourceId,
                    authorId, // permission
                },
                include: {
                    tags: true,
                }
            });

            if (!existingResource) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Resource not found or you don't have permission to edit it",
                });
            }

            const tagArray = purifyTags(tags);

            await ctx.prisma.nextResource.update({
                where: {
                    id: resourceId,
                },
                data: {
                    tags: {
                        disconnect: existingResource.tags.map((tag) => ({
                            id: tag.id,
                        })),
                    },
                },
            });

            const updateResource = await ctx.prisma.nextResource.update({
                where: {
                    id: resourceId,
                },
                data: {
                    description,
                    title,
                    link,
                    githubLink,
                    githubAvatar:
                        !githubData.owner
                            ? ""
                            : githubData.owner.avatar_url,
                    category,
                    categorySlug,
                    tags: {
                        connectOrCreate: tagArray.map((tagName) => ({
                            where: { name: tagName },
                            create: { name: tagName },
                        })),
                    },
                },
                include: {
                    tags: true,
                    author: true,
                },
            });

            return updateResource;
        }),

    delete: privateProcedure
        .input(
            z.object({
                resourceId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const authorId = ctx.userId;
            const { resourceId } = input;

            const existingResource = await ctx.prisma.nextResource.findFirst({
                where: {
                    id: resourceId,
                    authorId,
                }
            });

            if (!existingResource) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message:
                        "Resource not found or you don't have permission to delete it",
                });
            }

            const deleteResource = await ctx.prisma.nextResource.delete({
                where: {
                    id: resourceId,
                }
            });

            return deleteResource;
        })
});
