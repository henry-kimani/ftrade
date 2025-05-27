'use client';

import { Pie, PieChart } from "recharts";
import { 
  ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent
} from "@/components/ui/chart";

const chartData = [
  { revenue: "profit", amount: 1000, fill: "#2eba27" },
  { revenue: "loss", amount: 400, fill: "#e02f2f" }
];

const chartConfig = {
  profit: {
    label: "Profit",
    color: "hsl(var(--sl-chart-1))"
  },
  loss: {
    label: "Loss",
    color: "hsl(var(--sl-chart-2))"
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

