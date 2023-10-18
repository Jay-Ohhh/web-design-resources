"use client";

import Link from "next/link";
import { inter } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { useSession, signOut } from "next-auth/react";

export default function DropdownAvatar() {
  const { data: session } = useSession() as { data: UserSession | null; };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {session?.user?.image && (
          <Avatar className="border-2">
            <AvatarImage
              src={session.user.image}
              alt="User profile image"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`${inter.className} min-w-[250px] p-2 rounded-xl box-shadow`}>
        <DropdownMenuLabel className="font-bold">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            className="block w-full dark:text-slate-100"
            href={`/user/${session?.user?.id || ""}`}
          >
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            className="block w-full dark:text-slate-100"
            href="/resources/add"
          >
            Add Resource
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            className="block w-full dark:text-slate-100"
            href="/resources"
          >
            View Resources
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            className="block w-full dark:text-slate-100"
            href="/terms-and-conditions"
          >
            Terms &amp; Conditions
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            className="block w-full dark:text-slate-100"
            href={`/user-settings/${session?.user?.id || ""}`}
          >
            Account Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <button
            className="flex w-full font-semibold text-[#F31260]"
            onClick={() => {
              signOut();
            }}>
            Log out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
