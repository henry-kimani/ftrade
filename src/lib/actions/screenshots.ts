'use server';

/* Screenshot are upload via the API route "/api/upload" because uppy cannot 
 * user server actions. */

import { verifyUser } from "@/lib/dal";
import { isUserAdmin, deleteScreenshot } from "@/db/queries";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteScreenshotAction(screenshotId: string, screenshotPath: string) {
  const { user } = await verifyUser();
  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) return;

  if (!screenshotId) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.storage.from('screenshots').remove([screenshotPath]);

  if (error) {
    return;
  }

  try {
    await deleteScreenshot(screenshotId);
  } catch {
    return;
  }

  revalidatePath("/trades");
}


