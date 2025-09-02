'use client';

import { EChartsOption } from "echarts";
import Echarts from "./Echarts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";


export default function ProfitLossPieChart({
  profit, loss
}: {
    profit: number,
    loss: number
  }) {

  const chartData = [
    { revenue: "profit", amount: profit, },
    { revenue: "loss", amount: loss }
  ];

  const options: EChartsOption = {
    tooltip: {
      trigger: "item"
    },
    color: [
      '#00c950',
      '#fb2c36',
    ],
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

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Total Profit and Loss</CardTitle>
          <CardDescription>The total profit and loss for the choosen month.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* @ts-expect-error Provided the required props and it works */}
          <Echarts option={options} />
        </CardContent>
      </Card>
    </div>
  );
}

