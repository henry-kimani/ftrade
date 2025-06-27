CREATE TABLE "phases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phase" varchar(45) NOT NULL,
	"phase_color" varchar(7),
	CONSTRAINT "color_hext_check" CHECK ("phases"."phase_color" IS NULL OR "phases"."phase_color" ~* '^#[a-f0-9]{6}$')
);
--> statement-breakpoint
CREATE TABLE "trade_phases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trades_id" uuid,
	"phases_id" uuid
);
--> statement-breakpoint
ALTER TABLE "trade_phases" 
ADD CONSTRAINT "trade_phases_trades_id_trades_id_fk" 
FOREIGN KEY ("trades_id") 
REFERENCES "public"."trades"("id") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "trade_phases" 
ADD CONSTRAINT "trade_phases_phases_id_phases_id_fk" 
FOREIGN KEY ("phases_id") 
REFERENCES "public"."phases"("id") ON DELETE cascade ON UPDATE cascade;
