import mysql from "mysql2/promise";
import { env } from "../config/env.js";

export function createPool(overrides = {}) {
  return mysql.createPool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: "utf8mb4",
    ...overrides,
  });
}

export const pool = createPool();
