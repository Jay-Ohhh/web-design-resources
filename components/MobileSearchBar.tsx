"use client";

import React, { useState } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { FaSearch } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const MobileSearchBar = () => {
    const [mobileSearchVisible, setMobileSearchVisible] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();

    return (
        <div className="md:hidden">
            <Button
                onClick={() => setMobileSearchVisible(true)}
                variant="default"
                size="icon"
                className="h-7 w-7 shrink-0"
            >
                <FaSearch />
            </Button>
            <AnimatePresence>
                {mobileSearchVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-0 z-[999] flex h-full w-full items-center bg-white dark:bg-slate-950"
                    >
                        <div className="flex h-1/2 w-full items-center justify-center border-none border-slate-800 px-4">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    void router.push(`/search?q=${query}`);
                                }}
                                className="relative h-full w-full"
                            >
                                <Input
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="h-full w-full rounded-xl"
                                    placeholder="Search..."
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 top-1/2 flex h-full w-10 -translate-y-1/2 items-center justify-center rounded-r-xl bg-slate-900"
                                >
                                    <FaSearch className="text-white" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMobileSearchVisible(false)}
                                    className="absolute right-12 top-1/2 flex h-full w-8 -translate-y-1/2 items-center justify-center"
                                >
                                    <MdClose size={24} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MobileSearchBar;
