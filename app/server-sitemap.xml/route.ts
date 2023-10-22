
import { type MetadataRoute } from "next";
import { env } from "@/env/server.mjs";
import { prisma } from "@/server/db";
import { staticPagePaths } from "@/lib/constants";

const domain = env.NEXTAUTH_URL.endsWith("/") ? env.NEXTAUTH_URL.slice(0, -1) : env.NEXTAUTH_URL;

export async function GET() {
    const maps: MetadataRoute.Sitemap = [];
    const [resources, tags] = await prisma.$transaction([
        prisma.nextResource.findMany({
            select: {
                id: true,
                createdAt: true,
                updatedAt: true
            }
        }),
        prisma.tag.findMany({
            select: {
                name: true,
            }
        }),
    ]);

    staticPagePaths.forEach(item => {
        maps.push({
            url: domain + item,
            lastModified: new Date().toISOString(),
            changeFrequency: "always",
            priority: 1,
        });
    });

    resources.forEach(item => {
        maps.push({
            url: `${domain}/resource/${item.id}`,
            lastModified: new Date(item.updatedAt || item.createdAt).toISOString(),
            changeFrequency: "weekly",
            priority: 0.7,
        });
    });

    tags.forEach(item => {
        maps.push({
            url: `${domain}/tag/${item.name}`,
            changeFrequency: "always",
            priority: 0.7,
        });
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${maps.map(item => {
        return `<url>
        <loc>${item.url}</loc>
        <lastmod>${item.lastModified}</lastmod>
        <changefreq>monthly</changefreq>${item.priority ? `
        <priority>${item.priority}</priority>` : ""}
    </url>
    `;
    }).join("")}
</urlset>`;

    return new Response(sitemap, {
        status: 200,
        headers: {
            "Content-Type": "text/xml",
        },
    });
}