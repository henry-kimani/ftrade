'use server';

import { State } from "@/lib/schemas";
import { verifyUser } from "@/lib/dal";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isUserAdmin, updateStrategiesForTrade, updateEdittedTradingPlan, deleteTradingPlan, newTradingPlan } from "@/db/queries";
import { UpdateTradeStrategiesSchema, NewTradingPlansSchema, EdittedTradingPlansSchema } from "@/lib/schemas";
import { UpdateTradeStrategies } from "@/lib/definitions";



/* Update the strategies for a specific trade */
export async function updateStrategiesForTradeAction(formData: FormData) {

  const { user } = await verifyUser();
  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) return { message: "You are not an admin" };

  const validatedValues = UpdateTradeStrategiesSchema.safeParse({
    tradeStrategies: formData.get('trade-strategies'),
  });

  if (!validatedValues.success) {
    return {
      errors: validatedValues.error.flatten().fieldErrors,
      message: "Check your values."
    }
  }

  const { tradeId, newStrategies }: UpdateTradeStrategies = JSON.parse(validatedValues.data.tradeStrategies);

  try {
    await updateStrategiesForTrade({ tradeId, newStrategies });
  } catch(error) {
    return { message: "Database Error" };
  }

  revalidatePath("/trades");
  return { message: "Success!" }
}



export async function newTradingPlanAction(prevState: State, formData: FormData) {

  const { user } = await verifyUser();
  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) return { message: "You are not an admin" };

  const validatedValues = NewTradingPlansSchema.safeParse({
    tradingPlan: formData.get("trading-plan"),
    strategies: formData.getAll("strategies"),
  })

  if (!validatedValues.success) {
    return {
      errors: validatedValues.error.flatten().fieldErrors,
      message: "Check your values",
    }
  }

  try {
    await newTradingPlan({
      tradingPlan: validatedValues.data.tradingPlan,
      newStrategies: validatedValues.data.strategies
    });
  } catch(error) {
    return { message: "An error occured" }
  }

  revalidatePath("/settings");
}



export async function deleteTradingPlanAction(id: string) {

  const { user } = await verifyUser();
  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) return { "message": "You are not an admin."} ;

  try {
    await deleteTradingPlan({ tradingPlanId: id });
  } catch {
    return { message: "An error occured" };
  }

  revalidatePath("/settings");
  redirect("/settings");
}



export async function updateEdittedTradingPlanAction(tradingPlanId: string, formData: FormData) {

  const { user } = await verifyUser();
  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) return { message: "You are not an admin" };

  const editted = formData.get("edit-strategies");

  if (!editted) {
    return { message: "It would be better if you deleted the trading plan instead." };
  }

  const validatedValues = EdittedTradingPlansSchema.safeParse({
    tradingPlan: formData.get("trading-plan"),
    edittedStrategies: JSON.parse(editted.toString()),
    newStrategies: formData.getAll("new-strategies"),
  });

  if (!validatedValues.success) {
    return {
      error: validatedValues.error.flatten().fieldErrors,
      message: "Check your values.",
    }
  }

  try {
    const { tradingPlan, edittedStrategies, newStrategies } = validatedValues.data;

    await updateEdittedTradingPlan({ 
      tp: {
        tradingPlanId, tradingPlan
      },
      editted: edittedStrategies,
      newStrats: (newStrategies && newStrategies.length > 0) ? newStrategies : undefined,
    })
  } catch (error) {
    console.log(error)
    return { message: "An error occured." }
  }

  revalidatePath("/settings");
  redirect("/settings");
}


