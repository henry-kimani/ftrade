import { z } from "zod";
import { roles } from "@/db/schema";

export type State = {
  errors?: {
    email?:  string; 
  },
  message?: string | null;
};

export const CreateUserSchema = z.object({
  email: z
    .string({ invalid_type_error: "Use only characters." })
    .email({ message: "This is not a valid email." }),
  role: z.enum(roles.enumValues, {
    message: "Accepted values are none, viewer or admin",
  }) 
});

export const LoginSchema = CreateUserSchema.omit({
  role: true
})

export const UpdateUserRoleSchema = CreateUserSchema.omit({
  email: true 
});

export const UpdateTradeStrategiesSchema = z.object({
  tradeStrategies: z.string({ 
    invalid_type_error: "Only characters are allowed.",
    message: "Invalid trade strategies"
  })
});
