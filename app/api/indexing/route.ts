import { google } from "googleapis";
import { env } from "@/env/server.mjs";

export async function POST(request: Request) {
    const data: {
        url: string;
        type: "URL_UPDATED" | "URL_DELETED";
    } = await request.json();

    const jwtClient = new google.auth.JWT(
        env.CLIENT_EMAIL,
        undefined,
        env.PRIVATE_KEY,
        ["https://www.googleapis.com/auth/indexing"],
        undefined,
    );

    try {
        const tokens = await jwtClient.authorize();

        if (!tokens || !tokens.access_token) {
            return (Response as any).json({ err_msg: "no tokens" });
        }

        /**
         * @see https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#caching-data
         * fetch requests that use the POST method are also automatically cached.
         * Unless it's inside a Route Handler that uses the POST method, then it will not be cached.
         */
        const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
            method: "POST",
            // headers must include the Content-Type and auth headers
            headers: {
                "Content-Type": "application/json",
                "Authorization": tokens.access_token
            },
            body: JSON.stringify({
                url: data.url,
                type: data.type
            })
        });

        return res.json();
    } catch (err) {
        return (Response as any).json({ err });
    }
}