'use client';

import React from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent 
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--color-chart-4)"
  },
} satisfies ChartConfig;

export default function OverallRevenueChart() {
  return (
    <section>
      <Card className="bg-transparent">
        <CardHeader>
          <CardTitle>Overall Revenue</CardTitle>
          <CardDescription>A bar chart representation of the total profit and loss</CardDescription>
        </CardHeader>
        <CardContent>
            <DashboardLineChart />
        </CardContent>
      </Card>
    </section>
  );
}

function PannableArea({ children }: { children: React.ReactNode }) {
  return (
    <div className="border max-w-full max-h-[30rem]">
      {children}
    </div>
  );
}

function DashboardLineChart() {
  return (
    <ChartContainer className="w-full max-h-[30rem]" config={chartConfig}>
      <LineChart accessibilityLayer data={chartData}
        margin={{
          left: 12,
          right: 12
        }}
      >
        <YAxis
          dataKey="desktop" tickLine tickMargin={8}
          axisLine
        />
        <XAxis
          dataKey="month" tickLine tickMargin={8} axisLine
          tickFormatter={value => value.slice(0, 3)}
        />
        <Line 
          dataKey="desktop" 
          fill="var(--color-desktop)" 
          stroke="var(--color-desktop)" 
          radius={4} 
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ReferenceLine y={160} stroke="var(--color-chart-5)" />
        <ReferenceLine y={0} stroke="var(--color-accent)" />
      </LineChart>
    </ChartContainer>
  );
}
