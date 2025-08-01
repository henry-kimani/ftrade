'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState, useState } from "react";
import { PlusIcon, Trash2 } from "lucide-react";
import { FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { State } from "@/lib/schemas";
import { newTradingPlanAction } from "@/lib/actions/tradeStrategies";

export default function AddNewTradingPlan() {

  const [ strategies, setStrategies ] = useState<string [] | undefined>();
  const [ currentStrategy, setCurrentStrategy ] = useState<string | undefined>("");
  const initialState: State = { errors: {}, message: null };
  const [ state, formAction ] = useActionState(newTradingPlanAction, initialState);

  function handleCurrentStrategyChange(event: FormEvent<HTMLInputElement>) {
    setCurrentStrategy(event.currentTarget.value);
  }

  function addStrategyToStrategies(strategy: string | undefined) {
    if (!strategy || !(strategy.length >= 3)) {
      /* Don't add nothing */
      return;
    }

    /* Reset the input form state */
    setCurrentStrategy("");

    if (!strategies) {
      /* First Time */
      setStrategies([strategy]);
      return;
    }

    const clone = strategies.slice();

    if (strategies.includes(strategy)) {
      /* Since its being sent again and it exists, we want to remove. */
      setStrategies(strategies.filter(existingStrategy => existingStrategy !== strategy));
    } else {
      /* Add it since it does not exist */
      clone.push(strategy);
      setStrategies(clone);
    }
  }

  return (
    <div>
      <form action={formAction} className="grid gap-4">
        {/* Trading plan */}
        <div className="mb-2">
          <Label className="mb-2">Trading Plan Name</Label>
          <Input 
            aria-describedby="trading-plan-error"
            name="trading-plan"
            className="border-none !text-lg !bg-border/20 placeholder:text-lg"
            placeholder="New Trading Plan Name"
          />
          <div id="trading-plan-error" aria-live="polite" aria-atomic>
            {state?.errors?.tradingPlan && state.errors.tradingPlan.map(error => <p key={error} className="text-red-400 mt-2">{error}</p>)}
          </div>
        </div>

        {/* Strategies to be added */}
        <>
          <Label className="mb-2">Strategies to be Added</Label>
          { (strategies && strategies.length !== 0) ? 
            <div className="mb-2" aria-describedby="strategies-errors">
              {strategies.map((strategy, index) => (
                <div key={index} className="flex gap-2">
                  <Button 
                    size="icon"
                    onClick={ () =>addStrategyToStrategies(strategy) }
                    variant="ghost"
                    className="flex-none peer order-2"
                    type="button"
                  >
                    <Trash2 className="text-red-400"/>
                  </Button>
                  <Input
                    defaultValue={strategy}
                    name="strategies"
                    className="order-1 flex-1 !bg-transparent peer-hover:!bg-border/30 hover:!bg-border/30 border-0 disabled:opacity-100"
                  />
                </div>
              ))}
            </div>:
            <div className="-mt-2">
              <span className="text-xs text-muted-foreground">None</span>
            </div>
          }
          <div id="strategies-errors" aria-live="polite" aria-atomic>
            {state?.errors?.strategies && state.errors.strategies.map(error => <p key={error} className="text-red-400 mt-2">{error}</p>)}
          </div>
        </>

        {/* New Strategies */}
        <div className="flex gap-2">
          <Input 
            placeholder="New Strategy"
            className="flex-1 text-md"
            value={currentStrategy}
            onChange={handleCurrentStrategyChange}
          />
          <Button
            type="button"
            size="icon"
            className="flex-none"
            onClick={() => addStrategyToStrategies(currentStrategy)}
            variant="secondary"
            disabled={!currentStrategy || !(currentStrategy.length >= 3)}
          ><PlusIcon /></Button>
        </div>

        {/* Submit button */}
        <div>
          <Button
            type="submit"
            className="w-full"
          >Save</Button>
        </div>
      </form>

      {state?.message && <p className="mt-2 text-red-400">{state.message}</p>}
    </div>
  );
}
