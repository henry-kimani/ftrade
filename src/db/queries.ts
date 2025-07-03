import { allowedUsers, Role, strategies, trades, tradeStrategies, tradingPlans } from "@/db/schema";
import { db } from "@/db/dbConn";
import { eq, sql } from "drizzle-orm";
import { PgSelect } from "drizzle-orm/pg-core";

/* Check if the user is in the allowed_users table */
type UserId = { id: string; };
type Email = { email: string };
type Search = UserId | Email;

export async function isAllowedUser(key: Search) {

  if ("id" in key) {
    const result = await db.execute(sql<{exists: boolean}>`
      SELECT EXISTS(
        SELECT 1 FROM ${allowedUsers} WHERE ${allowedUsers.id} = ${key.id}
      )
    `);
    return result[0].exists;
  } else {
    const result = await db.execute(sql<{exists: boolean}>`
      SELECT EXISTS(
        SELECT 1 FROM ${allowedUsers} WHERE ${allowedUsers.email} = ${key.email}
      )
    `); 
    return result[0].exists as boolean;
  }
}


/* Get the role of the current user */
export async function getUserRole(userId: string) {
  const userRole = await db.select({
    role: allowedUsers.role
  }).from(allowedUsers).where(eq(allowedUsers.id, userId))

  if (userRole) return userRole[0].role;
}


/* check if a use is an admin */
export async function isUserAdmin(userId: string) {
  const result = await db.execute(sql<{ exists: boolean }>`
    SELECT EXISTS (
      SELECT 1 FROM ${allowedUsers} WHERE ${allowedUsers.id} = ${userId} AND ${allowedUsers.role} = 'admin'
    )
  `);

  return result[0].exists as boolean;
}


/* Get all the users in the allowed_users table*/
export async function getAllowedUsers() {
  return await db.select({
    id: allowedUsers.id,
    email: allowedUsers.email,
    role: allowedUsers.role
  }).from(allowedUsers);
}


/* Update a user's role */
export async function updateUserRole(userId: string, role: Role) {
  return db
    .update(allowedUsers)
    .set({ role: role })
    .where(eq(allowedUsers.id, userId));
}


/* Get each trade date and its id, will be used to get a specific date in the 
 * trades page. */
export async function getTradeDates() {
  return db.select({
    id: trades.id,
    entryTime: trades.entryTime,
  }).from(trades);
}


export async function getTrades() {
  return db.select({
    id: trades.id,
    entryTime: trades.entryTime,
    exitTime: trades.exitTime,
    entryPrice: trades.entryPrice,
    exitPrice: trades.exitPrice,
    lotSize: trades.lotSize,
    ratio: trades.ratio,
    takeProfit: trades.takeProfit,
    stopLoss: trades.stopLoss,
    profitInCents: trades.profitInCents
  }).from(trades);
}


/* Get the strategies and their trading plans for a trade */
export async function getStrategiesWithTradingPlans(tradeId: string){
  return db.select({
    strategy: strategies.strategy,
    tradingPlan: tradingPlans.tradingPlan,
  }).from(strategies)
    .where(eq(tradeStrategies.tradesId, tradeId))
    .innerJoin(tradingPlans, eq(tradingPlans.id, strategies.tradingPlansId))
    .innerJoin(tradeStrategies, eq(strategies.id, tradeStrategies.strategiesId));
}


/* Get the trading plans and their strategies to be used to add new strategies */
export async function getAllTradingPlansAndTheirStrategies() {
  return db.select({
    tradingPlan: tradingPlans.tradingPlan,
    strategy: strategies.strategy
  }).from(tradingPlans)
    .innerJoin(strategies, eq(tradingPlans.id, strategies.tradingPlansId));
}


export async function updateTradeStrategies(
  { tradeId, newStrategies }:
  {
    tradeId: string;
    newStrategies: string[]
  }
) {
  /* 1. Delete existing */
  await db.delete(tradeStrategies).where(eq(tradeStrategies.tradesId, tradeId));

  const cte = db.$with('cte_strategies').as(
    db.select({ 
      strategiesId: strategies.id,
      strategy: strategies.strategy
    }).from(strategies)
  )

  return db.with(cte).insert(tradeStrategies)
    .values(newStrategies.map(newStrategy => ({
      tradesId: tradeId,
      strategiesId: sql<string>`(SELECT ${cte.strategiesId} FROM ${cte} WHERE (${cte.strategy} = ${newStrategy}))`
    })))
}
