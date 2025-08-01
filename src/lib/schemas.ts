import { z } from "zod";
import { roles } from "@/db/schema";

const AVATAR_FILE_SIZE_LIMIT = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];

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

export const CreateNoteSchema = z.object({
  tradeId: z.string({ message: "A trade id is required." }).uuid()
});

export const UpdatedNoteSchema = z.object({
  note: z.string({ invalid_type_error: "Should include only characters." })
});

export const AvatarImageSchema = z.object({
  avatar: z
  .instanceof(File)
  .transform((file) => {
    /* Returning undefined if the file does not comply, allows us not throw an
     * error, plus the user profile will not be changed */
    if (ALLOWED_MIME_TYPES.includes(file.type)) {
      return file
    } else return undefined;
  })
  .refine(file => file && file.size < AVATAR_FILE_SIZE_LIMIT, {
    message: "File should be less than 5MB"
  })
});

export const ScreenshotImageSchema = z.object({
  screenshots: z.array(
    z.instanceof(File)
      .transform(file => {
        if (ALLOWED_MIME_TYPES.includes(file.type)) {
          return file;
        } else return undefined;

      })
      .refine(file => file && file.size < AVATAR_FILE_SIZE_LIMIT, {
        message: "Each file should be less than 5MB"
      })
  ),
  tradeId: z.string().uuid()
});

export const PhasesSchema = z.object({
  addedPhases: z.array(
    z.object({
      phase: z.string().min(3).max(10),
      phaseColor: z.string().regex(/^#[a-f0-9]{6}$/, { message: "Should be a hex color value" })
    })
  ).min(1, { message: "At least one phase is required."})
});

export const PhaseSchema = z.object({
  selectedPhaseId: z.string().uuid()
});
