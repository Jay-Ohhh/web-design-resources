import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { env } from "@/env/server.mjs";
import { type Metadata } from "next";
import { defaultMetadata } from "@/lib/constants";

export const metadata: Metadata = { ...defaultMetadata, title: "Privacy Policy" };

export default function TermsAndConditions() {
    return (
        <div className="mx-auto max-w-screen-xl px-4 py-12 text-justify md:py-24">
            <h1 className="mb-8 text-2xl font-bold md:text-4xl">
                Privacy Policy
            </h1>
            <ul className="text-sm md:text-base">
                <h3 className="mb-4 text-xl font-medium">
                    1. Resource Sharing
                </h3>
                <li>
                    The Platform is a website dedicated to sharing the best design resources around the web.
                    These resources, including tools,
                    libraries, tutorials, starters, and other related content, are
                    shared on the Platform for informational purposes. Please note that
                    these resources are not owned by the Platform and are provided by
                    various contributors.
                </li>
                <h3 className="my-4 text-xl font-medium">
                    2. To Whom Does This Policy Apply
                </h3>
                <li>
                    This Privacy Policy applies to customers and site visitors.
                    Each customer is responsible for posting its own terms, conditions,
                    and privacy policies, and ensuring compliance with all applicable laws and regulations.
                </li>
                <h3 className="my-4 text-xl font-medium">
                    3. Changes To This Privacy Policy
                </h3>
                <li>
                    This Privacy Policy may change from time to time, as our Platform and our business may change.
                    Your continued use of the Platform after any changes to
                    this Privacy Policy indicates your agreement with the terms of the revised Privacy Policy.
                </li>
                <h3 className="my-4 text-xl font-medium">
                    4. What Information Do We Collect
                </h3>
                <li>
                    We collect information directly from you when you provide it to us explicitly on our Site.
                    We do not use third-party cookies on our Site.
                </li>
                <h3 className="my-4 text-xl font-medium">
                    5. What We Use Your Information For
                </h3>
                <li>
                    We use your information to provide our Services, to improve our Platform,
                    and to understand how you use our Platform.
                </li>
            </ul>
            <div className="my-8 text-left">
                If you have any questions, please contact me at{" "}
                <Link
                    href={`mailto:${env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                    className={buttonVariants({ variant: "link", size: "link" })}
                >
                    {env.NEXT_PUBLIC_CONTACT_EMAIL}
                </Link>
                .
            </div>
        </div>
    );
};
