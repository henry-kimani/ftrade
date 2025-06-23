import Metrics from "@/components/Metrics";
import ScreenshotCarousel from "@/components/ScreenshotCarousel";
import Strategy from "@/components/strategy/Strategy";
import Notes from "@/components/Notes";
import React from "react";
import SiteHeader from "@/components/SiteHeader";
import { verifyUser } from "@/lib/dal";

export default async function Trades() {
  // await verifyUser();

  return (
    <>
      <div>
        <SiteHeader heading="trades">
          Calender
        </SiteHeader>
      </div>
      <main className="max-w-3xl m-auto p-4">
        <div className="grid place-items-center mb-8">
          <ScreenshotCarousel />
        </div>

        <div className="grid @lg/main:grid-cols-2 gap-4 mb-4">
          <Strategy />
          <Metrics />
        </div>

        <div>
          <Notes />
        </div>
      </main>
    </>
  );
}


