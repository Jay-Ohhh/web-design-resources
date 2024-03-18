"use client";

import React, { useState } from "react";
import Input from "./ui/Input";
import { FaSearch } from "react-icons/fa";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SearchBar = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const _query = searchParams.get("query") || "";
    const [query, setQuery] = useState(pathname === "/search" ? _query : "");
    const router = useRouter();

    return (
        <div className="hidden md:flex md:justify-center">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    query.trim() && router.push(`/search?query=${query}`);
                }}
                className="relative w-80 lg:w-96"
                autoComplete="off"
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
