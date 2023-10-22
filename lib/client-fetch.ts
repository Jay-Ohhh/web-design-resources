import { env } from "@/env/client.mjs";

export async function indexing(data: {
    resourceId: string;
    type: "URL_UPDATED" | "URL_DELETED";
}) {
    return await fetch("/api/indexing", {
        method: "POST",
        body: JSON.stringify({
            url: `${env.NEXT_PUBLIC_NEXTAUTH_URL}/resource/${data.resourceId}`,
            type: "URL_UPDATED"
        }),
        cache: "no-cache",
    }).then(res => res.json());
}