import { z } from "zod";
import { messages } from "@/config/messages";

export const languageFormSchema = z.object({
  // id: z.string().optional(),
  language: z.number().min(1, { message: messages.thisFieldIsRequired }),
  proficiency: z.string().min(1, { message: messages.thisFieldIsRequired }),
 
});

// generate form types from zod validation schema
export type LanguageFormInput = z.infer<typeof languageFormSchema>;
