CREATE TABLE "avatar_urls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"avatar_url" text
);
--> statement-breakpoint
ALTER TABLE "avatar_urls" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "avatar_urls" 
ADD CONSTRAINT "avatar_urls_user_id_allowed_users_id_fk" 
FOREIGN KEY ("user_id") 
REFERENCES "public"."allowed_users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "allowed_users" DROP COLUMN "avatar_url";
--> statement-breakpoint
CREATE VIEW "public"."check_role_view" 
AS (
  select "role" from "allowed_users" where "allowed_users"."id" = (select auth.uid())
);
--> statement-breakpoint
CREATE POLICY "Anyone can view a profile" 
ON "avatar_urls" 
AS PERMISSIVE 
FOR ALL 
TO "authenticated" 
USING (
  (SELECT role FROM check_role_view) >= 'viewer'
) 
WITH CHECK (
  (SELECT role FROM check_role_view) >= 'viewer'
);
--> statement-breakpoint
ALTER POLICY "Only an auth admin can add make changes" 
ON "allowed_users" 
TO authenticated 
USING (
  ("allowed_users"."role" >= 'viewer')
)
WITH CHECK (
  ("allowed_users"."role" = 'admin')
);
