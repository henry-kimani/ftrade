'use client';

import { useEffect, useMemo, useRef } from 'react';
import { init, getInstanceByDom, type EChartsOption, type EChartsInitOpts } from 'echarts';
import { useDebouncedCallback } from 'use-debounce';
import { useTheme } from 'next-themes';

export default function Echarts({
  option, 
  optionSettings = { notMerge: true, lazyUpdate: false, silent: false }, 
  chartSettings = { useCoarsePointer: true }, 
  style = { width: '100%', height: '350px'}
}: {
    option: EChartsOption,
    optionSettings: {
      lazyUpdate: boolean;
      notMerge: boolean;
      silent: boolean;
    },
    chartSettings: EChartsInitOpts,
    style: {
      width: string;
      height: string;
    }
  }) {
  const { theme } = useTheme();
  const echartsRef = useRef<HTMLDivElement>(null);

  /* Only fires periodically */
  const resizeChart = () => {
    if (echartsRef.current) {
      const chart  = getInstanceByDom(echartsRef.current);
      chart?.resize();
    }
  };

  // Intialize chart
  useEffect(() => {
    const chart = init(echartsRef.current, theme, chartSettings);

    const resizeObserver = new ResizeObserver(() => {
      resizeChart();
    });

    resizeObserver.observe(echartsRef.current);

    return () => {
      chart.dispose();

      if (echartsRef.current) {
        resizeObserver.unobserve(echartsRef.current);
      }
      resizeObserver.disconnect();
      console.log("UNMOUNTED");
    };
  }, [theme]);

  // Rerender chart when option changes
  useEffect(() => {
    if (echartsRef.current) {
      const chart = getInstanceByDom(echartsRef.current);

      option.backgroundColor = theme ==="dark" ? "#171717" : "#f4f4f5";
      chart?.setOption(option, optionSettings);
    }
  }, [option, theme]);

  return (
  <div ref={echartsRef} style={style}></div>
  );
}
