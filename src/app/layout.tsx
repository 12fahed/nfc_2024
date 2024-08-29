"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "../components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { UserProvider } from "@/providers/UserProvider";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "NFC Website",
  description: "Created by Hyptertext Assasins",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title as React.ReactNode}</title>
        <meta name="description" content={metadata.description ?? undefined} />
        <link rel="icon" href="../public/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.className} w-full h-screen overflow-auto`}>
        <UserProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
