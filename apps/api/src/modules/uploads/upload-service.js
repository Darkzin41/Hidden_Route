import { mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import multer from "multer";
import sharp from "sharp";
import { AppError } from "../../lib/errors.js";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateImageFile(file) {
  if (!allowedMimeTypes.has(file.mimetype)) {
    throw new AppError(
      422,
      "INVALID_IMAGE_TYPE",
      "Use uma imagem JPEG, PNG ou WebP.",
    );
  }
}

export async function processImage(file, uploadsDirectory) {
  await mkdir(uploadsDirectory, { recursive: true });
  const filename = `${randomUUID()}.webp`;
  const destination = path.join(uploadsDirectory, filename);
  const pipeline = sharp(file.buffer)
    .rotate()
    .resize({
      width: 1920,
      height: 1920,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82, effort: 4 });
  const metadata = await pipeline.toFile(destination);
  return {
    path: `/uploads/${filename}`,
    width: metadata.width,
    height: metadata.height,
  };
}

export function createUploadService(uploadsDirectory) {
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter(_req, file, callback) {
      try {
        validateImageFile(file);
        callback(null, true);
      } catch (error) {
        callback(error);
      }
    },
  });

  return {
    middleware: upload.single("image"),
    process(file) {
      return processImage(file, uploadsDirectory);
    },
  };
}
