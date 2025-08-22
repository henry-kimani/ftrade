'use server';

import { verifyUser } from "@/lib/dal";
import { isUserAdmin } from "@/db/queries";
import { DataToSyncSchema } from "@/lib/schemas";
import { getAccountId, getAccountLogins, getTradesTicketsForAccount, insertNewAccount, insertNewTrade, updateExistingAccount } from "@/db/sync-data-queries";

export async function syncDataToSupabaseAction(formData: FormData) {
  // Check the current user is an admin
  const { user } = await verifyUser();
  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) {
    return {
      message: "You are not an Admin"
    }
  };

  const accountStatusFormData = formData.get("account-status");
  const tradeHistoryFormData = formData.get("trade-history");

  if (!accountStatusFormData) {
    return {
      message: "No account status data submitted."
    };
  }

  if (!tradeHistoryFormData) {
    return {
      message: "No trade history data submitted."
    };
  }

  // Validate the data schema
  const validatedData = DataToSyncSchema.safeParse({
    accountStatus: JSON.parse(accountStatusFormData.toString()),
    tradeHistory: JSON.parse(tradeHistoryFormData.toString()),
  });

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Check your values"
    };
  }

  const accountLogins = await getAccountLogins();
  const { LOGIN, NAME, BALANCE, TRADE_MODE, LEVERAGE } = validatedData.data.accountStatus;

  /* What if they are not trades to add? Zod ensures that there is at least one
   * trade, when we are validating the data above. */

  /* DOESN'T EXIST */
  if (!accountLogins.some(({ login }) =>  login === LOGIN )) {
    // If the login doen't already exist, insert it and return its id
    const { newId } = await insertNewAccount({
      name: NAME,
      login: LOGIN,
      accountBalance: (BALANCE * 100), // Convert to cents
      tradeMode: TRADE_MODE === 1, // True: Real, False: Demo
      leverage: LEVERAGE
    });

    /* This means this login does have trades. We don't have to check if a trade
     * exists, since they are none to compare to. */
    const { TRADES } = validatedData.data.tradeHistory;
    TRADES.map(async(trade) => {
      await insertNewTrade({
        accountsId: newId,
        ticket: trade.TICKET,
        type: trade.TYPE,
        exitTime: new Date(trade.CLOSE_TIME),
        entryTime: new Date(trade.OPEN_TIME),
        entryPrice: String(trade.OPEN_PRICE),
        exitPrice: String(trade.CLOSE_PRICE),
        lotSize: String(trade.LOTS),
        takeProfit: String(trade.TAKE_PROFIT),
        stopLoss: String(trade.STOP_LOSS),
        profitInCents: (trade.PROFIT * 100)
      });
    });

  } else {
    /* EXISTS */
    // If it does exist, get its id, to be used to insert the trades
    const { id } = await getAccountId(String(LOGIN));
    await updateExistingAccount({
      accountId: id,
      name: NAME,
      accountBalance: (BALANCE * 100), // Convert to cents
      leverage: LEVERAGE
    });

    const recentTradesTickets = await getTradesTicketsForAccount(id);
    const { TRADES } = validatedData.data.tradeHistory;
    TRADES.map((trade) => {
      /* If a trade doesn't exist by its ticket, for the last 30d, you can insert it */
      if (!recentTradesTickets.some(({ ticket }) => ticket === trade.TICKET )) {
        insertNewTrade({
          accountsId: id,
          ticket: trade.TICKET,
          type: trade.TYPE,
          exitTime: new Date(trade.CLOSE_TIME),
          entryTime: new Date(trade.OPEN_TIME),
          entryPrice: String(trade.OPEN_PRICE),
          exitPrice: String(trade.CLOSE_PRICE),
          lotSize: String(trade.LOTS),
          takeProfit: String(trade.TAKE_PROFIT),
          stopLoss: String(trade.STOP_LOSS),
          profitInCents: (trade.PROFIT * 100)
        });
      }
    });
  }

  return {
    message: "Success!!!!!!"
  };
}
