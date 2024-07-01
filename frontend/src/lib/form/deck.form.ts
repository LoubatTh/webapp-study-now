import { z } from "zod";

export const formSchema = z.object({
  question: z.string().min(1, {
    message: "This field is required.",
  }),
  answer: z.string().min(1, {
    message: "This field is required.",
  }),
});
