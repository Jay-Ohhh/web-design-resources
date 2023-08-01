"use client";

import { MdEditNote } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import Button from "@/components/ui/Button";
import { useForm, type SubmitHandler } from "react-hook-form";
import { inter } from "@/lib/constants";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/AlertDialog";
import Label from "./ui/Label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./ui/Popover";
import Textarea from "./ui/Textarea";
import LoadingSpinner from "./ui/LoadingSpinner";
import { Prisma } from "@prisma/client";
import { trpc } from "@/lib/trpc";
import { toast } from "./Toast/useToast";
import { SetStateAction, useState } from "react";

const commentWithUser = Prisma.validator<Prisma.CommentArgs>()({
    include: { user: true },
});

export type CommentData = Prisma.CommentGetPayload<typeof commentWithUser>;

export type EditCommentProps = {
    data: CommentData;
    setData: React.Dispatch<SetStateAction<CommentData | null>>;
};

type Inputs = {
    content: string;
};

export default function EditComment(props: EditCommentProps) {
    const { data, setData } = props;
    const [popOpen, setPopOpen] = useState(false);
    const {
        register,
        handleSubmit,
    } = useForm<Inputs>();

    const { mutate, isLoading: isLoadingUpdateComment } =
        trpc.comment.update.useMutation({
            onSuccess: async (data) => {
                toast({
                    description: "Updated the comment successfully 🎉",
                });
                setData(prev => ({
                    ...prev!,
                    ...data,
                }));
                setPopOpen(false);
            },
        });

    const { mutate: deleteComment, isLoading: isLoadingDeleteComment } =
        trpc.comment.delete.useMutation({
            onSuccess: async () => {
                toast({
                    description: "Comment deleted successfully 🎉",
                });
                setData(null);
                setPopOpen(false);
            },
        });

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        mutate({ content: data.content, commentId: props.data.id });
    };

    return (
        <Popover open={popOpen} onOpenChange={val => { setPopOpen(val); }}>
            <PopoverTrigger asChild>
                <Button
                    variant="default"
                    size="icon"
                    className="flex h-8 w-8 shrink-0 items-center justify-center"
                >
                    <MdEditNote className="h-full w-full p-1" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] sm:w-[500px]" align="end">
                <div>
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Edit</h4>
                        <p className="text-sm text-muted-foreground">Edit your comment.</p>
                    </div>
                    <div className="mt-2">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea
                                    id="text"
                                    defaultValue={data.content}
                                    {...register("content", {
                                        required: true,
                                        minLength: 1,
                                        maxLength: 400,
                                    })}
                                />
                            </div>

                            <div className="flex items-center mt-3">
                                <Button
                                    className="flex w-24 items-center justify-center gap-2"
                                    disabled={isLoadingUpdateComment}
                                    type="submit"
                                    variant="default"
                                    size="sm"
                                >
                                    {isLoadingUpdateComment ? <LoadingSpinner /> : "Save"}
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            type="button"
                                            className="flex h-9 w-9 shrink-0 ml-2"
                                            variant="destructive"
                                            size="icon"
                                        >
                                            {isLoadingDeleteComment ? <LoadingSpinner /> : <FaTrash />}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className={inter.className}>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete
                                                this comment from the database.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() =>
                                                    deleteComment({ commentId: data.id })
                                                }
                                            >
                                                Continue
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </form>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}