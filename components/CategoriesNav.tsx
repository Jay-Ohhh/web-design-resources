"use client";

import React from "react";
import Link from "@/components/ui/Link";
import Image from "next/image";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "./NavigationMenu";
import Button from "./ui/Button";
// https://www.prisma.io/docs/concepts/components/prisma-client/advanced-type-safety/operating-against-partial-structures-of-model-types
import { type NextResource } from "@prisma/client";

export type CategoriesNavProps = {
    resources: NextResource[];
    NavItemRenderer: React.ReactNode;
};

export default function CategoriesNav(props: CategoriesNavProps) {
    return (
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-start px-4 py-12">
            <NavigationMenu>
                <NavigationMenuList className="flex flex-wrap items-start justify-start gap-4 md:gap-0">
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>All</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <div className="grid h-96 w-64 grid-cols-1 gap-4 p-4 text-white md:w-[768px] md:grid-cols-5">
                                <Link
                                    href="/resources"
                                    className="group relative flex flex-col items-center justify-center gap-4 p-4 text-center md:col-span-3"
                                >
                                    <h3 className="z-20 text-2xl font-semibold">All resources</h3>
                                    <p className="z-20 text-sm">
                                        See every tool, library, package, starter, tutorial, and
                                        every other valuable resource available on the platform.
                                    </p>
                                    <Button className="z-50" variant="default" size="sm">
                                        Check all
                                    </Button>
                                    <div className="absolute left-0 top-0 z-10 h-full w-full rounded-xl bg-black/80 duration-200 group-hover:bg-black/60"></div>
                                    <Image
                                        fill
                                        alt="All cover"
                                        src="/images/categories/all.jpg"
                                        className="absolute left-0 top-0 h-full w-full rounded-xl object-cover"
                                    />
                                </Link>
                                <div className="hidden md:col-span-2 md:block">
                                    <h3 className="mb-4 text-lg font-medium text-slate-800 dark:text-slate-100">
                                        Most popular:
                                    </h3>
                                    <div className="flex flex-wrap gap-4">
                                        {props.resources?.slice(0, 5).map((item) => (
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
                    {props.NavItemRenderer}
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}