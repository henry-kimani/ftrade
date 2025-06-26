CREATE TYPE "public"."trade_types" AS ENUM('BUY', 'SELL');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"login" integer NOT NULL,
	"account_balance" integer NOT NULL,
	"leverage" smallint,
	"trade_mode" boolean,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "accounts_login_unique" UNIQUE("login")
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"note" text,
	"trades_id" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "screenshots_urls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trades_id" uuid,
	"screenshot_url" text
);
--> statement-breakpoint
CREATE TABLE "strategies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"strategy_types_id" uuid,
	"strategy" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "strategy_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"strategy_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trade_strategies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trades_id" uuid,
	"strategies_id" uuid
);
--> statement-breakpoint
CREATE TABLE "trades" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"accounts_id" uuid,
	"ticket" integer NOT NULL,
	"type" "trade_types" NOT NULL,
	"entry_time" timestamp with time zone NOT NULL,
	"exit_time" timestamp with time zone NOT NULL,
	"entry_price" numeric(10, 5) NOT NULL,
	"exit_price" numeric(10, 5) NOT NULL,
	"lot_size" numeric(4, 2) NOT NULL,
	"take_profit" numeric(10, 5) NOT NULL,
	"stop_loss" numeric(10, 5) NOT NULL,
	"ratio" real,
	"profit_in_cents" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_trades_id_trades_id_fk" FOREIGN KEY ("trades_id") REFERENCES "public"."trades"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "screenshots_urls" ADD CONSTRAINT "screenshots_urls_trades_id_trades_id_fk" FOREIGN KEY ("trades_id") REFERENCES "public"."trades"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "strategies" ADD CONSTRAINT "strategies_strategy_types_id_strategy_types_id_fk" FOREIGN KEY ("strategy_types_id") REFERENCES "public"."strategy_types"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "trade_strategies" ADD CONSTRAINT "trade_strategies_trades_id_trades_id_fk" FOREIGN KEY ("trades_id") REFERENCES "public"."trades"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "trade_strategies" ADD CONSTRAINT "trade_strategies_strategies_id_strategies_id_fk" FOREIGN KEY ("strategies_id") REFERENCES "public"."strategies"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "trades" ADD CONSTRAINT "trades_accounts_id_accounts_id_fk" FOREIGN KEY ("accounts_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER POLICY "Only an auth admin can add make changes" ON "allowed_users" TO authenticated USING ((SELECT "allowed_users"."role" FROM allowed_users WHERE "allowed_users"."id" = (select auth.uid())) = 'admin') WITH CHECK ((SELECT "allowed_users"."role" FROM allowed_users WHERE "allowed_users"."id" = (select auth.uid())) = 'admin');