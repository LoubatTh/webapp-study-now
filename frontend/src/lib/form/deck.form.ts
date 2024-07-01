import { z } from "zod";

export const formSchema = z
  .object({
    question: z.string().min(1, {
      message: "This field is required.",
    }),
    answer1: z.string().min(1, {
      message: "This field is required.",
    }),
    isValidAnswer1: z.boolean(),
    answer2: z.string().min(1, {
      message: "This field is required.",
    }),
    isValidAnswer2: z.boolean(),
    answer3: z.string().min(1, {
      message: "This field is required.",
    }),
    isValidAnswer3: z.boolean(),
    answer4: z.string().min(1, {
      message: "This field is required.",
    }),
    isValidAnswer4: z.boolean(),
  })
  .refine(
    (data) =>
      data.isValidAnswer1 ||
      data.isValidAnswer2 ||
      data.isValidAnswer3 ||
      data.isValidAnswer4,
    {
      message: "At least one answer must be marked as correct.",
      path: ["isValidAnswer1"],
    }
  );

export const qcmSchema = z.object({
  name: z.string().min(1, {
    message: "This field is required.",
  }),
});
