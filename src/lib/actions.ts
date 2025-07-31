'use server';

import {
    AvatarImageSchema,
  CreateUserSchema, EdittedTradingPlansSchema, LoginSchema, NewTradingPlansSchema, PhaseSchema, PhasesSchema, State, 
  UpdatedNoteSchema, 
  UpdateTradeStrategiesSchema, UpdateUserRoleSchema 
} from "@/lib/schemas";
import {
  isAllowedUser, getUserRole, isUserAdmin, updateUserRole, newTradingPlan, 
  updateTradeStrategiesForTrade, 
  deleteTradingPlan,
  updateEdittedTradingPlans,
  createNote,
  saveNote,
  updateAvatarURL,
  deleteScreenshot,
  insertPhases,
  insertPhaseToTrade
} from "@/db/queries";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { verifyAction, verifyUser } from "./dal";
import { UpdateTradeStrategies } from "./definitions";
import { genPathName } from "./utils";



export async function login(prevState: State, formData: FormData) {
  const supabase = await createClient();

  const validatedValues = LoginSchema.safeParse({
    email: formData.get("email")
  });

  if (!validatedValues.success) {
    return { 
      errors: validatedValues.error.flatten().fieldErrors,
      message: "Check your values" 
    }
  }

  const shouldCreateUser = validatedValues.data.email === process.env.INITIAL_ADMIN;

  /* Signin the user */
  const { error: signInError } = await supabase.auth.signInWithOtp({
    email: validatedValues.data.email,
    options: {
      shouldCreateUser: true,
      data: shouldCreateUser ? {
        "role": "admin",
      }: {}
    }
  });

  if (signInError) {
    return { message: "Are sure you are a valid user?" };
  } else {
    return { message: `Success! Now check the email ${validatedValues.data.email}`};
  }
}


export async function logoutAction() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut({ scope: "local" });
  
  if (error) {
    return;
  }
}


export async function createUser(prevState: State, formData: FormData) {
  const supabase = await createClient();

  const validatedValues = CreateUserSchema.safeParse({
    email: formData.get('email'),
    role: formData.get('role')
  });

  if (!validatedValues.success) {
    return { 
      errors: validatedValues.error.flatten().fieldErrors,
      message: "Check your values."
    };
  }

  // If the current user is an admin allow the insert 
  const { error, data: { user } } = await supabase.auth.getUser();

  if (error || !user) {
    return { message: "You are not a signed in user." };
  }

  const userId = user.id;

  try {
    const userRole = await getUserRole(userId);

    // Does that user exist in the allowed_users table 
    if (userRole===undefined) {
      return { message: "You are not an allowed user. Contact the admin." };
    }

    // Check if current user is an admin
    if (userRole !== "admin") {
      return { message: "You are not an admin." };
    };

    // Check if the user being inserted already exists 
    const isUserExists = await isAllowedUser({ email: validatedValues.data.email });
    if (isUserExists) {
      return { message: "User already exists." };
    }

  } catch(error) {
    return { message: "An error occured." };
  } 

  const { error: signInError } = await supabase.auth.signInWithOtp({
    email: validatedValues.data.email,
    options: {
      shouldCreateUser: true, // Add the user in auth.users and public.allowed_users
      data: {
        "role": validatedValues.data.role
      }
    }
  });

  if (signInError) {
    return { message: "An error occured while creating user. Try again." };
  }

  revalidatePath("/settings");
  redirect("/settings");
}



export async function updateUserRoleAction(userId: string, prevState: State, formData: FormData) {
  const validatedValues = UpdateUserRoleSchema.safeParse({
    role: formData.get('role')
  });

  if (!validatedValues.success){
    return {
      errors: validatedValues.error.flatten().fieldErrors,
      message: "Check your Values" 
    };
  }

  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { message: "You are not signed in." };
  }

  /* Check if the user is trying to change their role */
  if (user.id === userId) {
    return { message: "Can't change ur role" };
  }

  try {
    /* Check if the current user is allowed to make an update */
    const isAdmin = await isUserAdmin(user.id);

    if (!isAdmin) {
      return { message: "You are not an admin" };
    }

    await updateUserRole(userId, validatedValues.data.role);

  } catch {
    return { message: "Failed to Update." }
  }

  revalidatePath("/settings");
}


export async function updateTradeStrategiesAction(formData: FormData) {

  // Check user is admin
  const user = await verifyAction();

  if ('message' in user) {
    return { message: user.message };
  } 

  const isAdmin = await isUserAdmin(user.id);

  if (!isAdmin) {
    return { message: "You are not an admin" };
  }

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
    await updateTradeStrategiesForTrade({ tradeId, newStrategies });
  } catch(error) {
    return { message: "Database Error" };
  }

  revalidatePath("/trades");
  return { message: "Success!" }
}


