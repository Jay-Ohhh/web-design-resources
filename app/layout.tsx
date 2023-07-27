import "./globals.scss";
import type { Metadata } from "next";
import BaseProvider from "@/components/BaseProvider";
import Toaster from "@/components/Toast/Toaster";
import Footer from "@/components/Footer";
import { inter } from "@/lib/constants";
import Navbar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Web Design Resources",
  description: "Web Design Resources",
  keywords: "Web Design,resources,applications,UI libraries,tools,starters,boilerplates,tutorials,articles",
};

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
          <div className="flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 text-black dark:from-slate-900 dark:to-slate-950 dark:text-white">
            <Navbar />
            {children}
            <Footer />
            <Toaster />
          </div>
        </BaseProvider>
      </body>
    </html>
  );
}
