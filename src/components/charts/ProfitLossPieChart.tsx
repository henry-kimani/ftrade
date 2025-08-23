'use client';

import { EChartsOption } from "echarts";
import Echarts from "./Echarts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const chartData = [
  { revenue: "profit", amount: 1000, fill: "var(--color-profit)" },
  { revenue: "loss", amount: 400, fill: "var(--color-loss)"}
];

const options: EChartsOption = {
  tooltip: {
    trigger: "item"
  },
  series: [
    {
      name: "Total P & L",
      type: "pie",
      radius: '50%',
      data: chartData.map(d => ({ name: d.revenue, value: d.amount })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
};

export default function ProfitLossPieChart() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Total Profit and Loss</CardTitle>
          <CardDescription>The total profit and loss for the choosen month.</CardDescription>
        </CardHeader>
        <CardContent>
          <Echarts option={options} />
        </CardContent>
      </Card>
    </div>
  );
}

