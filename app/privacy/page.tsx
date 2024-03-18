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
            <p className="mb-4">
                The Platform is a website dedicated to sharing the best design resources around the web.
                These resources, including tools,
                libraries, tutorials, starters, and other related content, are
                shared on the Platform for informational purposes. Please note that
                these resources are not owned by the Platform and are provided by
                various contributors.
            </p>
            <p className="mb-4">
                We value your privacy and are dedicated to protecting your personal data.
                If you have any questions, comments, or concerns regarding this Privacy Policy,
                our data practices, or would like to exercise your rights, do not hesitate to contact us.
            </p>
            <ul className="text-sm md:text-base">
                <h3 className="mb-4 text-xl font-medium">
                    1. Data Collection and Purpose
                </h3>
                <li>
                    With your explicit consent and authorization, we collect only the user{`'`}s name and email address as necessary information
                    to provide services or for identity verification. The username is required for
                    submitting articles and comments, while the email address is used for notifying
                    users about changes to the privacy policy or receiving user feedback.
                </li>
                <h3 className="my-4 text-xl font-medium">
                    2. Data Security
                </h3>
                <li>
                    We employ industry-standard security measures, including data encryption and
                    access controls, to protect your information from unauthorized access, disclosure,
                    or damage. Additionally, we do not sell, rent, or share your personal information in any way.
                </li>
                <h3 className="my-4 text-xl font-medium">
                    3. User Permissions
                </h3>
                <li>
                    You have the right to revoke access to our application at any time. When using the Platform,
                    You have the option to delete your account and data by accessing the{" "}
                    <Link
                        href="/user-settings"
                        className={buttonVariants({ variant: "link", size: "link" })}
                    >
                        Account Settings
                    </Link>{" "}
                    section of the Platform.
                </li>
                <h3 className="my-4 text-xl font-medium">
                    4. Changes to This Privacy Policy
                </h3>
                <li>
                    We may update our privacy policy from time to time. Any changes
                    will be posted on this page. If there are any significant changes in how we handle
                    personal information, we will notify you promptly and seek your authorization.
                </li>
                <h3 className="my-4 text-xl font-medium">
                    5. How to Contact Us
                </h3>
                <li>
                    If you have any questions or concerns about our Privacy Policy, please contact us at{" "}
                    <Link
                        href={`mailto:${env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                        className={buttonVariants({ variant: "link", size: "link" })}
                    >
                        {env.NEXT_PUBLIC_CONTACT_EMAIL}
                    </Link>
                    .
                </li>
            </ul>
        </div>
    );
};
