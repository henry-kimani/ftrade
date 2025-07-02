import { toSentenceCase } from "@/lib/utils";
import { Diameter, HandCoins, LogIn, LogOut, OctagonXIcon, Scale, TrendingUp } from "lucide-react";


export default function MetricsTable() {

  const data = [
    {
      icon: TrendingUp,
      metric: "profit",
      value: 20,
    },
    {
      icon: LogIn,
      metric: "entry price",
      value: 20,
    },
    {
      icon: LogOut,
      metric: "exit price",
      value: 20,
    },
    {
      icon: HandCoins,
      metric: "take profit",
      value: 30,
    },
    {
      icon: OctagonXIcon,
      metric: "stop loss",
      value: 40,
    },
    {
      icon: Scale,
      metric: "ratio",
      value: 20,
    },
    {
      icon: Diameter,
      metric: "lot size",
      value: 20,
    }
  ];

  return (
    <table className="table min-w-full">
      <thead className="border-b text-left *:font-bold *:text-sm *:text-muted-foreground">
        <tr>
          <td className="py-4 px-3">METRIC</td>
          <td className="py-4 px-3">VALUE</td>
        </tr>
      </thead>
      <tbody className="divide-y border-b">
        {data.map(item => (
          <tr key={item.metric} className="">
            <td className="pl-4 pr-3 py-4 flex gap-4">
              <item.icon className="rounded-full" />
              {toSentenceCase(item.metric)}
            </td>
            <td className="px-3 py-4">{item.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
