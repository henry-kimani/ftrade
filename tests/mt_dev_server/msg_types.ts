
export type MsgCommands = AccountStatusType | TradeHistoryType;

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
    "OPEN_PRICE": string;
    "CLOSE_PRICE": string;
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

export type ClientCommands = {
  "MSG": "ACCOUNT_STATUS" | "TRADE_HISTORY";
};
