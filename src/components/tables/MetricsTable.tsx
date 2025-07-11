import { getTradeById } from "@/db/queries";
import { cn, toSentenceCase } from "@/lib/utils";
import { format } from "date-fns";
import { Diameter, HandCoins, LogIn, LogOut, OctagonXIcon, Scale, TrendingUp, TrendingDown, BanknoteArrowUp, BanknoteArrowDown, ClockArrowUp, ClockArrowDown } from "lucide-react";


export default async function MetricsTable({ tradeId }: { tradeId: string }) {
  const trade = await getTradeById(tradeId);

  const data = [
    {
      icon: trade.type === "BUY" ? BanknoteArrowUp : BanknoteArrowDown,
      metric: "trade type",
      value: trade.type,
      className: "text-amber-500"
    },
    {
      icon: trade.profitInCents < 0 ? TrendingDown : TrendingUp,
      metric: trade.profitInCents < 0 ? "loss" : "profit",
      value: "$ "+(trade.profitInCents / 100).toPrecision(),
      className: trade.profitInCents < 0 ? "text-red-400" : "text-green-400"
    },
    {
      icon: LogIn,
      metric: "entry price",
      value: Number(trade.entryPrice).toPrecision(),
    },
    {
      icon: LogOut,
      metric: "exit price",
      value: Number(trade.exitPrice).toPrecision(),
    },
    {
      icon: ClockArrowUp,
      metric: "entry time",
      value: format(trade.entryTime, "dd/MM/YYY"),
      className: "text-fuchsia-400",
    },
    {
      icon: ClockArrowDown,
      metric: "exit time",
      value: format(trade.exitTime, "dd/MM/YYY"),
      className: "text-fuchsia-400",
    },
    {
      icon: HandCoins,
      metric: "take profit",
      value: Number(trade.takeProfit).toPrecision(),
      className: "text-green-400"
    },
    {
      icon: OctagonXIcon,
      metric: "stop loss",
      value: Number(trade.stopLoss).toPrecision(),
      className: "text-red-400"
    },
    {
      icon: Scale,
      metric: "ratio",
      value: Number(trade.stopLoss).toFixed(1),
      className: "text-blue-400"
    },
    {
      icon: Diameter,
      metric: "lot size",
      value: trade.lotSize,
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
              <item.icon className={cn(item.className)} />
              {toSentenceCase(item.metric)}
            </td>
            <td className="px-3 py-4 truncate">{item.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
