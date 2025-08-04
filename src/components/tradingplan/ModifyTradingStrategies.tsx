import { getAllTradingPlansAndTheirStrategies } from "@/db/queries";
import { Settings2 } from "lucide-react";
import Link from "next/link";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { toSentenceCase, toGroupedTradingPlanStrategiesWithId  } from "@/lib/utils";
import { isCurrentUserAdmin } from "@/lib/dal";

export default async function ModifyingTradingStrategies() {

  const allTradingPlanStrategies = await getAllTradingPlansAndTheirStrategies();
  const groupedTradingPlansStrategiesWithId = toGroupedTradingPlanStrategiesWithId(allTradingPlanStrategies);
  const isAdmin = await isCurrentUserAdmin();

  return (
    <div className="grid md:grid-cols-2 gap-2">
      {groupedTradingPlansStrategiesWithId && 
        groupedTradingPlansStrategiesWithId.map(({ tradingPlanId, tradingPlan, strategies }) => (
          <div key={tradingPlanId}>
            <Popover>
              <PopoverTrigger asChild className="hover:bg-secondary/80 rounded-md p-2">
                <div className="flex">
                  <span className="flex-1">{toSentenceCase(tradingPlan)}</span>
                  {isAdmin && <UpdateTradingPlan id={tradingPlanId}/> }
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <div>
                  <Label className="text-semibold text-muted-foreground uppercase border-b pb-2 mb-1">{toSentenceCase(tradingPlan)}</Label>
                  <ul className="list-disc ml-4 grid gap-2">{strategies.map((strategy, index) => (
                    <li key={index}>{toSentenceCase(strategy)}</li>
                  ))}</ul>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ))
      }
    </div>
  );
}

function UpdateTradingPlan({ id }: { id: string }) {
  return <div title="Edit this Trading Plan" className="flex-none">
    <Link href={`/settings/${id}/edit`}>
      <Settings2 />
    </Link>
  </div>
}

