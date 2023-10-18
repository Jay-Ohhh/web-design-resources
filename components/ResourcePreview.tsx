"use client";

import { badgeVariants } from "./ui/Badge";
import { buttonVariants } from "./ui/Button";
import Image from "next/image";
import { useSession } from "next-auth/react";
import SiteLogo from "./SiteLogo";

export type ResourcePreviewProps = {
    title: string;
    description: string;
    link: string;
    tags: string;
};

const splitTagsToArray = (tags: string) => {
    return tags
        .replace(/\s/g, "")
        .split(/,|，/)
        .reduce((acc, tag) => {
            if (tag) {
                acc.push(
                    <button key={tag} className={badgeVariants({ variant: "outline" })}>
                        {tag}
                    </button>
                );
            }

            return acc;
        }, [] as React.ReactNode[]);
};

export default function ResourcePreview(props: ResourcePreviewProps) {
    const { data: session } = useSession();

    return (
        <div className="flex flex-col justify-between rounded-xl border p-4 shadow-lg shadow-slate-950/5 dark:shadow-slate-500/5">
            <div className="flex items-center gap-2">
                <SiteLogo
                    className="flex-shrink-0"
                    width={34}
                    height={34}
                />
                <div className="">
                    <div>
                        <p>{props.title}</p>
                    </div>
                    <div>
                        <p className="w-48 truncate text-slate-400">
                            {props.link.replace(/^(https?:\/\/)?(www\.)?/, "")}
                        </p>
                    </div>
                </div>
            </div>
            <div className="py-2">
                <p>{props.description}</p>
                <div className="my-2 flex flex-wrap gap-2">
                    {splitTagsToArray(props.tags)}
                </div>
            </div>
            <div className="flex items-center justify-between">
                <button className={buttonVariants({ variant: "default", size: "sm" })}>
                    See details
                </button>
                <h4 className="flex items-center justify-center gap-1">
                    <div className="flex items-center gap-1">
                        {session?.user?.name}
                        {session?.user?.image && (
                            <Image
                                alt={`${session?.user?.name} profile picture`}
                                className="h-7 w-7 rounded-full"
                                src={session.user.image}
                                width={28}
                                height={28}
                            />
                        )}
                    </div>
                </h4>
            </div>
        </div>
    );
}