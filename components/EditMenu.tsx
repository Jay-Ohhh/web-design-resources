"use client";

import { type SetStateAction, useState } from "react";
import { MdEditNote } from "react-icons/md";
import Button, { buttonVariants } from "./ui/Button";
import Input from "./ui/Input";
import { resourceCategories } from "@/lib/constants";
import { type Inputs } from "@/types/Inputs";
import { inter } from "@/lib/constants";
import Label from "./ui/Label";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/Select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/Sheet";
import { trpc } from "@/lib/trpc";
import Textarea from "./ui/Textarea";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import LoadingSpinner from "./ui/LoadingSpinner";
import { type MutationOptions } from "@tanstack/react-query";
import { type Resource } from "./ResourceCard";
import { toast } from "./Toast/useToast";
import { indexing } from "@/lib/client-fetch";

export type EditMenuProps = {
    data: Resource;
    setData: React.Dispatch<SetStateAction<Resource | null>>;
};

export default function EditMenu(props: EditMenuProps) {
    const { data, setData } = props;
    const [category, setCategory] = useState(data.category);
    const [formOpen, setFormOpen] = useState(false);

    const handleError: MutationOptions<any, any, any, any>["onError"] = (error) => {
        void toast({
            title: `An error occurred 🙁`,
            description: error.message,
        });
    };

    const { mutate, isLoading: isLoadingUpdate } = trpc.resource.update.useMutation({
        onSuccess: async (data) => {
            setFormOpen(prev => !prev);
            setData(data);
            toast({
                title: "Success 🎉",
                description: `Resource ${data.title} updated successfully.`,
            });
            indexing({
                resourceId: data.id,
                type: "URL_UPDATED"
            });
        },
        onError: handleError
    });

    const { mutate: mutateDelete, isLoading: isLoadingDelete } = trpc.resource.delete.useMutation({
        onSuccess: async (data) => {
            setData(null);
            toast({
                title: "Success 🎉",
                description: `Resource ${data.title} deleted successfully.`,
            });
            indexing({
                resourceId: data.id,
                type: "URL_DELETED"
            });
        },
        onError: handleError
    });

    const {
        register,
        handleSubmit,
        // formState: { errors },
    } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        const categorySlug = data.category.toLowerCase().replace("_", "-");
        mutate({ ...data, categorySlug, resourceId: props.data.id });
    };

    return (
        <Sheet open={formOpen} onOpenChange={setFormOpen}>
            <SheetTrigger asChild>
                <div
                    className={`${buttonVariants({
                        size: "icon",
                        variant: "default",
                    })} flex h-9 w-9 shrink-0 items-center justify-center`}
                >
                    <MdEditNote className="h-full w-full p-1" />
                </div>
            </SheetTrigger>
            <SheetContent className={`z-50 p-3 md:p-6 ${inter.className}`}>
                <SheetHeader>
                    <SheetTitle>Edit resource</SheetTitle>
                    <SheetDescription>
                        Save changes after you&apos;re done editing this resource.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right text-xs md:text-sm">
                            Title
                        </Label>
                        <Input
                            id="title"
                            defaultValue={data.title}
                            {...register("title", {
                                required: true,
                                minLength: 1,
                                maxLength: 50,
                            })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="link" className="text-right text-xs md:text-sm">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={data.link}
                            {...register("link", {
                                required: true,
                                minLength: 1,
                                maxLength: 250,
                            })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                            htmlFor="githubLink"
                            className="text-right text-xs md:text-sm"
                        >
                            GitHub
                        </Label>
                        <Input
                            id="githubLink"
                            defaultValue={data.githubLink || ""}
                            {...register("githubLink", {
                                maxLength: 250,
                            })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                            htmlFor="description"
                            className="text-right text-xs md:text-sm"
                        >
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            defaultValue={data.description}
                            {...register("description", {
                                required: true,
                                minLength: 1,
                                maxLength: 400,
                            })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tags" className="text-right text-xs md:text-sm">
                            Tags
                        </Label>
                        <Textarea
                            id="tags"
                            defaultValue={data.tags
                                .map((tag) => tag.name)
                                .join(",")
                                .replace(/\s/g, "")}
                            {...register("tags", {
                                required: true,
                                minLength: 1,
                                maxLength: 100,
                            })}
                            className="col-span-3"
                        />
                    </div>
                    <Select
                        value={category}
                        onValueChange={(e) => setCategory(e as typeof resourceCategories[number])}
                    >
                        <SelectTrigger
                            value={category}
                            className="w-full"
                            {...register("category", { required: true })}
                        >
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {resourceCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button className="font-medium" type="submit" disabled={isLoadingUpdate}>
                        {isLoadingUpdate ? <LoadingSpinner /> : "Update resource"}
                    </Button>
                </form>
                <div className="mt-5 flex justify-center">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                type="button"
                                className="flex h-8 w-8 shrink-0"
                                variant="destructive"
                                size="icon"
                                disabled={isLoadingDelete}
                            >
                                {isLoadingDelete ? <LoadingSpinner /> : <FaTrash />}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className={inter.className}>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete
                                    this resource from the database.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => {
                                        mutateDelete({ resourceId: data.id });
                                    }}
                                >
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </SheetContent>
        </Sheet>
    );
}