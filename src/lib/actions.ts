'use server';

import { CreateUserSchema, LoginSchema, State } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAllowedUser, getUserRole } from "@/db/queries";

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

  /* Signin the user */
  const { error: signInError } = await supabase.auth.signInWithOtp({
    email: validatedValues.data.email,
    options: {
      shouldCreateUser: false,
    }
  });

  if (signInError) {
    return { message: "Are sure you are a valid user?" };
  } else {
    return { message: `We sent an email at ${validatedValues.data.email}`};
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
