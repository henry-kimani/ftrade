
import { sql } from "drizzle-orm";

/* ADDED MANUALLY INTO MIGRATIONS */
export const handleNewUserFunction = sql`
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  SET search_path=''
  AS $$
    BEGIN
      INSERT INTO public.allowed_users 
        (id, email)
      VALUES 
        (new.id, new.email);

      RETURN new;
    END;
  $$ LANGUAGE plpgsql 
  SECURITY DEFINER;
`;

export const onAuthUserCreated = sql`
  CREATE OR REPLACE TRIGGER on_auth_user_created 
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
`;
