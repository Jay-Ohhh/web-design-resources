"use client";

import Link from "@/components/ui/Link";
import { AiFillGithub } from "react-icons/ai";
import SiteLogo from "./SiteLogo";
import { githubRepoUrl } from "@/lib/constants";

const Footer = () => {

    return (
        <footer>
            <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <Link href="/" className="flex items-center">
                            <SiteLogo
                                className="mr-3 w-10"
                                width={40}
                                height={40}
                            />
                            <span className="text-lg">Web Design Resources</span>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-slate-900 dark:text-white">
                                Navigation
                            </h2>
                            <ul className="font-medium text-slate-800 dark:text-slate-50">
                                <li className="mb-4">
                                    <Link href="/" className="text-sm font-light hover:underline">
                                        Homepage
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/resources"
                                        className="text-sm font-light hover:underline"
                                    >
                                        Resources
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-slate-900 dark:text-white">
                                Links
                            </h2>
                            <ul className="font-medium text-slate-800 dark:text-slate-50">
                                <li className="mb-4">
                                    <Link
                                        target="_blank"
                                        href={githubRepoUrl}
                                        className="text-sm font-light hover:underline "
                                    >
                                        GitHub
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-slate-900 dark:text-white">
                                Help
                            </h2>
                            <ul className="font-medium text-slate-800 dark:text-slate-50">
                                <li className="mb-4">
                                    <Link
                                        href="/terms-and-conditions"
                                        className="text-sm font-light hover:underline"
                                    >
                                        Terms &amp; Conditions
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-300 sm:text-center">
                        © 2023{" "}
                        <Link href="/" className="text-sm hover:underline">
                            Web Design Resources
                        </Link>
                    </span>
                    <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
                        <Link
                            href={githubRepoUrl}
                            target="_blank"
                            className="hover text-slate-500 duration-200 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                        >
                            <AiFillGithub size={32} />
                            <span className="sr-only">GitHub account</span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
