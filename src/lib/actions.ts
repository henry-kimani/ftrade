'use server';

import { CreateUserSchema, LoginSchema, State, UpdateUserRoleSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAllowedUser, getUserRole, isUserAdmin, updateUserRole } from "@/db/queries";



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
  console.log(shouldCreateUser);

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
    console.log(signInError);
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
  const { error, data: userData } = await supabase.auth.getUser();

  if (error || !userData.user) {
    return { message: "You are not a signed in user." };
  }

  const userId = userData.user.id;

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



