import { eq, Placeholder, sql } from "drizzle-orm";
import { db } from "./dbConn";
import { accounts, trades } from "./schema";

const FIRST_RESULT = 0;

export async function getAccountLogins() {
  const logins = await db.select({
    login: accounts.login
  }).from(accounts);

  return logins;
}

export async function getAccountId(login: string) {
  const id = await db.select({
    id: accounts.id
  }).from(accounts)
    .where(sql`${accounts.login} = ${login}`);

  return id[FIRST_RESULT];
}

export async function insertNewAccount({
  name, login, accountBalance, leverage, tradeMode
}: {
    name: string,
    login: number,
    accountBalance: number,
    leverage: number,
    tradeMode: boolean
  }) {

  try {
    const newId = await db.insert(accounts)
    .values({
      name,
      login,
      accountBalance,
      leverage,
      tradeMode,
    }).returning({ newId: accounts.id });

    return newId[FIRST_RESULT];
  } catch(error) {
    console.log(error);
    throw Error("Could not insert new account data into Ftrade.");
  }
}

export async function updateExistingAccount(
  { name, accountBalance, leverage, accountId }:
  {
    name: string,
    accountBalance: number,
    leverage: number,
    accountId: string
  }) {
  try {
  await db.update(accounts).set({
    name,
    accountBalance,
    leverage
  }).where(eq(accounts.id, accountId));
  } catch {
    throw Error("Could not update the existing account.")
  }
}

/* Get trades for that account */
export async function getTradesTicketsForAccount(accountId: string) {
  const tradeTickets = await db.select({
    ticket: trades.ticket
  }).from(trades)
    .where(sql`${trades.accountsId} = ${accountId}`);

  return tradeTickets;
}

export async function insertNewTrade({
  accountsId, ticket, type, entryTime, exitTime, entryPrice, exitPrice, lotSize, 
  takeProfit, stopLoss, profitInCents, symbol
}: {
    accountsId: string,
    ticket: number,
    type: "BUY" | "SELL",
    symbol: string,
    entryTime: Date | Placeholder<string, any>,
    exitTime: Date | Placeholder<string, any>,
    entryPrice: string,
    exitPrice: string,
    lotSize: string,
    takeProfit: string,
    stopLoss: string,
    profitInCents: number
  }) {
  try {
    await db.insert(trades)
    .values({
      accountsId,
      ticket,
      type,
      symbol,
      entryTime,
      exitTime,
      entryPrice,
      exitPrice,
      lotSize,
      takeProfit,
      stopLoss,
      profitInCents
    });
  } catch (error) {
    console.error(error);
    throw Error("Failed to insert trade history.");
  }
}
