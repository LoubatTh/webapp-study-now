import { z } from "zod";

export const formSchema = z.object({
  question: z
    .string()
    .min(1, {
      message: "This field is required.",
    })
    .max(100, {
      message: "This field must be at most 100 characters",
    }),
  answer: z
    .string()
    .min(1, {
      message: "This field is required.",
    })
    .max(100, {
      message: "This field must be at most 100 characters",
    }),
});
