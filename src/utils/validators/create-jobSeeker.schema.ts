import { z } from "zod";
import { messages } from "@/config/messages";
import { validateEmail } from "@/utils/validators/common-rules";

export const jobSeekerFormSchema = z.object({
  first_name: z.string().min(1, { message: messages.thisFieldIsRequired }),
  last_name: z.string().min(1, { message: messages.thisFieldIsRequired }),
  email: validateEmail,
  gender: z.string().optional(),
  phone: z.string().optional(),
  status: z.string().optional(),
  birth_date: z.string().optional(),
});

// generate form types from zod validation schema
export type JobSeekerFormInput = z.infer<typeof jobSeekerFormSchema>;
