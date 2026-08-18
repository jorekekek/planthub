import { z } from "zod";

export const createPlantSchema = z.object({
  userId: z.number().int().positive(),
  name: z.string().trim().min(1, "Plant name is required"),
  species: z.string().trim().optional(),
  description: z.string().trim().optional(),
  location: z.string().trim().optional(),
  sunlight: z.string().trim().optional(),
  wateringFrequency: z.number().int().positive().optional(),
  imageUrl: z.string().url().optional(),
});
export const updatePlantSchema = z.object({
  name: z.string().trim().min(1).optional(),
  species: z.string().trim().optional(),
  description: z.string().trim().optional(),
  location: z.string().trim().optional(),
  sunlight: z.string().trim().optional(),
  wateringFrequency: z.number().int().positive().optional(),
  imageUrl: z.string().url().optional(),
});