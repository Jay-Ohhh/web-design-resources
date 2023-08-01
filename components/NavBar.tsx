"use client";

import Link from "@/components/ui/Link";
import Button, { buttonVariants } from "./ui/Button";
import { FaPlus } from "react-icons/fa";
import { MdLogin } from "react-icons/md";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/Tooltip";
import { signIn, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import DropdownAvatar from "./DropdownAvatar";
import SearchBar from "./SearchBar";
import MobileSearchBar from "./MobileSearchBar";
import ThemeSwitch from "./ThemeSwitch";
import Image from "next/image";

export default function Navbar() {
    const { theme } = useTheme();
    const { status } = useSession();

    return (
        <nav className="sticky z-50 top-0 border-b-2 border-gray-200 bg-gradient-to-br dark:border-gray-800">
            <div className="mx-auto flex h-20 max-w-screen-xl flex-wrap items-center justify-between px-4 md:grid md:grid-cols-5">
                <Link href="/" className="flex max-w-fit items-center">
                    <Image
                        src={theme === "dark" ? "/images/icons/logo-dark.svg" : "/images/icons/logo.svg"}
                        alt="Site logo"
                        className="mr-3 w-10"
                        width={40}
                        height={40}
                    />
                </Link>
                <SearchBar />
                <div className="flex items-center justify-end gap-3">
                    <ThemeSwitch />
                    <MobileSearchBar />
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Link
                                    href="/resources"
                                    className={`${buttonVariants({
                                        variant: "default",
                                        size: "icon",
                                    })} flex h-7 w-7 shrink-0 items-center justify-center`}
                                >
                                    <span className="text-[17px]">R</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Explore resources</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    {status === "authenticated" ? (
                        <div className="flex items-center gap-3">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Link
                                            href="/resources/add"
                                            className={`${buttonVariants({
                                                variant: "default",
                                                size: "icon",
                                            })} flex h-7 w-7 shrink-0 items-center justify-center`}
                                        >
                                            <FaPlus className="w-full" />
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Add new resource</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <DropdownAvatar />
                        </div>
                    ) : (
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                                signIn();
                            }}
                        >
                            <h4 className="flex items-center justify-center gap-2 text-base">
                                <MdLogin className="h-4 w-4" />
                                <span>Sign in</span>
                            </h4>
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}