"use client";

import useRouterRefresh from "@/hooks/useRouterRefresh";
import { type HTMLAttributes } from "react";

export type ButtonLinkProps = {
    url: string;
} & HTMLAttributes<HTMLButtonElement>;

export default function ButtonLink({ url, children, ...props }: ButtonLinkProps) {
    const refresh = useRouterRefresh();

    return (
        <button
            {...props}
            onClick={(e) => {
                props.onClick?.(e);
                url && refresh(url);
            }}
        >
            {children}
        </button>
    );
}