import { db } from "./dbConn";
import { gt, and, lte, count, eq, sql, sum, gte } from "drizzle-orm";
import { trades, phases, accounts } from "./schema";

const FIRST_RESULT = 0;

type RangeType = {
  from: Date;
  to: Date;
};

export async function getTotalProfit({ from, to}: RangeType) {
  try {
    const profit = await db.select({
      profit: trades.profitInCents,
    }).from(trades)
      .where(
        and(
          gt(trades.profitInCents, 0),
          gt(trades.entryTime, from),
          lte(trades.entryTime, to)
        )
      );

    return profit[FIRST_RESULT] ? profit[FIRST_RESULT] : undefined;
  } catch {
    throw new Error("Database Error: Failed to get total profit.");
  }
}


export async function getTotalLoss({ from, to}: RangeType) {
  try {
  const loss = await db.select({
    loss: trades.profitInCents
  }).from(trades)
    .where(
      and(
        lte(trades.profitInCents, 0),
        gte(trades.entryTime, from),
        lte(trades.entryTime, to)
      )
    );

  return loss[FIRST_RESULT] ? loss[FIRST_RESULT] : undefined;
  } catch {
    throw new Error("Database Error: Failed to get total loss.");
  }
}


export async function getMostUsedPhase({ from, to }: RangeType) {
  try {
    const pc = await db.select({
      phase: phases.phase,
      phaseColor: phases.phaseColor,
      phaseCount: count(trades.phasesId)
    }).from(trades)
      .where(
        and(
          gte(trades.entryTime, from),
          lte(trades.entryTime, to)
        )
      )
      .innerJoin(phases, eq(phases.id, trades.phasesId))
      // Both columns must be included to prevent postgres database error
      .groupBy(phases.phase, phases.phaseColor);

    return (pc && pc.length > 0) ? pc : undefined;
  } catch {
    throw new Error("Database Error: Failed to get most used phase.");
  }
}

export async function getAccountBalance() {
  const balance = await db.select({
    balance: accounts.accountBalance
  }).from(accounts);

  return balance[FIRST_RESULT];
}


export async function getWinRate({ from, to }: RangeType) {
  const totalTrades = await db.select({
    total: count()
  }).from(trades)
    .where(
      and(
        gte(trades.entryTime, from),
        lte(trades.entryTime, to)
      )
    );

  const wonTrades = await db.select({
    wonTrades: count()
  }).from(trades)
    .where(
      and(
        gt(trades.profitInCents, 0),
        gte(trades.entryTime, from),
        lte(trades.entryTime, to)
      )
    );

  return Math.floor((wonTrades[FIRST_RESULT].wonTrades / totalTrades[FIRST_RESULT].total) * 100);
}


export async function getProfitLossRatio({ from, to }: RangeType) {
  try {
    const p = await db.select({
      profit: trades.profitInCents,
    }).from(trades)
      .where(
        and(
          gt(trades.profitInCents, 0),
          gte(trades.entryTime, from),
          lte(trades.entryTime, to)
        )
      );

    const l = await db.select({
      loss: trades.profitInCents,
    }).from(trades)
      .where(
        and(
          lte(trades.profitInCents, 0),
          gte(trades.entryTime, from),
          lte(trades.entryTime, to)
        )
      );


    if (
      !(l && p) ||
        (l.length < 1 && p.length < 1)
    ) {
      return undefined;
    }

    const ratio = p[FIRST_RESULT].profit % l[FIRST_RESULT].loss;

    /* If the remainder is 0, then ration:1 */
    if (ratio === 0) {
      if (p[FIRST_RESULT].profit > l[FIRST_RESULT].loss) {
        return [p[FIRST_RESULT].profit/Math.abs(l[FIRST_RESULT].loss), 1];
      } else {
        return [ 1, p[FIRST_RESULT].profit/Math.abs(l[FIRST_RESULT].loss) ];
      }
    } else {
      return [ p[FIRST_RESULT].profit, l[FIRST_RESULT].loss ];
    }
  } catch {
    throw new Error("Database Error: Failed to get profit loss ratio.")
  }
}


export async function getTotalProfitLossCount({ from, to }: RangeType) {
  try {
    const profit = await db.select({
      profit: count(trades.profitInCents)
    }).from(trades)
      .where(
        and(
          gt(trades.profitInCents, 0),
          gte(trades.entryTime, from),
          lte(trades.entryTime, to)
        )
      );

    const loss = await db.select({
      loss: count(trades.profitInCents)
    }).from(trades)
      .where(
        and(
          lte(trades.profitInCents, 0),
          gte(trades.entryTime, from),
          lte(trades.entryTime, to)
        )
      );

    if (
      !(loss && profit) ||
      (loss.length < 1 && profit.length < 1)
    ) {
      return undefined;
    }

    return {
      profit: profit[FIRST_RESULT].profit , 
      loss: loss[FIRST_RESULT].loss
    };
  } catch {
    throw new Error("Database Error: Failed to get profit loss count.")
  }
}


export async function getYearsForSelect() {
  try {
    const yearsToChoose = await db.select({
      year: sql<number>`EXTRACT(YEAR FROM ${trades.entryTime}) AS select_year`
    }).from(trades)
      .groupBy(sql`EXTRACT(YEAR FROM ${trades.entryTime})`)
      .orderBy(sql`select_year`);

    return yearsToChoose;
  } catch {
    throw new Error("Database Error: Failed to get the years for the select.");
  }
}


export async function getMonthlyProfitForYear(year: number) {
  try {
    const totalProfit = await db.select({
      month: sql<number>`EXTRACT(MONTH FROM ${trades.entryTime}) AS month`,
      totalMonthlyProfit: sum(trades.profitInCents)
    }).from(trades)
      .where(
        // Filter only records of the specified year
        sql`EXTRACT(YEAR FROM ${trades.entryTime}) = ${year}`
      )
      .groupBy(
        // Group month, using both for flexibility
        sql`EXTRACT(MONTH FROM ${trades.entryTime}), TO_CHAR(${trades.entryTime}, 'YYYY-MM')`
      )
      // Order the results by noth
      .orderBy(sql`month`);

    return totalProfit;
  } catch {
    throw new Error("Database Error: Could not get monthly profit for line chart.");
  }
}
