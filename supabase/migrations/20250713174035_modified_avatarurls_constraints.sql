ALTER TABLE "avatar_urls" 
DROP CONSTRAINT "avatar_urls_user_id_allowed_users_id_fk";
--> statement-breakpoint
ALTER TABLE "avatar_urls" 
ADD CONSTRAINT "avatar_urls_user_id_allowed_users_id_fk" 
FOREIGN KEY ("user_id") 
REFERENCES "public"."allowed_users"("id") ON DELETE cascade ON UPDATE cascade;
