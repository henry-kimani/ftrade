'use server';

import { isUserAdmin, updateUserRole } from "@/db/queries";
import { verifyUser } from "@/lib/dal";
import { State, UpdateUserRoleSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";


export async function updateUserRoleAction(userId: string, prevState: State, formData: FormData) {

  const { user } = await verifyUser();
  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) return { message: "You are not an admin." };

  /* Check if the user is trying to change their role */
  if (user.id === userId) return { message: "Can't change ur role" };

  const validatedValues = UpdateUserRoleSchema.safeParse({
    role: formData.get('role')
  });

  if (!validatedValues.success){
    return {
      errors: validatedValues.error.flatten().fieldErrors,
      message: "Check your Values" 
    };
  }
  try {
    await updateUserRole(userId, validatedValues.data.role);
  } catch {
    return { message: "Failed to Update." }
  }

  revalidatePath("/settings");
}


