/* The DAL: Data Access Layer 
 * This is used to verify if the user is an authenticated */

import 'server-only';

import { cache } from 'react';
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { isUserAdmin, isUserNoneRole } from '@/db/queries';

export const verifyUser = cache(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  // Redirect the user if they are not logged in
  if (error || !data.user) {
    redirect("/login");
  }

  return data;
});

export const verifyAction = cache(async () => {
  const supabase  = await createClient();

  const { error, data: { user } } = await supabase.auth.getUser();

  if (error || !user) {
    return { message: "You are not signed in." }
  };

  return user;
});

export const isCurrentUserAdmin = cache(async () => {
  const supabase = await createClient();

  const { error, data: { user } } = await supabase.auth.getUser();

  if (error || !user) notFound();

  return await isUserAdmin(user.id);
});

export const checkUserRoleIsNone = cache(async () => {
  const supabase = await createClient();
  const { error, data: { user } } = await supabase.auth.getUser();
  if (error || !user ) notFound();

  const isNone = await isUserNoneRole(user.id);

  if (isNone) redirect("/none");
});
