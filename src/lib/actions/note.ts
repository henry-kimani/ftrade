'use server';

import { isUserAdmin, createNote, saveNote } from "@/db/queries";
import { verifyUser } from "@/lib/dal";
import { revalidatePath } from "next/cache";
import { UpdatedNoteSchema, CreateNoteSchema } from "@/lib/schemas";



export async function createNoteAction(tradeId: string) {

  const { user } = await verifyUser();
  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) return { message: "You are not an admin." };

  const validatedValues = CreateNoteSchema.safeParse({
    tradeId
  });

  if (!validatedValues.success) {
    return {
      errors: validatedValues.error.flatten().fieldErrors,
      message: "Check your values."
    }
  }

  try {
    await createNote(validatedValues.data.tradeId);
  } catch {
    return { message: "An error occurred." }
  }

  revalidatePath("/trades");
}



export async function updateNoteAction(
  noteId: string, tradeId: string, formData: FormData
) {

  const { user } = await verifyUser();
  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) return { message: "You are not an admin." };

  const validatedValues = UpdatedNoteSchema.safeParse({
    note: formData.get('note'),
  });

  if (!validatedValues.success) {
    return {
      errors: validatedValues.error.flatten().fieldErrors,
      message: "Check your values"
    }
  }

  try {
    await saveNote(noteId, validatedValues.data.note, tradeId);
  } catch {
    return { message: "An error occured." };
  }
}


