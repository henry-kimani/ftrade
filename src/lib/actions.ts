'use server';

import { CreateUserSchema, LoginSchema, State, UpdateTradeStrategiesSchema, UpdateUserRoleSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAllowedUser, getUserRole, isUserAdmin, updateUserRole, updateTradeStrategies } from "@/db/queries";
import { verifyAction } from "./dal";
import { UpdateTradeStrategies } from "./definitions";



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
    console.error("Error", signInError);
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
    return user;
  } 

  const isAdmin = isUserAdmin(user.id);

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
    await updateTradeStrategies({ tradeId, newStrategies });
  } catch(error) {
    console.error("Database Error: ", error);
    return { message: "Database Error" };
  }

  revalidatePath("/trades");
  return { message: "Success!" }
}
