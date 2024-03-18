import { Suspense } from "react";
import SignButton from "./SignInButton";

export default function Login() {
    return (
        <div className="flex items-start justify-center py-28">
            <div className="box-border not-italic ">
                <div className="flex flex-col flex-nowrap items-stretch justify-start gap-8 rounded-lg bg-white transition-all duration-200 w-[400px] max-w-[calc(100vw-3rem)] mx-7 py-[38px] px-7 shadow-[0_24px_48px_rgba(0,0,0,0.16)]">
                    <div className="flex flex-col flex-nowrap items-stretch justify-start gap-1">
                        <h1 className="box-border text-black m-0 font-semibold text-xl leading-normal">
                            Sign in
                        </h1>
                        <p className="box-border m-0 text-base font-normal leading-tight text-[#000000a5]">
                            to continue to Web-Design-Resources
                        </p>
                    </div>
                    <Suspense>
                        <SignButton />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}