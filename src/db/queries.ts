import { allowedUsers, Role, strategies, trades, tradeStrategies, tradingPlans } from "@/db/schema";
import { db } from "@/db/dbConn";
import { and, eq, inArray, notInArray, sql } from "drizzle-orm";

const FIRST_RESULT = 0;

/* Check if the user is in the allowed_users table */
type UserId = { id: string; };
type Email = { email: string };
type Search = UserId | Email;

export async function isAllowedUser(key: Search) {

  if ("id" in key) {
    const result = await db.select().from(allowedUsers).where(eq(allowedUsers.id, key.id))
    return result[FIRST_RESULT].id === key.id;
  } else {
    const result = await db.select().from(allowedUsers).where(eq(allowedUsers.email, key.email))
    if (result[FIRST_RESULT]) { 
      return result[FIRST_RESULT].email === key.email;
    } else return false;
  }
}


/* Get the role of the current user */
export async function getUserRole(userId: string) {
  const userRole = await db.select({
    role: allowedUsers.role
  }).from(allowedUsers).where(eq(allowedUsers.id, userId))

  if (userRole) return userRole[FIRST_RESULT].role;
}


/* check if a use is an admin */
export async function isUserAdmin(userId: string) {
  const result = await db
    .select({ role: allowedUsers.role })
    .from(allowedUsers)
    .where(eq(allowedUsers.id, userId));

  return result[0].role === 'admin';
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
    tradingPlanId: tradingPlans.id,
    tradingPlan: tradingPlans.tradingPlan,
    strategy: strategies.strategy
  }).from(tradingPlans)
    .innerJoin(strategies, eq(tradingPlans.id, strategies.tradingPlansId));
}


/* To be used to update a tradingPlan and its strategies */
export async function getTradingPlanAndStrategiesWithIds(tradingPlanId: string) {
  return db.select({
    tradingPlanId: tradingPlans.id,
    tradingPlan: tradingPlans.tradingPlan,
    strategyId: strategies.id,
    strategy: strategies.strategy,
  }).from(tradingPlans)
  .innerJoin(strategies, eq(tradingPlans.id, strategies.tradingPlansId))
  .where(eq(tradingPlans.id, tradingPlanId));
}


export async function updateTradeStrategiesForTrade(
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


export async function newTradingPlan(
  { tradingPlan, newStrategies }:
  {
    tradingPlan: string;
    newStrategies: string[];
  }
) {

  const newTradingPlanId = await db.insert(tradingPlans).values({
    tradingPlan,
  }).returning({ id: tradingPlans.id });

  await db.insert(strategies).values(
    newStrategies.map(strategy => ({ tradingPlansId: newTradingPlanId[FIRST_RESULT].id, strategy }))
  )
}


export async function deleteTradingPlan({ tradingPlanId }: { tradingPlanId: string }) {
  return db.delete(tradingPlans).where(eq(tradingPlans.id, tradingPlanId));
}


export async function updateUpdatedTradingPlans(
  { tp, editted, newStrats }:
  {
    tp: {
      tradingPlanId: string;
      tradingPlan: string;
    },
    editted: {
      strategyId: string;
      strategy: string;
    }[],
    newStrats: string[] | undefined
  }
) {
  /* 1. update trading plan name
   * 2. Delete those that doesn't exist 
   * 3. update editted
   * 4. Insert new */

  /* update trading plan */
  await db.update(tradingPlans).set({
    tradingPlan: tp.tradingPlan
  }).where(eq(tradingPlans.id, tp.tradingPlanId));

  /* Construct the data to check for deletion */
  const construct = editted.map(({ strategyId }) => strategyId);
  await db.delete(strategies)
  .where(
    and(
      notInArray(strategies.id, construct),
      eq(strategies.tradingPlansId, tp.tradingPlanId)
    )
  );

  /* Update Editted strategies */
  editted.forEach(async({ strategyId, strategy }) => {
    await db.update(strategies).set({
      strategy
    }).where(eq(strategies.id, strategyId));
  });

  /* Insert new strategies */
  if (newStrats && newStrats.length > 0) {
    await db.insert(strategies).values(
      newStrats.map(strategy => ({ tradingPlansId: tp.tradingPlanId, strategy }))
    );
  }
}
