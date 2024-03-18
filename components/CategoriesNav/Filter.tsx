"use client";

import useRouterRefresh from "@/hooks/useRouterRefresh";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import Checkbox from "../ui/Checkbox";

export default function Filter() {
    const refresh = useRouterRefresh();
    const pathname = usePathname();
    const urlObjRef = useRef<URL | null>(null);
    const searchParams = useSearchParams();
    const [checked, setChecked] = useState(!!searchParams.get("public"));

    useEffect(() => {
        urlObjRef.current = new URL(location.href);
    }, [searchParams]);

    return (
        <Suspense>
            <Checkbox
                id="open-source"
                label="Only Open Source"
                checked={checked}
                onCheckedChange={(val: boolean) => {
                    setChecked(val);

                    if (val) {
                        urlObjRef.current?.searchParams.set("public", "1");
                    } else {
                        urlObjRef.current?.searchParams.delete("public");
                    }

                    refresh(pathname + urlObjRef.current?.search);
                }}
            />
        </Suspense>
    );
}