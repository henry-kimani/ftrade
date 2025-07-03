
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

export type SelectedStrategies = Record<string, {
  strategies: string[];
}> | undefined;

export type UpdateTradeStrategies = { 
  tradeId: string;
  newStrategies: string[];
}
