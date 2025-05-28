'use client';

import { Pie, PieChart } from "recharts";
import { 
  ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent
} from "@/components/ui/chart";

const chartData = [
  { revenue: "profit", amount: 1000, fill: "var(--color-profit)" },
  { revenue: "loss", amount: 400, fill: "var(--color-loss)"}
];

const chartConfig = {
  profit: {
    label: "Profit",
    color: "var(--color-chart-4)"
  },
  loss: {
    label: "Loss",
    color: "var(--color-chart-5)"
  }
} satisfies ChartConfig;

export default function ProfitLossPieChart() {
  return (
    <ChartContainer 
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie data={chartData} dataKey="amount" nameKey="revenue" />
      </PieChart>
    </ChartContainer>
  );
}

