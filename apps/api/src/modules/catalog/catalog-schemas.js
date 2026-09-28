import { z } from "zod";

export const reviewSchema = z.object({
  authorName: z.string().trim().min(2).max(100),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(15).max(1200),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z
    .string()
    .trim()
    .email()
    .max(180)
    .transform((value) => value.toLowerCase()),
  message: z.string().trim().min(15).max(2000),
});
