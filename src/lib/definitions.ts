
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

export type AccountStatusType = {
  "MSG": "ACCOUNT_STATUS",
  "COMPANY": string;
  "CURRENCY": string;
  "NAME": string;
  "SERVER": string;
  "LOGIN": number;
  "TRADE_MODE": number;
  "LEVERAGE": number;
  "LIMIT_ORDERS": number;
  "MARGIN_SO_MODE": number;
  "TRADE_ALLOWED": number;
  "TRADE_EXPERT": number;
  "BALANCE": number;
  "CREDIT": number;
  "PROFIT": number;
  "EQUITY": number;
  "MARGIN": number;
  "MARGIN_FREE": number;
  "MARGIN_LEVEL": number;
  "MARGIN_SO_CAL": number;
  "MARGIN_SO_SO": number;
  "ERROR_ID": number;
  "ERROR_DESCRIPTION": string;
};

export type TradeHistoryType = {
  "MSG": "TRADE_HISTORY",
  "TRADES": {
    "SYMBOL": string;
    "MAGIC": number;
    "TICKET": number;
    "OPEN_TIME": string;
    "CLOSE_TIME": string;
    "OPEN_PRICE": number;
    "CLOSE_PRICE": number;
    "TYPE": "BUY" | "SELL";
    "LOTS": number;
    "STOP_LOSS": number;
    "TAKE_PROFIT": number;
    "SWAP": number;
    "COMMISSION": number;
    "COMMENT": string;
    "PROFIT": number;
  }[]
};

