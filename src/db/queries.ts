import { allowedUsers, avatarUrls, notes, Role, screenshotsUrls, strategies, trades, tradeStrategies, tradingPlans } from "@/db/schema";
import { db } from "@/db/dbConn";
import { desc, and, eq, ilike, like, notInArray, or, sql, count } from "drizzle-orm";

const FIRST_RESULT = 0;
const ITEMS_PER_PAGE = 6;

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


export async function getTradeById(tradeId: string) {
  try {
    const trade = await db.select().from(trades)
      .where(eq(trades.id, tradeId));
    return trade[FIRST_RESULT];
  } catch(error) {
    throw new Error("Failed to get trade");
  }
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


export async function updateEdittedTradingPlans(
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

export async function getFilteredTrades(
  query: string,
  currentPage: number
) {

  try {
    return await db.select().from(trades)
      .where(
        or(
          ilike(sql`${trades.ticket}::TEXT`, `%${query}%`),
          ilike(sql`${trades.entryTime}::TEXT`, `%${query}%`),
          ilike(sql`${trades.type}::TEXT`, `%${query}%`),
          ilike(sql`${trades.exitTime}::TEXT`, `%${query}%`),
          ilike(sql`${trades.profitInCents}::TEXT`, `%${query}%`),
          ilike(sql`${trades.entryPrice}::TEXT`, `%${query}%`),
          ilike(sql`${trades.exitPrice}::TEXT`, `%${query}%`),
          ilike(sql`${trades.ratio}::TEXT`, `%${query}%`),
        )
      )
      .orderBy(desc(trades.entryTime))
      .limit(ITEMS_PER_PAGE)
      .offset((currentPage - 1) * ITEMS_PER_PAGE);

  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch filtered trades');
  }
}

export async function getTradesPages(query: string) {
  try {
    const c = await db.select({ count: count() }).from(trades).where( 
      or(
        ilike(sql`${trades.ticket}::TEXT`, `%${query}%`),
        ilike(sql`${trades.entryTime}::TEXT`, `%${query}%`),
        ilike(sql`${trades.type}::TEXT`, `%${query}%`),
        ilike(sql`${trades.exitTime}::TEXT`, `%${query}%`),
        ilike(sql`${trades.profitInCents}::TEXT`, `%${query}%`),
        ilike(sql`${trades.entryPrice}::TEXT`, `%${query}%`),
        ilike(sql`${trades.exitPrice}::TEXT`, `%${query}%`),
        ilike(sql`${trades.ratio}::TEXT`, `%${query}%`),
      )
    );

    return Math.ceil( c[FIRST_RESULT].count / ITEMS_PER_PAGE);
  } catch(error) {
    console.error("Database Error:", error);
    throw new Error('Failed to fetch trade\'s pages')
  }
}


export async function getNote(tradeId: string) {
  try {
    const note = await db.select({
      noteId: notes.id,
      note: notes.note,
      createdAt: notes.createdAt,
      updatedAt: notes.updatedAt
    }).from(notes)
      .where(eq(notes.tradesId, tradeId));

    return note[FIRST_RESULT];
  } catch(error) {
    throw new Error("Failed to get note");
  }
}


export async function createNote(tradeId: string) {
  try {
    await db.insert(notes).values({
      tradesId: tradeId
    });
  } catch(error) {
    throw new Error("Failed to create Note");
  }
}


export async function saveNote(noteId: string, note: string, tradeId: string) {
  await db.update(notes).set({
    note,
  }).where(
    and(
      eq(notes.id, noteId),
      eq(notes.tradesId, tradeId)
    )
  );
}


export async function getUserAvatarURl(userId: string) {
  try {
    const avatarUrl = await db.select({
      avatarUrl: avatarUrls.avatarUrl
    }).from(avatarUrls).where(eq(avatarUrls.userId, userId));

    return avatarUrl[FIRST_RESULT];
  } catch (error){
    throw new Error("Could not get avatar url.");
  }
}


export async function updateAvatarURL(url: string, userId:string) {
  try {
    await db.update(avatarUrls).set({
      avatarUrl: url
    }).where(eq(avatarUrls.userId, userId));
  } catch(error) {
    console.log(error);
    throw new Error("Could not update avatar url");
  }
}


export async function getScreenshotUrls(tradeId: string) {
  try {
    return await db.select({
      screenshotId: screenshotsUrls.id,
      screenshotUrl: screenshotsUrls.screenshotUrl
    }).from(screenshotsUrls).where(eq(screenshotsUrls.tradesId, tradeId))
  }
  catch(error) {
    console.log(error);
    throw new Error("Could not get screenshots");
  }
}


export async function uploadScreenshotsUrls(tradeId: string, url: string) {
  try {
    await db.insert(screenshotsUrls).values({
      tradesId: tradeId,
      screenshotUrl: url
    });
  } catch (error) {
    console.log(error)
    throw new Error("Failed to upload url to db")
  }
}


export async function deleteScreenshot(screenshotId: string) {
  try {
  await db.delete(screenshotsUrls).where(eq(screenshotsUrls.id, screenshotId));
  } catch (error) {
    console.log();
    throw new Error("Could not delete screenshot");
  }
}
