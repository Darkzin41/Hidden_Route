import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { afterEach, describe, expect, it } from "vitest";
import {
  processImage,
  validateImageFile,
} from "../src/modules/uploads/upload-service.js";

const directories = [];

afterEach(async () => {
  await Promise.all(
    directories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe("uploads de imagem", () => {
  it("aceita somente JPEG, PNG e WebP", () => {
    expect(() => validateImageFile({ mimetype: "image/jpeg" })).not.toThrow();
    expect(() => validateImageFile({ mimetype: "image/png" })).not.toThrow();
    expect(() => validateImageFile({ mimetype: "image/webp" })).not.toThrow();
    expect(() => validateImageFile({ mimetype: "image/gif" })).toThrow(
      "Use uma imagem JPEG, PNG ou WebP.",
    );
  });

  it("converte imagem válida para WebP limitado a 1920 pixels", async () => {
    const directory = await mkdtemp(
      path.join(os.tmpdir(), "hidden-route-upload-"),
    );
    directories.push(directory);
    const buffer = await sharp({
      create: { width: 2400, height: 1200, channels: 3, background: "#0b3542" },
    })
      .jpeg()
      .toBuffer();

    const result = await processImage(
      { buffer, originalname: "praia.jpg" },
      directory,
    );
    const saved = await readFile(
      path.join(directory, path.basename(result.path)),
    );
    const metadata = await sharp(saved).metadata();

    expect(result.path).toMatch(/^\/uploads\/[a-f0-9-]+\.webp$/);
    expect(metadata.format).toBe("webp");
    expect(metadata.width).toBe(1920);
  });
});
