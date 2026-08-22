import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(72),
  firstName: z.string().trim().min(1).max(50),
  lastName: z.string().trim().min(1).max(50),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});