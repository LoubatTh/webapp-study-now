import { z } from "zod";

export const RegisterFormSchema = z
  .object({
    username: z
      .string()
      .min(3, {
        message: "The username must be at least 3 characters long",
      })
      .max(25, {
        message: "The username must be at most 25 characters long",
      }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, {
      message: "The password must be at least 8 characters long",
    }),
    confirmPassword: z.string().min(8, {
      message: "The password must be at least 8 characters long",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The passwords do not match",
    path: ["confirmPassword"],
  });
