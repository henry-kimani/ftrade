'use client';

import React from "react";
import Echarts from "./Echarts";
import { EChartsOption } from "echarts";


export default function YearlyRevenueChart({
  monthlyProfit 
}: {
    monthlyProfit: {
      month: number,
      totalMonthlyProfit: string | null 
    }[];
  }) {

  if (!monthlyProfit || monthlyProfit.length < 1) {
    return;
  }

  const months = {
    "1": "Jan",
    "2": "Feb",
    "3": "Mar",
    "4": "Apr",
    "5": "May",
    "6": "Jun",
    "7": "Jul",
    "8": "Aug",
    "9": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dev"
  };

  const options: EChartsOption = {
    backgroundColor: "rgba(255, 255, 255, 1)",
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      // @ts-expect-error Does not match the type, however execpted value is in range of object
      data: monthlyProfit.map(d => months[String(d.month)])
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: monthlyProfit.map(d => Number(d.totalMonthlyProfit)),
        type: 'line',
        smooth: false,
      }
    ]
  };

  return (
    <section>
      {/* @ts-expect-error Provided all props and it works */}
      <Echarts option={options} />
    </section>
  );
}

