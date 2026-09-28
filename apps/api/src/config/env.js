import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { z } from "zod";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({
  path: path.resolve(currentDirectory, "../../../../.env"),
  quiet: true,
});

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  COOKIE_SECURE: z.enum(["true", "false"]).default("false"),
  PORT: z.coerce.number().int().positive().default(3000),
  WEB_ORIGIN: z.string().url().default("http://localhost:5173"),
  DB_HOST: z.string().min(1).default("127.0.0.1"),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_NAME: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/)
    .default("hidden_route"),
  DB_USER: z.string().min(1).default("hidden_route"),
  DB_PASSWORD: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  ADMIN_NAME: z.string().min(2).default("Administrador Hidden Route"),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(12),
});

export const env = envSchema.parse(process.env);
