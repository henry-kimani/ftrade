
export type GroupedDatesType = {
  month: number;
  year: number;
  dates: {
    id: string,
    day: number,
  }[];
}[];

export type SelectedDate = {
  id: string;
  currentDate: Date
}| undefined;

export type GroupedStrategies = Record<string, {
  strategies: string[];
}> | undefined;

export type GroupedStrategiesWithIds = {
  tradingPlanId: string;
  tradingPlan: string;
  strategiesWithIds: {
    strategyId: string;
    strategy: string;
  }[];
};

export type UpdateTradeStrategies = { 
  tradeId: string;
  newStrategies: string[];
};

export type GroupedTradingPlanStrategiesWithId = {
  tradingPlanId: string;
  tradingPlan: string;
  strategies: string[];
}[];


