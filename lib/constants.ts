import { env } from "@/env/client.mjs";
import { Metadata } from "next";
import { Inter } from "next/font/google";

export const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const homepageCards = [
    {
        id: 0,
        title: "UI Libraries",
        description:
            "Pre-designed components, styles and customizable themes. Simplify development and create polished interfaces for dashboards, menus, and forms effortlessly.",
        link: "/resources/ui-libraries",
        imgUrl: "/images/icons/design.svg",
        slug: "ui-libraries",
        coverImgUrl: "/images/categories/ui.jpg",
    },

    {
        id: 1,
        title: "Tools",
        description:
            "Explore this category to discover the tools that will empower you to create exceptional projects with ease.",
        link: "/resources/tools",
        imgUrl: "/images/icons/tool.svg",
        slug: "tools",
        coverImgUrl: "/images/categories/tools.jpg",
    },
    {
        id: 2,
        title: "Starters",
        description:
            "Save valuable time and quickly set up the initial structure of your projects with starters created with productivity in mind.",
        link: "/resources/starters",
        imgUrl: "/images/icons/starter.svg",
        slug: "starters",
        coverImgUrl: "/images/categories/starters.jpg",
    },
    {
        id: 3,
        title: "Tutorials",
        description:
            "Learn from experienced developers as they share their insights, tips, and tricks to help you master popular development tools.",
        link: "/resources/tutorials",
        imgUrl: "/images/icons/tutorial.svg",
        slug: "tutorials",
        coverImgUrl: "/images/categories/tutorials.jpg",
    },
    {
        id: 4,
        title: "Other",
        description:
            "Explore a wide array of resources that extend beyond the traditional categories, yet remain indispensable for your projects.",
        link: "/resources/other",
        imgUrl: "/images/icons/other.svg",
        slug: "other",
        coverImgUrl: "/images/categories/other.jpg",
    },
];

export const resourceCategories = [
    "Tutorials",
    "UI_Libraries",
    "Tools",
    "Starters",
    "Other",
] as const;

export const resourceCategoriesSlug = [
    "tutorials",
    "ui-libraries",
    "tools",
    "starters",
    "other",
] as const;


const title = "Web Design Resources";
const description = "A platform for sharing the best design Resources around the web.";
const author = "Jay_Ohhh";

export const defaultMetadata: Metadata = {
    title,
    description,
    keywords: "Web Design,resources,applications,UI libraries,tools,starters,boilerplates,tutorials,articles,software",
    authors: [
        {
            name: author,
            url: "https://github.com/Jay-Ohhh",
        }
    ],
    creator: "Jay_Ohhh",
    publisher: "Jay_Ohhh",
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 5,
        viewportFit: "cover",
    },
    applicationName: title,
    colorScheme: "light dark",
    metadataBase: new URL(env.NEXT_PUBLIC_NEXTAUTH_URL),
    themeColor: [
        {
            media: "(prefers-color-scheme: light)",
            color: "#ffffff",
        },
        {
            media: "(prefers-color-scheme: dark)",
            color: "#0f172a",
        },
    ],
    category: "web app",
    openGraph: {
        title,
        description,
        url: env.NEXT_PUBLIC_NEXTAUTH_URL,
        siteName: "Web Design Resources",
        images: [
            {
                url: "/images/web-design-resources.jpg",
                width: 750,
                height: 480,
                alt: title,
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
        siteId: "1662405059479740416",
        creator: author,
        creatorId: "1662405059479740416",
        images: ["/images/web-design-resources.jpg",],
    },
    icons: {
        icon: "/favicon.ico",
        other: [
            {
                rel: "apple-touch-icon",
                sizes: "180x180",
                url: "/images/icons/logo.svg",
                fetchPriority: "low",
            },
            {
                rel: "mask-icon",
                url: "/images/icons/logo.svg",
                fetchPriority: "low",
            },
        ].filter(item => !!item.url) as any[]
    },
    other: {
        "applicable-device": "pc,mobile",
        "msapplication-TileColor": "#ffffff",
        // "baidu-site-verification": ""
    }
};