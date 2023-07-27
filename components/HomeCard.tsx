"use client";

import { Grid, Text } from "@nextui-org/react";
import { buttonVariants } from "./ui/Button";
import Link from "@/components/ui/Link";
import Image from "next/image";
type Props = {
    title: string;
    description: string;
    link: string;
    imgUrl: string;
};
export default function SingleCard(props: Props) {
    const { title, description, link, imgUrl } = props;
    return (
        <div className="flex w-full flex-col justify-between gap-3 rounded-xl border bg-gradient-to-tr from-slate-50 to-slate-100 p-4 text-left dark:from-slate-950 dark:to-slate-950/20">
            <div className="flex items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 shadow-md shadow-slate-900/20">
                    <Image
                        className="w-5 h-5"
                        src={imgUrl}
                        alt={title}
                        width={20}
                        height={20}
                    />
                </div>
                <Grid.Container css={{ ml: "$6" }}>
                    <Grid xs={12}>
                        <h3 className="font-semibold md:text-lg">{title}</h3>
                    </Grid>
                </Grid.Container>
            </div>
            <div>
                <p>{description}</p>
            </div>
            <div>
                <Link
                    href={link}
                    className={buttonVariants({ variant: "default", size: "sm" })}
                >
                    See {title}
                </Link>
            </div>
        </div>
    );
}
