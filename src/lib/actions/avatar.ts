'use server';

import { verifyAction } from "@/lib/dal";
import { State, AvatarImageSchema } from "@/lib/schemas";
import { genPathName } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { updateAvatarURL } from "@/db/queries";



export async function uploadAvatarAction(prevState: State, formData: FormData) {
  /* Here, we are not checking if the use is an admin, since we want anyone to
   * upload a profile picture. However, only users with a role higher than
   * viewer are allowed.
   * This is handle by the storage policies */

  const user = await verifyAction();

  if ("message" in user) {
    return {
      message: user.message
    };
  }

  const validatedValues = AvatarImageSchema.safeParse({
    avatar: formData.get('avatar')
  });

  if (!validatedValues.success) {
    return {
      errors: validatedValues.error.flatten().fieldErrors,
      message: "Check your values"
    }
  }

  const { avatar } = validatedValues.data;
  if (!avatar) return { message: "No file to upload" };

  const supabase = await createClient();

  const filePath = genPathName("avatar", user.id, avatar);

  /* Upsert is set to true, to replace the photo if it exists */ 
  const { error } = await supabase.storage.from('avatars').upload(filePath, avatar, { upsert: true });

  if (error) {
    return { message: "Encountered an error while uploading." };
  }

  /* Save the url in the users table */
  try {
    await updateAvatarURL(filePath, user.id);
  } catch {
    return { message: "Encountered an error." }
  }

  revalidatePath("/(dashboard)", 'layout');
  revalidatePath("/settings");
}

