'use server';

import { AvatarImageSchema } from "@/lib/schemas";
import { verifyUser } from "@/lib/dal";
import { isUserAdmin } from "@/db/queries";
import { createClient } from "@/lib/supabase/server";
import { genPathName } from "@/lib/utils";
import { revalidatePath } from "next/cache";



export async function uploadRefImageAction(formData: FormData) {
  const { user } = await verifyUser();
  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) return;

  /* A reference image and an avatar share the same validation schema */
  const validatedValues = AvatarImageSchema.safeParse({
    avatar: formData.get('reference-image')
  });

  if (!validatedValues.success) return;

  const supabase = await createClient();
  const { avatar: refImage } = validatedValues.data;

  if (!refImage) return;

  const filePath = genPathName("ref", "", refImage);

  await supabase.storage.from('references').upload(filePath, refImage, { upsert: true})

  revalidatePath("/settings");
}

