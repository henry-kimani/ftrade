/* The DAL: Data Access Layer 
 * This is used to verify if the user is an authenticated */

import 'server-only';

import { cache } from 'react';
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const verifyUser = cache(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  // Redirect the user if they are not logged in
  if (error || !data.user) {
    redirect("/login");
  }

  return data;
});
