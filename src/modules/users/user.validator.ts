import { z } from "zod";

export const userSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 chars"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 chars"),
    deletedAt: z.date().nullable().default(null),
});
export type UserSchema = z.infer<typeof userSchema>;

export const createUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 chars"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 chars"),
});

export const loginSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 chars"),
});