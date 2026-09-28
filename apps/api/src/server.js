import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./database/pool.js";
import { createAdminRepository } from "./modules/admin/admin-repository.js";
import { createAuthRepository } from "./modules/auth/auth-repository.js";
import { createCatalogRepository } from "./modules/catalog/catalog-repository.js";
import { createUploadService } from "./modules/uploads/upload-service.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const uploadsDirectory = path.resolve(currentDirectory, "../uploads");
const webDistDirectory = path.resolve(currentDirectory, "../dist/web");

const app = createApp({
  healthCheck: async () => {
    await pool.query("SELECT 1");
  },
  catalogRepository: createCatalogRepository(pool),
  authRepository: createAuthRepository(pool),
  adminRepository: createAdminRepository(pool),
  passwordService: { compare: bcrypt.compare },
  uploadService: createUploadService(uploadsDirectory),
  webDistDirectory:
    env.NODE_ENV === "production" ? webDistDirectory : undefined,
});

const server = app.listen(env.PORT, () => {
  console.log(`Hidden Route disponível em http://localhost:${env.PORT}`);
});

async function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
