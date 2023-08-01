import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, privateProcedure } from "../trpc";

export const commentRouter = createTRPCRouter(({
    create: privateProcedure
        .input(
            z.object({
                resourceId: z.string(),
                content: z.string().trim().min(1).max(400),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const authorId = ctx.userId;

            if (!authorId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "User is not authenticated",
                });
            }

            const { resourceId, content } = input;

            const resource = await ctx.prisma.nextResource.findUnique({
                where: { id: resourceId },
            });

            if (!resource) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Resource not found",
                });
            }

            const comment = await ctx.prisma.comment.create({
                data: {
                    content,
                    resourceId,
                    userId: authorId,
                },
                include: {
                    user: true,
                }
            });

            return comment;
        }),
    update: privateProcedure
        .input(
            z.object({
                commentId: z.string(),
                content: z.string().trim().min(1).max(400),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const authorId = ctx.userId;

            if (!authorId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "User is not authenticated",
                });
            }

            const { commentId, content } = input;

            const comment = await ctx.prisma.comment.findUnique({
                where: {
                    id: commentId,
                },
            });

            if (comment?.userId !== authorId) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You are not authorized to update this comment",
                });
            }

            const updatedComment = await ctx.prisma.comment.update({
                where: {
                    id: commentId,
                },
                data: {
                    content,
                },
            });

            return updatedComment;
        }),
    delete: privateProcedure
        .input(
            z.object({
                commentId: z.string().trim().min(1),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const authorId = ctx.userId;

            if (!authorId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "User is not authenticated",
                });
            }

            const { commentId } = input;

            const comment = await ctx.prisma.comment.findUnique({
                where: {
                    id: commentId,
                },
            });

            if (comment?.userId !== authorId) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You are not authorized to delete this comment",
                });
            }

            const deletedComment = await ctx.prisma.comment.delete({
                where: {
                    id: commentId,
                }
            });

            return deletedComment;
        })
}));