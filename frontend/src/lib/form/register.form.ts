import { z } from "zod";

export const RegisterFormSchema = z
  .object({
    username: z
      .string()
      .min(3, {
        message: "Le nom d'utilisateur doit contenir au moins 3 caractères",
      }),
    email: z.string().email({ message: "Merci de rentrer un email valide" }),
    password: z
      .string()
      .min(8, {
        message: "Le mot de passe doit contenir au moins 8 caractères",
      }),
    confirmPassword: z
      .string()
      .min(8, {
        message: "Le mot de passe doit contenir au moins 8 caractères",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });
