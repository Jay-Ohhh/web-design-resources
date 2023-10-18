"use client";

import Image from "next/image";
import Link from "./ui/Link";
import dayjs from "dayjs";
import EditComment, { CommentData } from "./EditComment";
import { useState } from "react";

export type CommentProps = {
    data: CommentData;
    session: UserSession | null;
};

export default function Comment(props: CommentProps) {
    const { session } = props;
    const [data, setData] = useState<CommentData | null>(props.data);

    return (
        data ? (
            <div className="rounded-xl border px-4 py-6">
                <div className="flex">
                    <Link
                        href={`/user/${data.userId || ""}`}
                    >
                        <Image
                            alt={`${data.user.image || ""} profile picture`}
                            src={data.user.image || "/images/icons/logo.svg"}
                            className="w-12 h-12 rounded-full"
                            width={48}
                            height={48}
                        />
                    </Link>
                    <div className="ml-2 flex flex-col items-between">
                        <Link
                            className="text-lg font-medium"
                            href={`/user/${data.userId || ""}`}
                        >
                            {data.user.name}
                        </Link>
                        <span className="text-sm">
                            {dayjs(data.createdAt).format("YYYY-MM-DD HH:mm")}
                        </span>
                    </div>
                </div>
                <div className="mt-4 flex items-end justify-between gap-6">
                    <p className="whitespace-pre-line text-sm md:text-base">{data.content}</p>
                    {session?.user?.id === data.userId && (
                        <EditComment data={data} setData={setData} />
                    )}
                </div>
            </div >
        ) : null
    );
}