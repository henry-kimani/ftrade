ALTER TABLE "trade_phases" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
DROP TABLE "trade_phases" CASCADE;
--> statement-breakpoint
ALTER TABLE "trades" 
ADD COLUMN "phases_id" uuid;
--> statement-breakpoint
ALTER TABLE "trades" 
ADD CONSTRAINT "trades_phases_id_phases_id_fk" 
FOREIGN KEY ("phases_id") 
REFERENCES "public"."phases"("id") ON DELETE cascade ON UPDATE cascade;
