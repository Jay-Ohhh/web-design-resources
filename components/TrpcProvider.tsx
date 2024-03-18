"use client";

/**
 * This is the client-side entrypoint fot your tRPC API. It is used to create the `api` object which
 * contains the Next.js App-wrapper, as well as your type-safe React Query hooks.
 * 
 * We also create a few interface helpers for input and output types.
 */
import { useState } from "react";
import { httpBatchLink, loggerLink } from "@trpc/client";
import superjson from "superjson";
import { env } from "@/env/client.mjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function getBaseUrl() {
    if (typeof window !== "undefined") return ""; // browser should use relative url

    return env.NEXT_PUBLIC_NEXTAUTH_URL;
}

export default function TrpcProvider(props: { children: React.ReactNode; }) {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            /**
             * Links used to determine request flow from client to server.
             * 
             * @see https://trpc.io/docs/links
             */
            links: [
                loggerLink({
                    enabled: (opts) =>
                        process.env.NODE_ENV === "development" ||
                        (opts.direction === "down" && opts.result instanceof Error),
                }),
                httpBatchLink({
                    /**
                     * If you want to use SSR, you need to use the server's full URL
                     * 
                     * @link https://trpc.io/docs/ssr
                     **/
                    url: `${getBaseUrl()}/api/trpc`,
                    /**
                    * Transformer used for data de-serialization from the server
                    * 
                    * @see https://trpc.io/docs/data-transformers
                    */
                    transformer: superjson,
                })
            ],
        }),
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {props.children}
                <ReactQueryDevtools />
            </QueryClientProvider>
        </trpc.Provider>
    );
}