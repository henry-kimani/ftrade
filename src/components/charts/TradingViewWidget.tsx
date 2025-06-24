'use client';

import React, { useEffect, useRef, memo } from 'react';
import { useTheme } from 'next-themes';

function TradingViewWidget(
  { indicators }: { indicators: string[] | undefined }
) {

  const { theme } = useTheme();

  const container = useRef<HTMLDivElement | null>(null);
  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "autosize": true,
          "symbol": "NASDAQ:AAPL",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "${theme}",
          "style": "1",
          "locale": "en",
          "withdateranges": true,
          "hide_side_toolbar": false,
          "details": true,
          "hotlist": true,
          "allow_symbol_change": true,
          "studies": [${indicators?.map(indicator => `"${indicator}"`)}],
          "support_host": "https://www.tradingview.com"
        }`;
      console.log(script.innerHTML);
      container.current?.replaceChildren(script)
    },
    [ indicators, theme ]
  );

  return (
    <div 
      className="tradingview-widget-container" 
      ref={container} 
      style={{ height: "100%", width: "100%" }}
    >
      <div 
        className="mt-2 tradingview-widget-container__widget" 
        style={{ height: "100%", width: "100%" }}
      ></div>
    </div>
  );
}

export default memo(TradingViewWidget);
