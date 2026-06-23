import type { Metadata } from "next";
import { AppFooter } from "@/components/layout/app-footer";
import { AppHeader } from "@/components/layout/app-header";
import { SkipLink } from "@/components/layout/skip-link";
import { themeInitScript } from "@/lib/theme/theme-script";
import "./globals.css";

export const metadata: Metadata = {
  title: "PageCue — Remember the story. Resume the journey.",
  description:
    "PageCue is a spoiler-safe reading companion that reminds you what's happened in a book so far, without revealing what comes next.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <SkipLink />
        <AppHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <AppFooter />
      </body>
    </html>
  );
}
