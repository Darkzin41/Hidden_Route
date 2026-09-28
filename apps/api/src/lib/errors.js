import { ZodError } from "zod";
import multer from "multer";

export class AppError extends Error {
  constructor(status, code, message, fields) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export function notFoundHandler(_req, _res, next) {
  next(new AppError(404, "NOT_FOUND", "Recurso não encontrado."));
}

export function errorHandler(error, req, res, _next) {
  if (error instanceof multer.MulterError) {
    const isSizeError = error.code === "LIMIT_FILE_SIZE";
    return res.status(isSizeError ? 413 : 422).json({
      error: {
        code: isSizeError ? "IMAGE_TOO_LARGE" : "UPLOAD_ERROR",
        message: isSizeError
          ? "A imagem deve ter no máximo 5 MB."
          : "Não foi possível receber a imagem.",
      },
    });
  }

  if (error instanceof ZodError) {
    const fields = error.flatten().fieldErrors;
    return res.status(422).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Revise os campos informados.",
        fields,
      },
    });
  }

  if (error instanceof AppError) {
    const payload = { code: error.code, message: error.message };
    if (error.fields) payload.fields = error.fields;
    return res.status(error.status).json({ error: payload });
  }

  req.log?.error({ err: error }, "Unhandled request error");
  return res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Não foi possível concluir a solicitação.",
    },
  });
}
