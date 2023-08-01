"use client";

import Pagination, { type PaginationProps } from "@/components/ui/Pagination";
import useRouterRefresh from "@/hooks/useRouterRefresh";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function ResPagination(props: PaginationProps) {
    const refresh = useRouterRefresh();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const urlObjRef = useRef<URL | null>(null);

    useEffect(() => {
        urlObjRef.current = new URL(location.href);
    }, [searchParams]);

    return (
        <div className="flex justify-center">
            <Pagination
                page={props.page}
                pageSize={props.pageSize}
                total={props.total}
                onPageChange={(e, value) => {
                    urlObjRef.current?.searchParams.set("offset", String(value - 1));
                    refresh(pathname + urlObjRef.current?.search);
                }}
            />
        </div>
    );
}