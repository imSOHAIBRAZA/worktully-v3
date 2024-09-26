import { z } from "zod";
import { messages } from "@/config/messages";

export const portfolioFormSchema = z.object({
  project_title: z.string().min(1, { message: messages.thisFieldIsRequired }),
  description: z.string().min(1, { message: messages.thisFieldIsRequired }),
  url:z.string().min(1, { message: messages.thisFieldIsRequired }),
  // image_url:z.object({
  //     url: z.any().refine(value => value !== undefined && value !== null, {
  //     message: messages.thisFieldIsRequired,
  //   }),
  // })
});

// generate form types from zod validation schema
export type PortfolioFormInput = z.infer<typeof portfolioFormSchema>;