export async function newTradingPlansAction(prevState: State, formData: FormData) {

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
  const user = await verifyAction();

  if ("message" in user) return { message: user.message };

  const isAdmin = await isUserAdmin(user.id);

  if (!isAdmin) {
    return { message: "You are not an admin" };
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

  const user = await verifyAction();

  if ("message" in user) {
    return { "message": user.message };
  }

  const isAdmin = await isUserAdmin(user.id);

  if (!isAdmin) {
    return { "message": "You are not an admin." };
  }

  try {
    await deleteTradingPlan({ tradingPlanId: id });
  } catch {
    return { message: "An error occured" };
  }

  revalidatePath("/settings");
  redirect("/settings");
}



export async function updateEdittedTradingPlanAction(tradingPlanId: string, formData: FormData) {

  const user = await verifyAction();

  if ("message" in user) {
    return { "message": user.message };
  }

  const isAdmin = await isUserAdmin(user.id);

  if (!isAdmin) {
    return { message: "You are not an admin" };
  }

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
      message: "Check your values",
    }
  }

  try {
    const { tradingPlan, edittedStrategies, newStrategies } = validatedValues.data;

    await updateEdittedTradingPlans({ 
      tp: {
        tradingPlanId, tradingPlan
      },
      editted: edittedStrategies,
      newStrats: (newStrategies && newStrategies.length > 0) ? newStrategies : undefined,
    })
  } catch (error) {
    console.log(error)
    return { message: "An error occured" }
  }

  revalidatePath("/settings");
  redirect("/settings");
}

export async function createNoteAction(tradeId: string) {

  const user = await verifyAction();

  if ("message" in user) {
    return { message: user.message };
  }

  const isAdmin = await isUserAdmin(user.id);

  if (!isAdmin) {
    return { message: "You are not an admin" }
  }

  try {
    await createNote(tradeId);
  } catch {
    return { "message": "An error occurred." }
  }

  revalidatePath("/trades");
}

export async function updateNoteAction(
  noteId: string, tradeId: string, formData: FormData
) {

  const user = await verifyAction();

  if ("message" in user) {
    return { message: user.message };
  }

  const isAdmin = await isUserAdmin(user.id);

  if (!isAdmin) {
    return { message: "You are not an admin" }
  }

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


export async function uploadAvatarAction(prevState: State, formData: FormData) {
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

  if (!avatar) {
    return { message: "No file to upload" }
  }

  const supabase = await createClient();

  const filePath = genPathName("avatar", user.id, avatar);

  /* Upsert is set to true, to replace the photo if it exists */ 
  const { error } = await supabase.storage.from('avatars').upload(filePath, avatar, { upsert: true });

  if (error) {
    console.log(error);
    return { message: "Encountered an error while uploading." };
  }

  /* Save the url in the users table */
  try {
    await updateAvatarURL(filePath, user.id);
  } catch(error) {
    console.log(error);
    return { message: "Encountered an error." }
  }

  revalidatePath("/(dashboard)", 'layout');
  revalidatePath("/settings");
}



export async function deleteScreenshotAction(screenshotId: string, screenshotPath: string) {
  const { user } = await verifyUser();
  const isAdmin = await isUserAdmin(user.id);

  if (!isAdmin){
    return;
  }

  if (!screenshotId) {
    return;
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.storage.from('screenshots').remove([screenshotPath]);

    if (error) {
      return;
    }

    await deleteScreenshot(screenshotId);
  } catch {
    return;
  }

  revalidatePath("/trades");
}


export async function insertPhaseAction(formData: FormData) {
  const { user } = await verifyUser();
  const isAdmin = await isUserAdmin(user.id);

  if (!isAdmin) {
    return {
      message: "You are not an admin."
    };
  }

  const data = formData.get('added-phases');

  if (data === 'undefined') return { message: "Submitted nothing" }; 

  const validatedValues = PhasesSchema.safeParse({
    addedPhases: JSON.parse(data),
  })

  if (!validatedValues.success) {
    return {
      errors: validatedValues.error.flatten().fieldErrors,
      message: "Check your values"
    }
  }
  
  try {
    await insertPhases(validatedValues.data.addedPhases);
  } catch(error) {
    console.log(error);
    return { message: "An error occured" };
  }

  revalidatePath("/settings");
  return { message: "All Good" }
}



export async function insertPhaseToTradeAction(tradeId: string, formData: FormData) {
  const { user } = await verifyUser();
  const isAdmin = await isUserAdmin(user.id);

  if (!isAdmin) return { message: "You are not an admin." };
  
  const validatedValues = PhaseSchema.safeParse({
    selectedPhaseId: formData.get('selected-phase-id')
  })

  if (!validatedValues.success) {
    return {
      errors: validatedValues.error.flatten().fieldErrors,
      message: "Check your values"
    }
  }

  try {
    await insertPhaseToTrade(tradeId, validatedValues.data.selectedPhaseId);
  } catch (error) {
    console.log(error);
    return { message: "An error occured!" }
  }
}



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
  redirect("/settings");
}

