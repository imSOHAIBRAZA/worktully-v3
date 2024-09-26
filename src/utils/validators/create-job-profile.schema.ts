import { z } from "zod";
import { messages } from "@/config/messages";

export const jobProfileFormSchema = z.object({
  // id: z.string().optional(),
  job_title: z.number().min(1, { message: messages.thisFieldIsRequired }),
  hourly_rate: z.string().min(1, { message: messages.thisFieldIsRequired }),
  // descipline: z.string().min(1, { message: "Discipline is required" })
});

// generate form types from zod validation schema
export type JobProfileFormInput = z.infer<typeof jobProfileFormSchema>;
