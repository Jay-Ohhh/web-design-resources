"use client";

import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { Prisma } from "@prisma/client";
import { trpc } from "@/lib/trpc";
import { useForm, type SubmitHandler } from "react-hook-form";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useState } from "react";
import Comment from "@/components/Comment";
import { type CommentData } from "@/components/EditComment";
import { toast } from "@/components/Toast/useToast";

export type ResourceCommentProps = {
    comments: CommentData[];
    commentCount: number;
    session: UserSession | null;
    resourceId: string;
};

type Inputs = {
    content: string;
};

export default function ResourceComment(props: ResourceCommentProps) {
    const { commentCount, session, resourceId } = props;
    const [comments, setComments] = useState(props.comments);

    const {
        register,
        handleSubmit,
        reset,
        // formState: { errors },
    } = useForm<Inputs>();

    const { mutate: mutateComment, isLoading: isLoadingAddComment } = trpc.comment.create.useMutation({
        onSuccess: async (data) => {
            setComments(prev => [data, ...prev]);
            reset();
            toast({
                description: `Comment published successfully 🎉`,
            });
        },
    });

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        mutateComment({
            content: data.content,
            resourceId,
        });
    };

    return (
        <div className="mt-20 flex flex-col gap-4 rounded-xl border px-4 py-8 lg:px-12">
            <div>
                <h2 className="text-xl font-medium">
                    Comments {`(${commentCount})`}
                </h2>
            </div>
            {session?.user.id && (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col items-start gap-4"
                >
                    <Textarea
                        id="content"
                        {...register("content", {
                            required: true,
                            minLength: 1,
                            maxLength: 400,
                        })}
                        placeholder="Write something about this resource..."
                    />
                    <Button
                        className="flex w-full items-center justify-center gap-2 md:w-48"
                        disabled={isLoadingAddComment}
                        type="submit"
                        variant="default"
                        size="sm"
                    >
                        {isLoadingAddComment ? <LoadingSpinner /> : "Add comment"}
                    </Button>
                </form>
            )}
            <div className="mt-4 flex flex-col gap-4">
                {comments.map(item => (
                    <Comment key={item.id} data={item} session={session} />
                ))}
            </div>
        </div>
    );
}