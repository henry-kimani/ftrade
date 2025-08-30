'use client';

import SiteHeader from "@/components/SiteHeader";
import TradingViewForm from "@/components/forms/TradingViewForm";
import TradingViewWidget from "@/components/charts/TradingViewWidget";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useState } from "react";

export default function TradingView(
  { databaseIndicators }:
  { databaseIndicators: string[] }
) {

  const [ indicators, setIndicators] = useState<string[]>([]);

  function handleIndicatorChange(event: CheckedState, indicator: string) {
    if (!indicators) {
      setIndicators([indicator]);
      return;
    }

    const clonedIndicators = indicators.slice();

    if (event) {
      /* Add */
      clonedIndicators.push(indicator);
      setIndicators(clonedIndicators);
    } else {
      /* Remove */
      setIndicators(clonedIndicators.filter(state => state !== indicator))
    }
  }

  return (
    <>
      <div className="">
        <SiteHeader heading="TRADING VIEW" >
          <TradingViewForm 
            databaseIndicators={databaseIndicators}
            checkedIndicators={indicators}
            handleIndicatorChange={handleIndicatorChange}
          />
        </SiteHeader>
      </div>
      <div className="h-svh max-h-11/12">
        {/* Re-renders when props changes */}
        <TradingViewWidget indicators={indicators} />
      </div>
    </>
  );
}
