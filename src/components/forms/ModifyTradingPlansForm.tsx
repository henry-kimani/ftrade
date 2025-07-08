'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useState } from "react";
import { deleteTradingPlanAction, updateEdittedTradingPlanAction } from "@/lib/actions";
import { Plus, Trash2 } from "lucide-react";

type StrategyType = {
  strategyId: string;
  strategy: string;
};

type ErrorState = {
    message: string;
    error?: undefined;
} | {
    error: {
        tradingPlan?: string[] | undefined;
        edittedStrategies?: string[] | undefined;
        newStrategies?: string[] | undefined;
    };
    message: string;
}

export default function ModifyTradingPlansForm(props: 
  {
    defaultTradingPlanStrategies: {
      tradingPlanId: string;
      tradingPlan: string;
      strategiesWithIds: {
        strategyId: string;
        strategy: string;
      }[];
    }
  }
) {

  const { tradingPlanId, tradingPlan, strategiesWithIds } = props.defaultTradingPlanStrategies;

  const [ strategies, setStrategies ] = useState<StrategyType[] | undefined>();
  const [ newStrategy, setNewStrategy ] = useState<string | undefined>("");
  const [ newStrategies, setNewStrategies ] = useState<string[] | undefined>();
  const [ errors, setErrors ] = useState<ErrorState>();

  useEffect(() => {
    if (strategiesWithIds && strategiesWithIds.length > 0) {
      setStrategies(strategiesWithIds);
    }
  },[]);

  function handleStrategyChange(strategy: string, strategyId: string, remove=false) {

    if (!strategies) {
      return;
    }

    const clone = strategies.slice();

    if (remove) {
      setStrategies(clone.filter(s => s.strategyId !== strategyId));
      return;
    }

    clone.map((s, i) => {
      if (s.strategyId === strategyId) {
        clone[i].strategy = strategy;
      }
    });

    setStrategies(clone);
  }

  function handleNewStrategyChange(strategy: string | undefined) {
    if (!strategy || !(strategy.length >= 3)) {
      return;
    }

    /* Clear state */
    setNewStrategy("");

    /* first time */
    if (!newStrategies) {
      setNewStrategies([strategy])
      return;
    }

    const clone = [...newStrategies];

    if (newStrategies.includes(strategy)) {
      /* Remove it, since it exits */
      setNewStrategies(clone.filter(s => s !== strategy));
      return;
    } 

    clone.push(strategy);
    setNewStrategies(clone);
  }

  async function handleSubmit(formData: FormData) {
    formData.append("edit-strategies", JSON.stringify(strategies));

    const state = await updateEdittedTradingPlanAction(tradingPlanId, formData);
    setErrors(state);
  }

  return (
    <div className="grid gap-12" >
      <form action={handleSubmit}>
        <div className="grid gap-6">
          <div>
            <h3 className="text-lg mb-2 font-semibold">Trading Plan Name</h3>
            <Input
              name="trading-plan"
              defaultValue={tradingPlan}
            />
            {errors?.error?.tradingPlan && errors.error.tradingPlan.map((err) => <p className="text-red-400 mt-1">{err}</p>)}
          </div>

          {/* Edit existing strategies */}
          <div>
            <h4 className="mb-2 text-muted-foreground">Edit the strategies of this Trading Plan</h4>
            <div className="grid gap-2">
              {!strategies || strategies.map(({ strategy, strategyId }) => (
                <div className="flex gap-2" key={strategyId}>
                  <Input
                    onChange={ (e) => handleStrategyChange(e.currentTarget.value, strategyId) }
                    value={strategy}
                    type="text"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={() => handleStrategyChange(strategy, strategyId, true)}
                    className="flex-none text-red-400"
                    size="icon"
                    variant="outline"
                  ><Trash2 /></Button>
                </div>
              ))}
              {errors?.error?.edittedStrategies && errors.error.edittedStrategies.map((err) => <p className="text-red-400 mt-1">{err}</p>)}
            </div>
          </div>

          {/* Add new strategies */}
          <div>
            <h4 className="mb-1 text-muted-foreground">Add new strategies to this Trading Plan</h4>
            {(newStrategies && newStrategies.length > 0) &&
              <div className="mb-2">
                <h5 className="mb-2 text-xs text-muted-foreground">Preview of the strategies to be added</h5>
                <div>
                  {newStrategies.map(strategy => (
                    <div key={strategy} className="flex gap-2">
                      <Button
                        className="order-2 peer text-red-400 flex-none"
                        variant="ghost"
                        type="button"
                        size="icon"
                        onClick={() => handleNewStrategyChange(strategy)}
                      >
                        <Trash2 />
                      </Button>
                      <Input 
                        defaultValue={strategy}
                        className="order-1 peer-hover:!bg-border/30 flex-1 border-none !bg-transparent hover:bg-border/30"
                        name="new-strategies"
                      />
                    </div>
                  ))}
                  {errors?.error?.newStrategies && errors.error.newStrategies.map((err) => <p className="text-red-400 mt-1">{err}</p>)}
                </div>
              </div>
            }
            {/* new strategy input */}
            <div className="flex gap-2">
              <Input 
                className="flex-1"
                value={newStrategy}
                onChange={(e) => setNewStrategy(e.currentTarget.value)}
              />
              <Button 
                disabled={!newStrategy || !(newStrategy?.length >= 3)}
                type="button"
                className="flex-none"
                variant="secondary" 
                size="icon"
                onClick={() => handleNewStrategyChange(newStrategy)}
              ><Plus /></Button>
            </div>
          </div>

          {/* Submit button */}
          <div>
            <Button
              className="w-full"
            >Finish Edit</Button>
          </div>
        </div>
      </form>

      {/* DANGER ZONE */}
      <div className="grid gap-4">
        <h3 className="text-lg font-semibold">Danger Zone</h3>
        <p className="text-sm font text-muted-foreground">
          Deleting this trading plan will delete it entirely. This includes its
          associated strategies.
          <br />
          <br />
          If those strategies, were used in trades, it will delete the relationship
          between the strategies and the trades. However the trades will remain.
          Only the trade's strategies with disappear.
        </p>
        <DeleteTradingPlan id={tradingPlanId} />
      </div>
    </div>
  );
}

function DeleteTradingPlan({ id }: { id: string }) {
  const initialState: { message: string | null } = { message: null };
  const deleteTradingPlanActionWithId = deleteTradingPlanAction.bind(null, id);
  const [state, formAction] = useActionState(deleteTradingPlanActionWithId, initialState);

  return (
    <form action={formAction}>
      <Button
        variant="destructive"
        className="w-full"
      >Delete Trading Plan</Button>
      { state.message && <p className="text-red-400 mt-2">{state.message}</p>}
    </form>
  );
}

function hasProperty(arr: StrategyType[], prop: string) {
  return arr.some(s => s.hasOwnProperty(prop));
}
