import Link from "next/link";
import Head from "next/head";
import React from "react";
import { buttonVariants } from "@/components/ui/Button";
import { type Metadata } from "next";

export const metadata: Metadata = {
    title: "404 - Not found",
};

export default function NotFoundPage() {
    return (
        <main className="mx-auto flex  w-full max-w-screen-xl flex-col items-center justify-start gap-14 px-4 py-36 text-center">
            <h2 className="text-3xl font-bold md:text-5xl">
                404 | Page not found
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/" className={buttonVariants({ variant: "outline" })}>
                    <span className="flex items-center justify-center gap-1">
                        Homepage
                    </span>
                </Link>
                <Link href="/resources" className={buttonVariants()}>
                    Explore resources
                </Link>
            </div>
        </main>
    );
};
