import { z } from "zod";
import { createTRPCRouter, publicProcedure, privateProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const likeRouter = createTRPCRouter({
    create: privateProcedure
        .input(
            z.object({
                resourceId: z.string(),
                userId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { resourceId, userId } = input;

            const existingLike = await ctx.prisma.like.findFirst({
                where: {
                    resourceId,
                    userId,
                }
            });

            if (existingLike) {
                await ctx.prisma.like.delete({
                    where: {
                        id: existingLike.id,
                    }
                });

                // decrement by 1
                await ctx.prisma.nextResource.update({
                    where: {
                        id: resourceId,
                    },
                    data: {
                        likesCount: {
                            decrement: 1,
                        }
                    }
                });

                return { success: true, liked: false };
            } else {
                await ctx.prisma.like.create({
                    data: {
                        resourceId,
                        userId,
                    }
                });

                await ctx.prisma.nextResource.update({
                    where: {
                        id: resourceId,
                    },
                    data: {
                        likesCount: {
                            increment: 1
                        }
                    }
                });

                return { success: true, liked: true };
            }
        }),
    getLikedByUser: publicProcedure
        .input(
            z.object({
                userId: z.string(),
            })
        ).query(async ({ ctx, input }) => {
            const { userId } = input;
            const likedResources = await ctx.prisma.like.findMany({
                where: {
                    userId,
                },
                include: {
                    resource: {
                        include: {
                            tags: true,
                            author: true
                        }
                    }
                }
            });

            return likedResources.map(item => item.resource);
        }),

    getUserStats: publicProcedure
        .input(
            z.object({
                userId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const { userId } = input;

            const likedCount = await ctx.prisma.like.count({
                where: {
                    userId
                }
            });

            const createdCount = await ctx.prisma.nextResource.count({
                where: {
                    authorId: userId,
                }
            });

            return {
                likedCount,
                createdCount
            };
        })
});