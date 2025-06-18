CREATE TYPE "public"."role" AS ENUM('none', 'viewer', 'admin');--> statement-breakpoint
CREATE TABLE "allowed_users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(50) NOT NULL,
	"role" "role" DEFAULT 'none' NOT NULL,
	CONSTRAINT "allowed_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "allowed_users" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "allowed_users" 
ADD CONSTRAINT "allowed_users_id_users_id_fk" 
FOREIGN KEY ("id") 
REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
CREATE POLICY "Only an auth user with role viewer and admin can view" 
ON "allowed_users" 
AS PERMISSIVE 
FOR SELECT 
TO "authenticated" 
  USING (
    (SELECT "allowed_users"."role" FROM  allowed_users WHERE "allowed_users"."id" = (select auth.uid())) >= 'viewer'
  );
--> statement-breakpoint
CREATE POLICY "Only an auth admin can add make changes" 
ON "allowed_users" 
AS PERMISSIVE 
FOR ALL 
TO "authenticated" 
  USING (
    (SELECT "allowed_users"."role" FROM allowed_users WHERE "allowed_users"."id" = (select auth.uid())) = 'admin'
  )
  WITH CHECK (
    (SELECT "allowed_users"."role" FROM allowed_users WHERE "allowed_users"."id" = (select auth.uid())) = 'admin'
  );
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER
SET search_path=''
AS $$
  BEGIN
    INSERT INTO public.allowed_users
      (id, email, role)
    VALUES
      (NEW.id, NEW.email, (NEW.raw_user_meta_data->>'role')::"public"."role");

    RETURN NEW;
  END;
$$ LANGUAGE plpgsql
SECURITY DEFINER;
--> statement-breakpoint
CREATE OR REPLACE TRIGGER on_auth_user_created 
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
--> statement-breakpoint
