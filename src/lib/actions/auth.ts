'use server';

import { State } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";
import { LoginSchema, CreateUserSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isUserAdmin, isAllowedUser } from "@/db/queries";
import { verifyUser } from "@/lib/dal";



export async function loginAction(prevState: State, formData: FormData) {
  const supabase = await createClient();

  const validatedValues = LoginSchema.safeParse({
    email: formData.get("email")
  });

  if (!validatedValues.success) {
    return { 
      errors: validatedValues.error.flatten().fieldErrors,
      message: "Check your values." 
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
  /* Check the current user is an admin */
  const { user } = await verifyUser();
  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) return { message: "You are not an admin." }


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

  const supabase = await createClient();

  try {
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

