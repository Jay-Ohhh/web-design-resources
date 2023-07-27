import {
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuTrigger,
} from "@/components/NavigationMenu";
import Link from "@/components/ui/Link";
import Image from "next/image";
import { prisma } from "@/server/db";
import { resourceCategoriesSlug } from "@/lib/constants";

export type SingleCategoryNavItemProps = {
    title: string;
    link: string;
    description: string;
    coverImgUrl: string;
    slug: typeof resourceCategoriesSlug[number];
};

export default async function SingleCategoryNavItem(props: SingleCategoryNavItemProps) {
    const {
        title,
        link,
        description,
        coverImgUrl,
        slug,
    } = props;

    const resources = await prisma.nextResource.findMany({
        skip: 0,
        take: 5,
        where: {
            categorySlug: slug,
        },
        orderBy: {
            likesCount: "desc"
        },
    });

    return (
        <NavigationMenuItem>
            <NavigationMenuTrigger>{title}</NavigationMenuTrigger>
            <NavigationMenuContent>
                <div className="grid h-96 w-64 grid-cols-1 gap-4 p-4 text-white md:w-[768px] md:grid-cols-5">
                    <Link
                        href={link}
                        className="group relative flex flex-col items-center justify-center gap-4 p-4 text-center md:col-span-3"
                    >
                        <h3 className="z-20 text-2xl font-semibold">{title}</h3>
                        <p className="z-20 text-sm">{description}</p>
                        <div className="absolute left-0 top-0 z-10 h-full w-full rounded-xl bg-black/80 duration-200 group-hover:bg-black/60"></div>
                        <Image
                            fill
                            alt={`${title} cover image`}
                            src={coverImgUrl}
                            className="absolute left-0 top-0 h-full w-full rounded-xl object-cover"
                        />
                    </Link>
                    <div className="hidden md:col-span-2 md:block">
                        <h3 className="mb-4 text-lg font-medium text-slate-800 dark:text-slate-100">
                            Most popular:
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            {resources?.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.link}
                                    target="_blank"
                                    className="rounded-lg bg-slate-950 px-4 py-1.5 text-sm"
                                >
                                    {item.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </NavigationMenuContent>
        </NavigationMenuItem>
    );
}