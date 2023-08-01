"use client";

import { GithubData } from "@/types/GithubData";
import { type Resource } from "@/components/ResourceCard";
import { useState } from "react";
import Image from "next/image";
import Link from "@/components/ui/Link";
import { AiFillGithub, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { buttonVariants } from "@/components/ui/Button";
import { FaRegDotCircle, FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { cn, numberFormatter } from "@/lib/common";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/Tooltip";
import { trpc } from "@/lib/trpc";
import dynamic from "next/dynamic";
import { toast } from "@/components/Toast/useToast";
import { badgeVariants } from "@/components/ui/Badge";
const EditMenu = dynamic(() => import("@/components/EditMenu"), { ssr: false });

export type ResourceProps = {
    session: UserSession | null;
    githubData?: GithubData;
    data: Resource;
};

export default function Resource(props: ResourceProps) {
    const { session, githubData, data } = props;
    const [cardData, setCardData] = useState(data);
    const [favorite, setFavorite] = useState(cardData.liked);
    const [likeCount, setLikeCount] = useState(cardData.likesCount);
    const { mutate, isLoading } = trpc.like.create.useMutation({
        onSuccess: async () => { }
    });

    return (
        <div className="px-4 py-8 rounded-lg border lg:px-12">
            <div className="flex flex-wrap sm:justify-between" >
                <div className="flex w-full justify-between sm:w-auto sm:justify-start">
                    <div className="flex flex-col gap-2">
                        <Image
                            src={githubData?.owner.avatar_url || "/images/icons/logo.svg"}
                            alt={cardData.title}
                            className="w-24 h-24 rounded-full"
                            width={96}
                            height={96}
                        />
                        <h3 className="font-medium">
                            {cardData.title}
                        </h3>
                    </div>
                    <div className="flex flex-col justify-between sm:ml-20">
                        {githubData && (
                            <Link target="_blank" href={githubData.html_url}>
                                <AiFillGithub size={32} />
                            </Link>
                        )}
                        <Link
                            target="_blank"
                            href={cardData.link}
                            className={cn(buttonVariants({ variant: "link", size: "link" }), "inline-block max-w-[160px] truncate")}
                        >
                            {cardData.link}
                        </Link>
                        {githubData && (
                            <>
                                <span className="flex items-center gap-1 font-medium">
                                    <FaStar />
                                    {numberFormatter(githubData.stargazers_count)}
                                </span>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <span className="flex items-center gap-1 font-medium">
                                                <FaRegDotCircle />
                                                {numberFormatter(githubData.open_issues_count)}
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent showArrow={false}>
                                            <p>issues count</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex justify-between mt-5 w-full sm:flex-col sm:w-auto sm:mt-0">
                    <div className="flex items-center">
                        <button
                            className="flex w-9 h-9 items-center justify-center rounded-md border-2 p-1"
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
                                        <AiFillHeart size={20} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-red-600" />
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
                                        <AiOutlineHeart size={20} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                        <span className="ml-2">{numberFormatter(likeCount)}</span>
                    </div>
                    <Link
                        className="flex items-center gap-1"
                        href={`/user/${cardData.authorId}`}
                    >
                        {cardData.author.image && (
                            <Image
                                className="w-9 h-9 rounded-full border-2"
                                src={cardData.author.image}
                                alt={`${cardData.author.name} profile picture`}
                                width={32}
                                height={32}
                            />
                        )}
                        <span>{cardData.author.name}</span>
                    </Link>
                    {session?.user.id === cardData.author.id && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="flex">
                                    <EditMenu data={cardData} setData={setCardData as any} />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit resource</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            </div >

            <div className="mt-12 flex w-full justify-start md:col-span-5">
                <p className="leading-relaxed whitespace-pre-line md:text-lg">
                    {cardData.description}
                </p>
            </div>
            <div className="mt-8 flex w-full flex-wrap items-start justify-start gap-3 md:col-span-5">
                {cardData.tags.map((tag) => (
                    <Link
                        key={tag.id}
                        href={`/tag/${tag.name}`}
                        className={badgeVariants({ variant: "default" })}
                    >
                        {tag.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}