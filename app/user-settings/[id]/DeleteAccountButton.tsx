"use client";

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
} from "@/components/ui/AlertDialog";
import { inter } from "@/lib/constants";
import Input from "@/components/ui/Input";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function DeleteAccountButton() {
    const [value, setValue] = useState("");
    const confirmText = "Delete account";

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="py-2.5 px-5 rounded-md text-[12px] text-white font-semibold bg-[#FF0000]">
                    DELETE ACCOUNT
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent className={inter.className}>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="mb-2">This action is permanent and irreversible.</div>
                        <div className="mb-2">{`Type ${confirmText} below to continue.`}</div>
                        <label className="block mb-1 font-medium" htmlFor="confirmation">
                            Confirmation
                        </label>
                        <Input
                            id="confirmation"
                            placeholder={confirmText}
                            value={value}
                            onChange={e => {
                                setValue(e.target.value);
                            }}
                        />
                        <div className="my-2 italic">Note: this feature has not been implemented yet.</div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => { setValue(""); }}>CANCEL</AlertDialogCancel>
                    <AlertDialogAction
                        className="text-white !bg-[#FF0000]"
                        disabled={value !== confirmText}
                    >
                        {confirmText.toUpperCase()}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}