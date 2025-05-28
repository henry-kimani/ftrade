import Metrics from "@/components/Metrics";
import ScreenshotCarousel from "@/components/ScreenshotCarousel";
import StrategyCheckbox from "@/components/StrategyCheckbox";
import Notes from "@/components/Notes";
import React from "react";

export default function Trades() {
  return (
    <main className="max-w-[50rem] m-auto p-4">
      <div className="grid place-items-center mb-8">
        <ScreenshotCarousel />
      </div>
      
      <div className="grid @lg/main:grid-cols-2 gap-8 mb-8">
        <StrategyCheckbox />
        <Metrics />
      </div>

      <div>
        <Notes />
      </div>
    </main>
  );
}


