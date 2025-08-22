import {
  boolean, real, varchar,
  integer, numeric, pgEnum, pgPolicy, pgTable, smallint, text, timestamp, uuid,
  check,
  pgView,
  QueryBuilder, 
} from "drizzle-orm/pg-core";
import { authenticatedRole, authUid, authUsers } from "drizzle-orm/supabase";
import { sql, InferEnum, gte } from "drizzle-orm";
import { timestamps } from "@/db/helpers";
import { eq } from "drizzle-orm";


const qb = new QueryBuilder();


export const roles = pgEnum('role', ['none', 'viewer', 'admin']);
export type Role = InferEnum<typeof roles>;

export const tradeTypes = pgEnum('trade_types', ['BUY', 'SELL']);
export type TradeTypes = InferEnum<typeof tradeTypes>;


export const allowedUsers = pgTable('allowed_users', {
  id: uuid()
    .references(() => authUsers.id, { onDelete: 'cascade', onUpdate: 'cascade'})
    .notNull()
    .primaryKey(),
  email: varchar({ length: 50 }).unique().notNull(),
  role: roles().notNull().default("none"),
  }, (table) => [
    pgPolicy('Only an auth admin can add make changes', {
      to: authenticatedRole,
      for: "all",
      using: sql`(${table.role} >= 'viewer')`,
      /* For INSERT, UPDATE and DELETE commands, only allow the to run if the 
       * current user is and admin */
      withCheck: sql`(${table.role} = 'admin')`,
    })
  ]
);

export const checkRoleView = pgView("check_role_view")
.as(
  qb.select({ role: allowedUsers.role }).from(allowedUsers).where(eq(allowedUsers.id, authUid))
);

export const avatarUrls = pgTable("avatar_urls", {
  id: uuid().primaryKey().notNull().defaultRandom(),
  userId: uuid().references(() => allowedUsers.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  avatarUrl: text(),
}, () => [
    pgPolicy('Anyone can view a profile', {
      to: authenticatedRole,
      for: "all",
      using: sql`(SELECT role FROM check_role_view) >= 'viewer'`,
      withCheck: sql`(SELECT role FROM check_role_view) >= 'viewer'`
    })
  ]
);

/* Every time we insert data (trades_history) we will updated the accounts table
 * columns `account_balance`, `leverage`, `trade_mode` and `updated_at` */

/* createdAt column keeps track, not of when the account was created on meta-trader 
 * but when the data first arrived on Ftrade.
 * updatedAt column keeps track of when the account was last updated with info. */
export const accounts = pgTable('accounts', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  name: varchar({ length: 50 }).notNull(), // of the login in meta trader
  login: integer().notNull().unique(), // a unique identifier for a login in meta trader
  accountBalance: integer().notNull(), // current account balance in meta trader
  leverage: smallint(), // the current leverage being used in the login
  tradeMode: boolean(), // the current_trade_mode in meta_trader
  ...timestamps
});


/* Keeps track of the trading plans, to which a type of trading plan can have
 * other many strategies. one-to-many relationship with strategies*/
export const tradingPlans= pgTable('trading_plans', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  tradingPlan: text().notNull(),
  ...timestamps
});


export const trades = pgTable('trades', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  accountsId: uuid().references(() => accounts.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  ticket: integer().notNull(),
  type: tradeTypes().notNull(),
  symbol: text().notNull(),
  entryTime: timestamp({ withTimezone: true }).notNull(),
  exitTime: timestamp({ withTimezone: true }).notNull(),
  entryPrice: numeric({ precision: 10, scale: 5 }).notNull(), // 12345.12345
  exitPrice: numeric({ precision: 10, scale: 5 }).notNull(), // 12345.12345
  lotSize: numeric({ precision: 4, scale: 2 }).notNull(), // 10.00
  takeProfit: numeric({ precision: 10, scale: 5}).notNull(), // 12345.12345
  stopLoss: numeric({ precision: 10, scale: 5}).notNull(), // 12345.12345
  ratio: real(), // can be an approximation since its determined at runtime and rounded up
  profitInCents: integer().notNull(),
  phasesId: uuid().references(() => phases.id, { onDelete: 'cascade', onUpdate: 'cascade' })
});

/* Keep track of the many-to-many relationship between trades and strategies */ 
export const tradeStrategies = pgTable('trade_strategies', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  tradesId: uuid().references(() => trades.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  strategiesId: uuid().references(() => strategies.id, { onDelete: 'cascade', onUpdate: 'cascade' })
});


/* Keep track of the strategies that can be used in trades and what group(plans) those
 * strategies belong to. */
export const strategies = pgTable('strategies', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  tradingPlansId: uuid().references(() => tradingPlans.id, { onDelete: 'cascade', onUpdate: 'cascade' }),// To tells us what group this strategy belongs to
  strategy: text(),
  ...timestamps
});


/* A trade can only have one note, one-to-one relationship */
export const notes = pgTable('notes', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  note: text(), // can be null
  tradesId: uuid().references(() => trades.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  ...timestamps
});


/* A trade can have many screenshot_urls */
export const screenshotsUrls = pgTable('screenshots_urls', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  tradesId: uuid().references(() => trades.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  screenshotUrl: text() // there can be nothing in the screenshots for a trade
});


export const phases = pgTable('phases', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  phase: varchar({ length: 45 }).notNull(),
  phaseColor: varchar({ length: 7 })
}, (table) => [
    check(
      "color_hext_check",
      sql`${table.phaseColor} IS NULL OR ${table.phaseColor} ~* '^#[a-f0-9]{6}$'`
    ),
  ]
);
