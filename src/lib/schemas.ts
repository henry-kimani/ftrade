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

export const NewTradingPlansSchema = z.object({
  tradingPlan: z
    .string({ invalid_type_error: "Only characters are allowed"})
    .min(3, { message: "Should be at least 3 characters"}),
  strategies: z.array(
    z.string({ invalid_type_error: "Only characters are allowed" })
    .min(3, { message: "Should be at least 3 characters" }),
    { invalid_type_error: "Should be an array" }
  ).min(1, { message: "At least one strategy is required." })
});

export const EdittedTradingPlansSchema = z.object({
  tradingPlan: z.string().min(3, { message: "Required at least three characters." }),
  edittedStrategies: z.array(
    z.object({
      strategyId: z.string().uuid({ message: "Wrong editted strategy Id" }),
      strategy: z.string().min(3, { message: "Required at least three characters." })
    })
  ),
  newStrategies: z.array(
    z.string().min(3, { message: "Required at least three characters." })
  ).nullish()
});

export const UpdatedNoteSchema = z.object({
  note: z.string({ invalid_type_error: "Should include only characters." })
});
