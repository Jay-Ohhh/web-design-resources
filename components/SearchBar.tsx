"use client";

import React, { useState } from "react";
import Input from "./ui/Input";
import { FaSearch } from "react-icons/fa";
import useRouterRefresh from "@/hooks/useRouterRefresh";
import { usePathname, useSearchParams } from "next/navigation";

const SearchBar = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const _query = searchParams.get("query") || "";
    const [query, setQuery] = useState(pathname === "/search" ? _query : "");
    const refresh = useRouterRefresh();

    return (
        <div className="col-span-3 hidden justify-center md:flex">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    refresh(`/search?query=${query}`);
                }}
                className="relative w-96"
            >
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full rounded-xl"
                />
                <button
                    type="submit"
                    className="absolute right-0 top-1/2 flex h-full w-10 -translate-y-1/2 items-center justify-center rounded-r-xl bg-slate-900"
                >
                    <FaSearch className="text-white" />
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
