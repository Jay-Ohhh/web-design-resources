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


