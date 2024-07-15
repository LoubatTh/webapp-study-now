import { z } from "zod";

export const OrganizationFormSchema = z.object({
    name: z.string().min(3, { message: "Le nom doit contenir au moins 3 caractères" }),
    description: z.string().min(10, { message: "La description doit contenir au moins 10 caractères" }).optional(),
    });
