import { z } from "zod";

export const EditFormSchema = z.object({
    username: z
        .string()
        .min(3, {
        message: "Le nom d'utilisateur doit contenir au moins 3 caractères",
        }),
    oldPassword: z
        .string()
        .min(8, {
        message: "Le mot de passe doit contenir au moins 8 caractères",
        }),
    newPassword: z
        .string()
        .min(8, {
        message: "Le mot de passe doit contenir au moins 8 caractères",
        }),
    });