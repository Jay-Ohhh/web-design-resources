"use client";

import { AiFillGithub, AiOutlineLoading } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SignButton() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/profile";
    const [disabled, setDisabled] = useState(false);

    return (
        <button
            className="group w-full flex justify-between items-center px-5 py-2 border outline-none rounded-md text-[13px] transition hover:bg-[#f5f5f5] disabled:bg-[#f5f5f5] disabled:pointer-events-none"
            disabled={disabled}
            onClick={async () => {
                try {
                    setDisabled(true);
                    await signIn("github", { callbackUrl });
                } finally {
                    setDisabled(false);
                }
            }}
        >
            <AiFillGithub className="relative -top-[1px]" size={18} />
            <div className="flex-1 ml-5 text-left">Continue with GitHub</div>
            {disabled ? (
                <div className="animation-in spin-in-0 animate-out spin-out-[360deg] repeat-infinite duration-700 ease-linear">
                    <AiOutlineLoading color="#999" />
                </div>
            ) : (
                <div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="#999"
                        viewBox="0 0 20 20"
                        className="w-4 h-4 -translate-x-2 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.3 10h13.4m-5-5 5 5-5 5" />
                    </svg>
                </div>
            )}
        </button>
    );
}