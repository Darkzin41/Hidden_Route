import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./pool.js";
import { runMigrations } from "./migration-runner.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const migrationsDirectory = path.resolve(
  currentDirectory,
  "../../../../database/migrations",
);

try {
  const migrations = await runMigrations(pool, migrationsDirectory);
  console.log(`Migrations verificadas: ${migrations.join(", ")}`);
} finally {
  await pool.end();
}
