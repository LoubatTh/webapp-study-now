import { z } from "zod";

export const addUsersSchema = z.object({
    email: z.string().email(),
});