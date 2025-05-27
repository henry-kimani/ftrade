'use client';

import React from "react";
import { usePathname } from "next/navigation";

export default function SiteHeading() {
  const siteHeaderName = usePathname().split("/").at(-1)?.toUpperCase();

  return (
    <h1 className="font-medium ml-1">{siteHeaderName}</h1>
  );
}
