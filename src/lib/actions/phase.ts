'use server';

import { verifyUser } from "@/lib/dal";
import { isUserAdmin, insertPhases, insertPhaseToTrade } from "@/db/queries";
import { PhasesSchema, PhaseSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";



export async function insertPhaseAction(formData: FormData) {

  const { user } = await verifyUser();
  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) return { message: "You are not an admin." }

  const data = formData.get('added-phases');

  if (data === 'undefined' || !data) return { message: "Submitted nothing" }; 

  const validatedValues = PhasesSchema.safeParse({
    addedPhases: JSON.parse(data?.toString()),
  });

  if (!validatedValues.success) {
    return {
      errors: validatedValues.error.flatten().fieldErrors,
      message: "Check your values."
    }
  }
  
  try {
    await insertPhases(validatedValues.data.addedPhases);
  } catch(error) {
    console.log(error);
    return { message: "An error occured." };
  }

  revalidatePath("/settings");
  return { message: "All Good." }
}



export async function insertPhaseToTradeAction(tradeId: string, formData: FormData) {

  const { user } = await verifyUser();
  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) return { message: "You are not an admin." };
  
  const validatedValues = PhaseSchema.safeParse({
    selectedPhaseId: formData.get('selected-phase-id')
  });

  if (!validatedValues.success) {
    return {
      errors: validatedValues.error.flatten().fieldErrors,
      message: "Check your values."
    }
  }

  try {
    await insertPhaseToTrade(tradeId, validatedValues.data.selectedPhaseId);
  } catch {
    return { message: "An error occured." }
  }
}


