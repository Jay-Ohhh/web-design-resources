import { env } from "@/env/server.mjs";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/api";
import { createTRPCContext } from "@/server/api/trpc";

// this is the server RPC API handler

const handler = (request: Request) => {
    return fetchRequestHandler({
        endpoint: "/api/trpc",
        req: request,
        router: appRouter,
        createContext: createTRPCContext,
        onError: env.NODE_ENV === "development"
            ? ({ path, error }) => {
                console.error(
                    `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
                );
            }
            : undefined,
    });
};

export const GET = handler;
export const POST = handler;