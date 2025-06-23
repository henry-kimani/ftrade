import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import { quicksand } from "@/styles/fonts";
import ThemeProvider from "@/components/theme/ThemeProvider";
import ThemeToggle from "@/components/theme/ThemeToggle";

export const metadata: Metadata = {
  title: "FTrade",
  description: "A trading journal",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${quicksand.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > 
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
