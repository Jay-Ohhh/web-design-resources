import { type Metadata, type Viewport } from "next";
import BaseProvider from "@/components/BaseProvider";
import Toaster from "@/components/Toast/Toaster";
import Footer from "@/components/Footer";
import { defaultMetadata, inter } from "@/lib/constants";
import Navbar from "@/components/NavBar";
import { env } from "@/env/server.mjs";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.scss";

type Props = {
  params: { id: string; };
  searchParams: { [key: string]: string | string[] | undefined; };
};

export const metadata: Metadata = defaultMetadata;

export function generateViewport({ params, searchParams }: Props): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    viewportFit: "cover",
    colorScheme: "light dark",
    themeColor: [
      {
        media: "(prefers-color-scheme: light)",
        color: "#ffffff",
      },
      {
        media: "(prefers-color-scheme: dark)",
        color: "#0f172a",
      },
    ]
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // fix hydration error for next-themes
      className="light"
      style={{
        colorScheme: "light",
      }}
    >
      <body className={inter.className}>
        <BaseProvider>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 text-black dark:from-slate-900 dark:to-slate-950 dark:text-white">
            <Navbar />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
            <Toaster />
          </div>
        </BaseProvider>
      </body>
      {/* Google Analytics automatically tracks pageviews when the browser history state changes. */}
      {/* https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries#tracking-pageviews */}
      {env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_ID} />}
    </html>
  );
}
