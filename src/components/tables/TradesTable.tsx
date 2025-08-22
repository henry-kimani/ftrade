import { getFilteredTrades } from "@/db/queries";
import { format } from "date-fns";
import { CircleChevronLeft, CircleChevronRight, Link as L, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

export default async function TradesTable(
  { query, currentPage }: 
  { query: string, currentPage: number }
) {
  const filteredTrades = await getFilteredTrades(query, currentPage);

  return (
    <div>
      <div className="text-2xl font-bold mb-8">Trades</div>
      { filteredTrades.length > 0 ?
        <div className="overflow-x-scroll">
          <table className="table">
            <thead>
              <tr
                className="bg-border/40 *:text-sm *:text-muted-foreground *:py-4 *:px-4"
              >
                <td></td>
                <td>TICKET</td>
                <td>TYPE</td>
                <td>DATE</td>
                <td>EN PRICE</td>
                <td>EX PRICE</td>
                <td>LS</td>
                <td>T PROF</td>
                <td>S LOSS</td>
                <td>RATIO</td>
                <td>PROFIT</td>
              </tr>
            </thead>

            <tbody className="divide-y border-b">
              {filteredTrades.map((trade) => (
                <tr
                  key={trade.id}
                  className="*:py-4 *:peer-hover:bg-border/30 *:px-3"
                >
                  <td className="peer hover:bg-border/30">
                    <Link 
                      key={trade.id}
                      href={`/trades/${trade.id}/preview`}
                    >
                      { trade.type === "SELL" ?
                        <CircleChevronLeft className="text-amber-500" />:
                        <CircleChevronRight className="text-blue-400" />
                      }
                    </Link>
                  </td>
                  <td>{trade.ticket}</td>
                  <td>{trade.type}</td>
                  <td>{format(trade.entryTime, "PP")}</td>
                  <td>{Number(trade.entryPrice).toPrecision()}</td>
                  <td>{Number(trade.exitPrice).toPrecision()}</td>
                  <td>{trade.lotSize}</td>
                  <td>{Number(trade.takeProfit).toPrecision()}</td>
                  <td>{Number(trade.stopLoss).toPrecision()}</td>
                  <td>{trade.ratio}</td>
                  <td>{trade.profitInCents / 100}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        : 
        <div>
          <p className="text-muted-foreground">No trades yet.</p>
        </div>}
    </div>
  );
}
