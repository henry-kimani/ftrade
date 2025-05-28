import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProfitLossPieChart from "./charts/ProfitLossPieChart";

export default function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2 @4xl/main:grid-cols-4 @4xl/main:grid-rows-2 ">
      <Card className="@container/card @4xl/main:col-span-2">
        <CardHeader>
          <CardDescription>Balance</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            $1,000.00
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card @4xl/main:col-span-2 @4xl/main:row-start-2">
        <CardHeader>
          <CardDescription>Today's Profit</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            $1,000.00
          </CardTitle>
        </CardHeader>
      </Card>
      
      <Card className="@lg/main:col-span-2 @4xl/main:row-span-2">
        <CardHeader>
          <CardTitle>Total Profit and Lost</CardTitle>
          <CardDescription>A pie chart representation of the total profit and loss.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfitLossPieChart />
        </CardContent>
      </Card>

    </div>
  );
}

