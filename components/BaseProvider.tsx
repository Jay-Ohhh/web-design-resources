"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import TrpcProvider from "./TrpcProvider";

type Props = {
    children?: React.ReactNode;
};

const BaseProvider = ({ children }: Props) => {
    return (
        <TrpcProvider>
            <SessionProvider>
                <ThemeProvider defaultTheme="light" attribute="class">
                    {children}
                </ThemeProvider>
            </SessionProvider>
        </TrpcProvider>
    );
};

export default BaseProvider;