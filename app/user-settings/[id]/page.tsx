import { prisma } from "@/server/db";
import Image from "next/image";
import NotFoundPage from "../../not-found";
import Link from "@/components/ui/Link";
import { headers } from "next/headers";
import UAParser from "ua-parser-js";
import dayjs from "dayjs";
import DeleteAccountButton from "./DeleteAccountButton";
import { fetchServerSession } from "@/app/api/auth/[...nextauth]/authOptions";

type PageProps = {
    params: {
        id: string;
    };
};

export default async function UserSettings(props: PageProps) {
    const { params } = props;
    const session = await fetchServerSession();

    if (!session || (params.id !== session.user.id)) {
        return <NotFoundPage />;
    }

    const profile = await prisma.user.findUnique({
        where: {
            id: params.id,
        },
        include: {
            accounts: true,
        }
    });

    if (!profile) {
        return <NotFoundPage />;
    }

    const headersList = headers();
    const ip = headersList.get("x-current-ip");
    const ua = headersList.get("user-agent");
    // userAgent of 'next/server' can not parse device. 
    const userAgent = ua ? new UAParser(ua).getResult() : null;

    return (
        <div className="mx-auto flex max-w-screen-xl items-center justify-center px-4 py-12 md:py-18">
            <div className="flex flex-col flex-nowrap px-[38px] py-[32px] w-[40rem] max-w-[calc(100vw-0.75rem)] sm:max-w-[calc(100vw-5rem)] rounded-2xl bg-white shadow-[0_24px_48px_rgba(0,0,0,0.16)]">
                <div className="flex flex-col gap-[2rem]">
                    <div className="flex flex-col gap-[2rem]">
                        <div>
                            <h1 className="font-semibold text-[2rem] leading-normal text-black">
                                Account
                            </h1>
                            <p className="pt-2 text-[#000000a6]">
                                Manage your account information
                            </p>
                        </div>
                        <div>
                            <p className="mb-2 font-medium text-base leading-8 text-black border-b border-[rgba(0,0,0,0.06)]">
                                Profile
                            </p>
                            <Link
                                href={`/user/${profile?.id || ""}`}
                                className="group flex gap-4 items-center py-2.5 px-5 rounded-md cursor-pointer transition-colors hover:bg-[#0000000a]">
                                <Image
                                    alt={`${profile.name || ""} profile picture`}
                                    src={profile.image || "/images/icons/logo.svg"}
                                    className="w-[50px] h-[50px] rounded-full border border-slate-300"
                                    width={50}
                                    height={50}
                                />
                                <div className="flex-1 text-black">
                                    {profile.name}
                                </div>
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
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[2rem]">
                        <div>
                            <h1 className="font-semibold text-[2rem] leading-normal text-black">
                                Security
                            </h1>
                            <p className="pt-2 text-[#000000a6]">
                                Manage your security preferences
                            </p>
                        </div>
                        <div>
                            <p className="mb-2 font-medium text-base leading-8 text-black border-b border-[rgba(0,0,0,0.06)]">
                                Active devices
                            </p>
                            <div className="flex items-center gap-8 py-3 px-1">
                                <Image
                                    className="w-[80px] h-[80px]"
                                    src="/images/icons/device.svg"
                                    alt="device"
                                    width={80}
                                    height={80}
                                />
                                <div className="flex flex-col gap-1 text-[#000000a6] text-[13px]">
                                    <p className="text-black font-medium">{userAgent?.device.model}</p>
                                    <p>{userAgent?.browser.name} {userAgent?.browser.version}</p>
                                    <p>{userAgent?.device.model}</p>
                                    {ip && <p>{ip}</p>}
                                    <p>{dayjs(profile.signInAt).format("YYYY-MM-DD HH:mm:ss")}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="mb-2 font-medium text-base leading-8 text-black border-b border-[rgba(0,0,0,0.06)]">
                                Danger
                            </p>
                            <div className="flex justify-between items-center mt-2 ml-6 text-[13px]">
                                <div className="text-[#000000a6]">
                                    <p className="text-black font-medium">
                                        Delete Account
                                    </p>
                                    <p>Delete your account and all its associated data</p>
                                </div>
                                <DeleteAccountButton />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}