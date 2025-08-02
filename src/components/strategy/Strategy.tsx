import { Card, CardTitle, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import AddStrategyForm from "@/components/forms/AddStrategyForm";
import { getPlansAndStrategiesForTrade, getAllTradingPlansAndTheirStrategies } from "@/db/queries";
import { toSentenceCase, toGroupedStrategies } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import ChooseTradeStrategiesModal from "@/components/modals/ChooseTradeStrategiesModal";
import TradeStrategiesPopover from "@/components/TradeStrategiesPopover";

export default async function Strategy({ tradeId }: { tradeId: string }) {
  const tradeStrategies = await getPlansAndStrategiesForTrade(tradeId);
  const allTradingPlanStrategies = await getAllTradingPlansAndTheirStrategies();

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
          <ChooseTradeStrategiesModal>
            <AddStrategyForm 
              tradeId={tradeId} // Trade to modify
              // The default selected tradeStrategies
              defaultTradeStrategies={toGroupedStrategies(tradeStrategies)}
              // All strategies to choose from
              allTradingStrategies={toGroupedStrategies(allTradingPlanStrategies)}
            />
          </ChooseTradeStrategiesModal>
        </div>
      </CardHeader>
      <CardContent>
        { tradeStrategies.length === 0 ?
          <div>No strategies for this trade yet.</div>
          :
          <div className="grid gap-2 grid-cols-1 @md/main:grid-cols-2 @md/main:gap-9">
            {keys.map((key, index) => (
              <TradeStrategiesPopover
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

