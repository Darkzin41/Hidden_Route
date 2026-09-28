import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import * as appModule from "../src/app.js";

describe("logs HTTP", () => {
  it("redige cookies de sessão enviados na resposta", async () => {
    expect(typeof appModule.createHttpLogger).toBe("function");

    const lines = [];
    const app = express();
    app.use(
      appModule.createHttpLogger({
        write(line) {
          lines.push(line);
        },
      }),
    );
    app.get("/session", (_req, res) => {
      res.cookie("session", "sensitive-session-token", { httpOnly: true });
      res.json({ data: { ok: true } });
    });

    const response = await request(app).get("/session");

    expect(response.status).toBe(200);
    expect(lines.join("\n")).not.toContain("sensitive-session-token");
    expect(lines.join("\n")).toContain("[Redacted]");
  });
});
