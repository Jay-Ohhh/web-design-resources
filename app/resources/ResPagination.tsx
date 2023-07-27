"use client";

import Pagination, { type PaginationProps } from "@/components/ui/Pagination";
import { useRouter } from "next/navigation";

export default function ResPagination(props: PaginationProps) {
    const router = useRouter();

    return (
        <div className="flex justify-center">
            <Pagination
                page={props.page}
                pageSize={props.pageSize}
                total={props.total}
                onPageChange={(e, value) => {
                    router.push(`/resources?offset=${value - 1}`);
                }}
            />
        </div>
    );
}