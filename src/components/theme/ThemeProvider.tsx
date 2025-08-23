'use client';

const NextThemeProvider = dynamic(() => import ('next-themes').then(e => e.ThemeProvider), { ssr: false })

import React from "react";
import type { ThemeProviderProps } from "next-themes";
import dynamic from "next/dynamic";

export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return <NextThemeProvider attribute="class" {...props}>{children}</NextThemeProvider>
}

