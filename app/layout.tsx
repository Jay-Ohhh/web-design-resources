import "./globals.scss";
import type { Metadata } from "next";
import BaseProvider from "@/components/BaseProvider";
import Toaster from "@/components/Toast/Toaster";
import Footer from "@/components/Footer";
import { defaultMetadata, inter } from "@/lib/constants";
import Navbar from "@/components/NavBar";

export const metadata: Metadata = defaultMetadata;

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
    </html>
  );
}
