"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { trpc } from "@/lib/trpc";
import { resourceCategories } from "@/lib/constants";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { type Inputs } from "@/types/Inputs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useState } from "react";
import Label from "@/components/ui/Label";
import { useRouter } from "next/navigation";
import ResourcePreview from "@/components/ResourcePreview";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useSession } from "next-auth/react";
import { toast } from "@/components/Toast/useToast";
import { env } from "@/env/client.mjs";
import { indexing } from "@/lib/client-fetch";

export default function AddForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [link, setLink] = useState("");
    const [category, setCategory] = useState("");
    const router = useRouter();
    const { data: session } = useSession() as unknown as { data: UserSession; };

    const { mutate, isLoading: isLoadingAdd } = trpc.resource.create.useMutation({
        onSuccess: (data) => {
            router.push(
                `/resources/${category.toLowerCase().replaceAll("_", "-")}`
            );
            indexing({
                resourceId: data.id,
                type: "URL_UPDATED"
            });
        },
        onError: (error) => {
            toast({
                title: `An error occurred 🙁`,
                description: error.message,
            });
        },
    });

    const { register, handleSubmit } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        const categorySlug = data.category.toLowerCase().replaceAll("_", "-");
        mutate({ ...data, categorySlug, authType: session.user?.authType });
    };

    return (
        <>
            <form
                className="w-full md:w-1/2"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex w-full flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="Title"
                            {...register("title", {
                                onChange(e: React.ChangeEvent<HTMLInputElement>) {
                                    setTitle(e.target.value);
                                },
                                required: true,
                                minLength: 1,
                                maxLength: 50,
                            })}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="link">Resource link</Label>
                        <Input
                            id="link"
                            placeholder="https://nextjs.org/"
                            {...register("link", {
                                onChange(e: React.ChangeEvent<HTMLInputElement>) {
                                    setLink(e.target.value);
                                },
                                required: true,
                                minLength: 1,
                                maxLength: 250,
                            })}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="githubLink">
                            Resource GitHub link (Optional, used to fetch GitHub data)
                        </Label>
                        <Input
                            id="githubLink"
                            placeholder="https://github.com/vercel/next.js"
                            {...register("githubLink", {
                                maxLength: 250,
                            })}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="description">Description</Label>

                        <Textarea
                            id="description"
                            rows={6}
                            {...register("description", {
                                onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
                                    setDescription(e.target.value);
                                },
                                required: true,
                                minLength: 1,
                                maxLength: 400,
                            })}
                            placeholder="Enter short description of this resource."
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="tags">Tags</Label>

                        <Textarea
                            id="tags"
                            rows={6}
                            {...register("tags", {
                                onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
                                    setTags(e.target.value);
                                },
                                required: true,
                                minLength: 1,
                                maxLength: 100,
                            })}
                            placeholder="Enter tags separated with a comma."
                        />
                    </div>

                    <Select onValueChange={(val) => setCategory(val)}>
                        <SelectTrigger
                            value={category}
                            className="w-full"
                            {...register("category", { required: true })}
                        >
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {resourceCategories.map((category, index) => (
                                <SelectItem key={index} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        className="flex w-full items-center justify-center gap-2 md:w-64"
                        disabled={isLoadingAdd}
                        variant="default"
                        type="submit"
                    >
                        {isLoadingAdd ? <LoadingSpinner /> : "Add resource"}
                    </Button>
                </div>
            </form>
            <div className="w-full md:w-1/2">
                <h3 className="mb-4 text-2xl font-semibold">Preview</h3>
                <ResourcePreview
                    description={description}
                    link={link}
                    tags={tags}
                    title={title}
                />
            </div>
        </>
    );
}