ALTER TABLE "strategy_types" 
RENAME TO "trading_plans";
--> statement-breakpoint
ALTER TABLE "strategies" 
RENAME COLUMN "strategy_types_id" TO "trading_plans_id";
--> statement-breakpoint
ALTER TABLE "trading_plans" 
RENAME COLUMN "strategy_type" 
TO "trading_plan";
--> statement-breakpoint
ALTER TABLE "strategies" 
DROP CONSTRAINT "strategies_strategy_types_id_strategy_types_id_fk";
--> statement-breakpoint
ALTER TABLE "strategies" 
ADD CONSTRAINT "strategies_trading_plans_id_trading_plans_id_fk" 
FOREIGN KEY ("trading_plans_id") 
REFERENCES "public"."trading_plans"("id") ON DELETE cascade ON UPDATE cascade;
