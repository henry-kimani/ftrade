DROP POLICY "Only an auth user with role viewer and admin can view" 
ON "allowed_users" CASCADE;
--> statement-breakpoint
ALTER POLICY "Only an auth admin can add make changes" 
ON "allowed_users" 
TO authenticated 
  USING (
    (SELECT "allowed_users"."role" FROM allowed_users WHERE "allowed_users"."id" = (select auth.uid())) >= 'viewer'
  ) WITH CHECK (
    (SELECT "allowed_users"."role" FROM allowed_users WHERE "allowed_users"."id" = (select auth.uid())) = 'admin'
  );
