import { updateSession } from "@/lib/supabase/middleware";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

export default async function middlware(request: NextRequest) {

  const supabase = await createClient();

  /* Check if the user is authorized */
  const { data: { user } } = await supabase.auth.getUser();

  console.log("middleware check");

  if (
    !user &&
    !request.url.startsWith("/login") &&
    !request.url.startsWith("/auth")
  ) {
    console.log("middleware check");
    redirect("/login");
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /* Match all request path except those starting with:
     * 1. _next/static - static files
     * 2. _next/image - image optimization files
     * 3. favicon.ico 
     * */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ]
};
