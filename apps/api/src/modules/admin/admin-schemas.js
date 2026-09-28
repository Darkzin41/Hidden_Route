import { z } from "zod";

const statusSchema = z.enum(["draft", "published", "archived"]);
const httpUrlSchema = z
  .string()
  .trim()
  .max(500)
  .url()
  .refine((value) => ["http:", "https:"].includes(new URL(value).protocol), {
    message: "Use um endereço HTTP ou HTTPS.",
  });

export const beachCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(140),
  location: z.string().trim().min(2).max(180),
  summary: z.string().trim().min(15).max(300),
  description: z.string().trim().min(20).max(5000),
  heroImage: z.string().trim().max(500).nullable().optional(),
  mapUrl: httpUrlSchema.nullable().optional(),
  status: statusSchema.default("draft"),
  featured: z.boolean().default(false),
});

export const beachUpdateSchema = beachCreateSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0);

export const partnerCreateSchema = z.object({
  beachId: z.coerce.number().int().positive(),
  name: z.string().trim().min(2).max(140),
  category: z.enum(["restaurant", "inn", "kiosk", "tour", "other"]),
  description: z.string().trim().min(15).max(3000),
  image: z.string().trim().max(500).nullable().optional(),
  address: z.string().trim().max(250).nullable().optional(),
  phone: z.string().trim().max(40).nullable().optional(),
  whatsappUrl: httpUrlSchema.nullable().optional(),
  instagramUrl: httpUrlSchema.nullable().optional(),
  websiteUrl: httpUrlSchema.nullable().optional(),
  mapUrl: httpUrlSchema.nullable().optional(),
  status: statusSchema.default("draft"),
});

export const partnerUpdateSchema = partnerCreateSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0);
export const reviewStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
});
export const messageStatusSchema = z.object({
  status: z.enum(["new", "read", "archived"]),
});
