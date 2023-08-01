"use client";

import { useState } from "react";
import Link from "@/components/ui/Link";
import { type RouterOutputs, trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { badgeVariants } from "./ui/Badge";
import { buttonVariants } from "./ui/Button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/Tooltip";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import dynamic from "next/dynamic";
import Image from "next/image";
import { BsGithub } from "react-icons/bs";
import { cn } from "@/lib/common";
import { toast } from "./Toast/useToast";
const EditMenu = dynamic(() => import("./EditMenu"), { ssr: false });

export type Resource = RouterOutputs["resource"]["getAll"]["resources"][number] & { liked?: boolean; };

export type ResourceCardProps = {
    data: Resource;
    shadowEnabled: boolean;
    session: UserSession | null;
};

export default function ResourceCard(props: ResourceCardProps) {
    const { data, session } = props;
    const [cardData, setCardData] = useState<Resource | null>(data);
    const [favorite, setFavorite] = useState(cardData?.liked);
    const [likeCount, setLikeCount] = useState(cardData?.likesCount);
    const { mutate, isLoading } = trpc.like.create.useMutation({
        onSuccess: async () => { }
    });

    return cardData ? (
        <div className="flex flex-col justify-between rounded-xl border p-4 shadow-lg shadow-slate-950/5 dark:shadow-slate-500/5">
            <div className="flex items-center gap-2">
                <Image
                    alt="resource image"
                    className="flex-shrink-0 rounded-full"
                    src={cardData.githubAvatar || "/images/icons/logo.svg"}
                    width={40}
                    height={40}
                />
                <div className="flex w-full items-center justify-between gap-2">
                    <div className="flex flex-col">
                        <Link
                            href={`/resource/${cardData.id}`}
                            className="break-words"
                        >
                            {cardData.title}
                        </Link>
                        <p className="w-28 truncate text-slate-500 lg:w-60">
                            <Link
                                href={
                                    cardData.link.startsWith("https://")
                                        ? cardData.link
                                        : `https://${cardData.link}`
                                }
                                target="_blank"
                            >
                                {cardData.link.replace(/^(https?:\/\/)?(www\.)?/, "")}
                            </Link>
                        </p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <p className="text-lg">{likeCount}</p>

                            <button
                                className="flex h-8 w-8 items-center justify-center rounded-md border-2 p-1"
                                disabled={isLoading}
                                onClick={() => {
                                    if (session?.user?.id) {
                                        setLikeCount((prev) => prev! + (favorite ? -1 : 1));
                                        setFavorite(!favorite);
                                        mutate({
                                            resourceId: cardData.id,
                                            userId: session.user.id,
                                        });
                                    } else {
                                        toast({
                                            description: "You need to be signed in to like a resource.",
                                        });
                                    }
                                }}
                            >
                                <AnimatePresence>
                                    {favorite ? (
                                        <motion.div
                                            key={1}
                                            // https://www.framer.com/motion/component/##server-side-rendering
                                            initial={false}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                            exit={{ opacity: 0 }}
                                            className="relative"
                                        >
                                            <AiFillHeart className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-red-600" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key={2}
                                            initial={false}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                            exit={{ opacity: 0 }}
                                            className="relative"
                                        >
                                            <AiOutlineHeart className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-start">
                <p className="my-4 line-clamp-3 whitespace-pre-line">{cardData.description}</p>
                <div className="mb-4 flex flex-wrap gap-1">
                    {cardData.tags?.map((tag) => (
                        <Link
                            key={tag.id}
                            href={`/tag/${tag.name}`}
                            className={`${badgeVariants({ variant: "outline" })} mr-1`}
                        >
                            {tag.name}
                        </Link>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link
                        href={`/resource/${cardData.id}`}
                        className={buttonVariants({ variant: "default", size: "sm" })}
                    >
                        Details
                    </Link>

                    {cardData.githubLink && (
                        <Link
                            href={cardData.githubLink}
                            target="_blank"
                            className={cn(buttonVariants({ variant: "default", size: "sm" }), "w-9 h-9 p-0")}
                        >
                            <BsGithub size={20} />
                        </Link>
                    )}

                    {session?.user?.id === cardData.author?.id && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="flex">
                                    <EditMenu data={cardData} setData={setCardData} />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit resource</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
                {cardData.author && (
                    <h4 className="flex items-center justify-center gap-1">
                        <Link
                            className="flex items-center gap-1"
                            href={`/user/${cardData.authorId || ""}`}
                        >
                            <span className="w-24 truncate text-right">
                                {cardData.author.name}
                            </span>
                            {cardData.author.image && (
                                <Image
                                    className="h-7 w-7 rounded-full"
                                    src={cardData.author.image}
                                    alt={`${cardData.author.name || ""} profile picture`}
                                    width={28}
                                    height={28}
                                />
                            )}
                        </Link>
                    </h4>
                )}
            </div>
        </div>
    ) : null;
}