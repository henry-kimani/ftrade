import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/* This function tells supabase how to get and set cookies server-side. Since 
 * NextJS does not allow setting cookies on server components(otherwise it will
 * throw and error), we set cookies on the middleware. 
 *
 * The Error throw by setAll() (for setting cookies server side) can be ignored 
 * safely
 *
 * */

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({name, value, options}) => 
              cookieStore.set(name, value, options)
            )
          } catch { /* ignore error safely*/ }
        }
      }
    }
  );
}

