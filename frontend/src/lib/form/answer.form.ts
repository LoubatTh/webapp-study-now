import { z } from "zod";

export const answerSchema = z.object({
  answers: z
    .array(
      z.object({
        answer: z.string(),
        isValid: z.boolean(),
      })
    )
    .min(1, { message: "Vous devez répondre à cette question" }),
});
