'use client';

import React from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent 
} from "@/components/ui/card";
import Echarts from "./Echarts";
import { EChartsOption } from "echarts";

const chartData = [
  { month: "Jan", desktop: -56 },
  { month: "Feb", desktop: 305 },
  { month: "Mar", desktop: 237 },
  { month: "Apr", desktop: -73 },
  { month: "May", desktop: 209 },
  { month: "Jul", desktop: 214 },
  { month: "Aug", desktop: -14 },
  { month: "Sep", desktop: 114 },
  { month: "Oct", desktop: -30 },
  { month: "Nov", desktop: 54 },
  { month: "Dec", desktop: 94 },
];

const options: EChartsOption = {
  backgroundColor: "rgba(255, 255, 255, 1)",
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: chartData.map(d => d.month)
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: chartData.map(d => d.desktop),
      type: 'line',
      smooth: false,
    }
  ]
};

export default function YearlyRevenueChart() {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Yearly Revenue</CardTitle>
          <CardDescription>The total revenue for each month</CardDescription>
        </CardHeader>
        <CardContent>
          <Echarts option={options} />
        </CardContent>
      </Card>
    </section>
  );
}

