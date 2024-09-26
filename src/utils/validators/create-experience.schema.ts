import { z } from "zod";
import { messages } from "@/config/messages";

export const experienceFormSchema = z.object({
  // id: z.string().optional(),
  company_name: z.string().min(1, { message: messages.thisFieldIsRequired }),
  description: z.string().min(1, { message: messages.thisFieldIsRequired })
  .max(45, { message: "Description cannot exceed 45 characters" }),
  currently_working: z.boolean().optional(),
  country: z.number().optional(),
  city: z.number().optional(),
  start_date: z.date({required_error: messages.startDateIsRequired, }),
  end_date: z.date().optional(),
});


// generate form types from zod validation schema
export type ExperienceFormInput = z.infer<typeof experienceFormSchema>;

