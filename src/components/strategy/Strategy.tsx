import { Card, CardTitle, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, Pencil } from "lucide-react";
import { DialogTitle, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import AddStrategyForm from "./AddStrategyForm";
import { getStrategiesWithTradingPlans } from "@/db/queries";
import { toSentenceCase, toGroupedStrategies } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { getAllTradingPlansAndTheirStrategies } from "@/db/queries";

export default async function Strategy({ tradeId }: { tradeId: string }) {
  const tradeStrategies = await getStrategiesWithTradingPlans(tradeId);

  const groupedTradeStrategies = toGroupedStrategies(tradeStrategies);
  const keys = Object.keys(groupedTradeStrategies);

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle className="text-lg">Trading Plans</CardTitle>
          <CardDescription>
            Trading plans and their strategies.
          </CardDescription>
        </div>
        <div>
          <CreateStrategyDialog
            tradeId={tradeId}
            defaultTradeStrategies={tradeStrategies} 
          />
        </div>
      </CardHeader>
      <CardContent>
        { tradeStrategies.length === 0 ?
          <div>No strategies for this trade yet.</div>
          :
          <div className="grid gap-2 grid-cols-1 @md/main:grid-cols-2 @md/main:gap-9">
            {keys.map((key, index) => (
              <CreatePopover 
                key={index+key}
                triggerName={key} 
                content={
                  <ol className="pl-4">
                    <Label className="border-b text-sm text-muted-foreground pl-1 pb-2 font-bold">{key.toUpperCase()}</Label>
                    {groupedTradeStrategies[key]?.strategies.map((strategy, index) => (
                      <li key={index} className="pl-2 mt-3 list-disc">{toSentenceCase(strategy|| "")}</li>
                    ))}
                  </ol>
                } 
              />
            ))}
          </div>
        }
      </CardContent>
    </Card>
  );
}


async function CreateStrategyDialog(
  { tradeId, defaultTradeStrategies }:
  {
    tradeId: string;
    defaultTradeStrategies: {
      strategy: string | null;
      tradingPlan: string;
    }[]
  }
) {

  // Don't bother fetching data if the current use is not an admin
  const allTradingPlanStrategies = await getAllTradingPlansAndTheirStrategies();

  return(
    <Dialog>
      <DialogTrigger asChild>
        <Button title="Edit this trade" size="icon" variant="outline">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Trading Plans</DialogTitle>
          <DialogDescription>
            Add strategies and their trading plans
          </DialogDescription>
        </DialogHeader>
        <AddStrategyForm 
          tradeId={tradeId} // Trade to modify
          // The default selected tradeStrategies
          defaultTradeStrategies={toGroupedStrategies(defaultTradeStrategies)}
          // All strategies to choose from
          allTradingStrategies={toGroupedStrategies(allTradingPlanStrategies)}
        />
      </DialogContent>
    </Dialog>
  );
}


function CreatePopover(
  { triggerName, content }:
  { triggerName: string; content: React.ReactNode }
) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="flex items-center justify-between" variant="ghost">
          {toSentenceCase(triggerName)}
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {content}
      </PopoverContent>
    </Popover>
  );
}


