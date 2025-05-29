import React from "react";

export default function SiteHeading({ heading: siteHeaderName }: { heading: string }) {

  return (
    <h1 className="font-medium ml-1">{siteHeaderName.toUpperCase()}</h1>
  );
}
