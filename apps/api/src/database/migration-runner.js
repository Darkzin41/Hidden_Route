import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export async function discoverMigrations(directory) {
  const names = (await readdir(directory))
    .filter((name) => /^\d+_.+\.sql$/.test(name))
    .sort();
  return Promise.all(
    names.map(async (name) => ({
      name,
      sql: await readFile(path.join(directory, name), "utf8"),
    })),
  );
}

export async function runMigrations(databasePool, directory) {
  await databasePool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  const [appliedRows] = await databasePool.query(
    "SELECT name FROM schema_migrations",
  );
  const applied = new Set(appliedRows.map((row) => row.name));
  const migrations = await discoverMigrations(directory);

  for (const migration of migrations) {
    if (applied.has(migration.name)) continue;
    const connection = await databasePool.getConnection();
    try {
      await connection.beginTransaction();
      const statements = migration.sql
        .split(/;\s*(?:\r?\n|$)/)
        .map((statement) => statement.trim())
        .filter(Boolean);
      for (const statement of statements) await connection.query(statement);
      await connection.query(
        "INSERT INTO schema_migrations (name) VALUES (?)",
        [migration.name],
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  return migrations.map((migration) => migration.name);
}
