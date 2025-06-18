import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

/* Since server components can't set cookies, we use middleware to refresh expired
 * auth tokens and store them.
 *
 * 1. Refresh the auth token by calling `supabase.auth.getUser`.
 * 
 * 2. Passing the refreshed token to server components, so that they don't try
 * to do that themselves using `request.cookies.set`.
 *
 * 3. Passing the refreshed token to the client to replace the old one using
 * `response.cookies.set`.
 *
 * */

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Set cookies for server components
          cookiesToSet.forEach(({name,value}) => request.cookies.set(name,value));

          // Send the refreshed cookie to the browser
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options}) => supabaseResponse.cookies.set(name, value, options))
        }
      }
    }
  );

  // Refresh the token
  const { data: { user } } = await supabase.auth.getUser();

  // Optimistic Check: if the user is logged in
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    // No user, redirect the user to login page
    const url = request.nextUrl.clone();
    url.pathname = "/login"
    return NextResponse.redirect("/login");
  }

  return supabaseResponse;
}

/* When creating a new response object with NextReponse.next(), make sure to:
 *  ```ts
 * 1. Pass the request
 *    const myNextResponse = NextResponse.next({ request });
 *
 * 2. Copy the cookies
 *    myNextResponse.cookies.setAll(supabaseResponse.cookies.getAll());
 *
 * 3. Change the my response object to fit your need, but avoid changing cookies
 *
 * 4. Finally, return myNextResponse().
 *
 *  ```
 * */
