'use client';

import {
  Select, SelectValue, SelectTrigger, SelectContent, SelectGroup, SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { toSentenceCase, isObjEmpty } from "@/lib/utils";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { type GroupedStrategies, UpdateTradeStrategies, type SelectedStrategies } from "@/lib/definitions";
import { updateTradeStrategiesAction } from "@/lib/actions";


export default function AddStrategyForm(
  { 
    tradeId,
    defaultTradeStrategies, 
    allTradingStrategies
  }:{
    tradeId: string; // the trade to update
    defaultTradeStrategies:  GroupedStrategies; // the default selected trades
    allTradingStrategies: Record<string,{ strategies: string[] }>// All the trades to choose from
  }
) {

  const [ tradingPlan, setTradingPlan ] = useState<string | null>();
  const [ selectedStrategies, setSelectedStrategies ] = useState<SelectedStrategies>();

  useEffect(() => {
    // Call once when the component mounts to prevent errors when reopening the dialog
    
    if (defaultTradeStrategies) {
      // Clean data
      Object.keys(defaultTradeStrategies).map(key => {
        if (
          defaultTradeStrategies[key] &&
            defaultTradeStrategies[key].strategies.length === 0
        ) {
          delete defaultTradeStrategies[key];
        }
      })

      setSelectedStrategies(defaultTradeStrategies);
    }
  }, []);

  function handleAddSelectedStrategies(selectedStrategy: string, checked: CheckedState) {
    if (!tradingPlan) return;

    /* 1. First time.
     * 2. Add -> checked is true
     * 3. Remove -> checked is false */
    if (!selectedStrategies || !selectedStrategies[tradingPlan]){
      const newData = { 
        ...selectedStrategies, // if there is existing, place it in new data
        [tradingPlan]: {
          strategies: [selectedStrategy]
        }
      };
      setSelectedStrategies(newData);
      return;
    };

    const clonedSelectedStrategies = { ...selectedStrategies };

    if (checked) {
      // Add
      clonedSelectedStrategies[tradingPlan].strategies.push(selectedStrategy);
      setSelectedStrategies(clonedSelectedStrategies);
    } else {
      clonedSelectedStrategies[tradingPlan].strategies = 
        clonedSelectedStrategies[tradingPlan].strategies.filter(strategy => strategy !== selectedStrategy)
      // Check if that tradingplan's strategies are zero, then remove it
      if (clonedSelectedStrategies[tradingPlan].strategies.length === 0) {
        delete clonedSelectedStrategies[tradingPlan];
      }
      setSelectedStrategies(clonedSelectedStrategies);
    }
  }

  async function formAction(formData: FormData) {
    const newStrategies = Object.values(selectedStrategies)
    .flatMap(selectedStrategy => selectedStrategy.strategies)
    const data: UpdateTradeStrategies = {
      tradeId,
      newStrategies,
    }
    formData.append("trade-strategies", JSON.stringify(data));
    await updateTradeStrategiesAction(formData);
  }

  return (
    <div className="grid gap-4">
      {/* Show a preview of selected trades and strategies */}
      <div>{ (selectedStrategies && isObjEmpty(selectedStrategies)) && 
        <div>
          <Label className="mb-2 text-muted-foreground text-xs">PREVIEW</Label>
          <div className="flex gap-2">
            {Object.keys(selectedStrategies).map(selectedKey => (
              <Popover key={selectedKey}>
                <PopoverTrigger asChild>
                  <Button variant="secondary">
                    {selectedKey.toUpperCase()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <span className="text-xs text-muted-foreground">{selectedKey.toUpperCase()}</span> 
                  {selectedStrategies[selectedKey].strategies.map(strategy => 
                    <li key={strategy} className=" ml-2">{strategy}</li>
                  )}
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </div>
      }</div>

      <form action={formAction} className="grid gap-2">
        {/* Trading plan selector */}
        <div>
          <Select onValueChange={(tradingPlan) => setTradingPlan(tradingPlan)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a trading plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Trading Plans</SelectLabel>
                {Object.keys(allTradingStrategies).map((key, index) => 
                  <SelectItem key={index+key} value={key}>{toSentenceCase(key)}</SelectItem>)
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {/* Strategies selector */}
        <div> 
          <Popover>
            <PopoverTrigger asChild disabled={!tradingPlan}>
              <Button 
                className="w-full *:!text-start"
                variant="outline"
              >
                {!tradingPlan ? 
                  <>Select a Trading Plan first</> : 
                  !selectedStrategies || !selectedStrategies[tradingPlan]? 
                    <div>Select strategies for {tradingPlan}</div> :
                    <div>{selectedStrategies[tradingPlan].strategies.map(strategies => `${strategies}, `)}</div>
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="grid gap-3">
              <Label className="text-xs text-muted-foreground">Strategies</Label>
              {tradingPlan &&
                allTradingStrategies[tradingPlan].strategies.map((strategy ) => (
                  <div key={strategy} className="flex space-x-2">
                    <Checkbox 
                      checked={
                        !selectedStrategies || !selectedStrategies[tradingPlan] ?
                          false :
                          selectedStrategies[tradingPlan].strategies.includes(strategy)
                      }
                      onCheckedChange={(s) => handleAddSelectedStrategies(strategy, s)} 
                    />
                    <Label>{toSentenceCase(strategy)}</Label>
                  </div>
                ))
              }
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Button type="submit" className="w-full">Done</Button>
        </div>
      </form>
    </div>
  );
}
