import { createTRPCRouter } from "./trpc";
import { resourceRouter } from "./routers/resourceRouter";
import { likeRouter } from "./routers/likeRouter";
import { commentRouter } from "./routers/commentRouter";

/**
 * This is the primary router for your server
 * 
 * All routers added in /api/router should be manually added here.
 */
export const appRouter = createTRPCRouter({
    resource: resourceRouter,
    like: likeRouter,
    comment: commentRouter,
});

export type AppRouter = typeof appRouter;