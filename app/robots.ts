import { type MetadataRoute } from "next";
import { env } from "@/env/server.mjs";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/*", "/user-settings/*"],
        },
        sitemap: `${env.NEXTAUTH_URL}/server-sitemap.xml`,
    };
}