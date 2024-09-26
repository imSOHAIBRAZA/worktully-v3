import { z } from "zod";
import { messages } from "@/config/messages";

export const educationFormSchema = z.object({
  // id: z.string().optional(),
  institute_name: z.string().min(1, { message: messages.thisFieldIsRequired }),
  degree_type: z.number().min(1, { message: messages.thisFieldIsRequired }),
  discipline: z.string().min(1, { message: messages.thisFieldIsRequired }),
  from_date: z.date({
    required_error: messages.startDateIsRequired,
  }),
  to_date: z.date({
    required_error: messages.endDateIsRequired,
  }),
});

// generate form types from zod validation schema
export type EducationFormInput = z.infer<typeof educationFormSchema>;

