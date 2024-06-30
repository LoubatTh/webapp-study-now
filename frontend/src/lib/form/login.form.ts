import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Merci de rentrer un email valide" }),
  password: z
    .string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
});