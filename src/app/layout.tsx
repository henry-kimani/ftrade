import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import { quicksand, roboto, nunito } from "@/fonts";

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
        {children}
      </body>
    </html>
  );
}
