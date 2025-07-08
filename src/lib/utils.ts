import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { GroupedStrategies, GroupedTradingPlanStrategiesWithId, GroupedStrategiesWithIds  } from "@/lib/definitions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toSentenceCase(string: string) {
  const capitalizedChar = string.charAt(0).toUpperCase();
  const matchFirstChar = /^./gi;
  return string.replace(matchFirstChar, capitalizedChar);
}

export function isObjEmpty(obj: Object) {
  for (let _ in obj) return true;
  return false;
}

export function toGroupedStrategies(
  args:
  {
    strategy: string | null;
    tradingPlan: string;
  }[]
) {
  const data: GroupedStrategies = {};
  const grouped = Object.groupBy(args, ({ tradingPlan }) => tradingPlan);
  Object.keys(grouped).forEach(key => {
    if (grouped[key]) {
      data[key] = {
        strategies: grouped[key].map(({ strategy }) => strategy ? strategy : "")
      }
    }
  });
  return data;
};


export function toGroupedStrategiesWithIds(props: 
  {
    tradingPlanId: string;
    tradingPlan: string;
    strategyId: string;
    strategy: string | null;
  }[]
): GroupedStrategiesWithIds {

  return Object.values(props.reduce((accumulator, currentValue) => {
    const { tradingPlanId, tradingPlan, strategyId, strategy } = currentValue;
    const key = tradingPlanId;

    accumulator[key] = accumulator[key] || { tradingPlanId, tradingPlan, strategiesWithIds: [] };
    accumulator[key].strategiesWithIds.push({ strategyId, strategy });

    return accumulator;
  }, {}))[0];
}


export function toGroupedTradingPlanStrategiesWithId(props:
  {
    tradingPlanId: string;
    tradingPlan: string;
    strategy: string | null;
  }[]
):GroupedTradingPlanStrategiesWithId {

  return Object.values(props.reduce((accumulator, currentValue) => {
    const { tradingPlanId, tradingPlan, strategy } = currentValue;
    const key = tradingPlanId;

    accumulator[key] = accumulator[key] || { tradingPlanId, tradingPlan, strategies: [] };
    accumulator[key].strategies.push(strategy);

    return accumulator;
  }, {}));

}
