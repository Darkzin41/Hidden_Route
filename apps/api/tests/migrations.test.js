import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { discoverMigrations } from "../src/database/migration-runner.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const migrationsDirectory = path.resolve(
  currentDirectory,
  "../../../database/migrations",
);

describe("migrations do banco", () => {
  it("descobre migrations SQL em ordem estável", async () => {
    const migrations = await discoverMigrations(migrationsDirectory);

    expect(migrations.map((migration) => migration.name)).toEqual([
      "001_initial_schema.sql",
    ]);
  });

  it("define todas as entidades e a tabela de controle", async () => {
    const [migration] = await discoverMigrations(migrationsDirectory);

    expect(migration.sql).toContain(
      "CREATE TABLE IF NOT EXISTS schema_migrations",
    );
    expect(migration.sql).toContain("CREATE TABLE IF NOT EXISTS admins");
    expect(migration.sql).toContain("CREATE TABLE IF NOT EXISTS beaches");
    expect(migration.sql).toContain("CREATE TABLE IF NOT EXISTS beach_images");
    expect(migration.sql).toContain("CREATE TABLE IF NOT EXISTS partners");
    expect(migration.sql).toContain("CREATE TABLE IF NOT EXISTS reviews");
    expect(migration.sql).toContain(
      "CREATE TABLE IF NOT EXISTS contact_messages",
    );
  });
});
