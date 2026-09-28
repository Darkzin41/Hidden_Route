import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

const directories = [];

afterEach(async () => {
  await Promise.all(
    directories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe("entrega da SPA compilada", () => {
  it("retorna index.html ao atualizar uma rota pública", async () => {
    const directory = await mkdtemp(
      path.join(os.tmpdir(), "hidden-route-spa-"),
    );
    directories.push(directory);
    await writeFile(
      path.join(directory, "index.html"),
      "<!doctype html><title>Hidden Route</title>",
    );
    const noOpRepository = new Proxy({}, { get: () => async () => null });
    const app = createApp({
      catalogRepository: noOpRepository,
      authRepository: noOpRepository,
      adminRepository: noOpRepository,
      passwordService: { compare: async () => false },
      uploadService: {
        middleware: (_req, _res, next) => next(),
        process: async () => null,
      },
      webDistDirectory: directory,
      logger: false,
    });

    const response = await request(app).get("/praias/ponta-verde");

    expect(response.status).toBe(200);
    expect(response.text).toContain("<title>Hidden Route</title>");
  });
});
