import path from "node:path";
import { fileURLToPath } from "node:url";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { asyncHandler } from "./lib/async-handler.js";
import { errorHandler, notFoundHandler } from "./lib/errors.js";
import { createAdminRouter } from "./modules/admin/admin-routes.js";
import {
  createAuthRouter,
  createRequireAdmin,
} from "./modules/auth/auth-routes.js";
import { createTokenService } from "./modules/auth/token-service.js";
import { createCatalogRouter } from "./modules/catalog/catalog-routes.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const uploadsDirectory = path.resolve(currentDirectory, "../uploads");

export function createHttpLogger(destination) {
  return pinoHttp(
    {
      redact: [
        "req.headers.cookie",
        "req.headers.authorization",
        'res.headers["set-cookie"]',
      ],
    },
    destination,
  );
}

export function createApp(dependencies) {
  const app = express();
  const healthCheck = dependencies.healthCheck || (() => Promise.resolve());
  const tokenService =
    dependencies.tokenService || createTokenService(process.env.JWT_SECRET);
  const requireAdmin = createRequireAdmin(tokenService);

  app.disable("x-powered-by");
  app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));
  if (dependencies.logger !== false && process.env.NODE_ENV !== "test") {
    app.use(createHttpLogger());
  }
  app.use(express.json({ limit: "256kb" }));
  app.use(cookieParser());
  app.use(
    "/uploads",
    express.static(uploadsDirectory, { maxAge: "7d", immutable: true }),
  );

  app.get(
    "/api/health",
    asyncHandler(async (_req, res) => {
      await healthCheck();
      res.json({ data: { status: "ok" } });
    }),
  );
  app.use("/api", createCatalogRouter(dependencies.catalogRepository));
  app.use("/api/auth", createAuthRouter({ ...dependencies, tokenService }));
  app.use("/api/admin", createAdminRouter({ ...dependencies, requireAdmin }));

  if (dependencies.webDistDirectory) {
    app.use(express.static(dependencies.webDistDirectory, { maxAge: "1h" }));
    app.use((req, res, next) => {
      if (
        req.method === "GET" &&
        !req.path.startsWith("/api") &&
        !req.path.startsWith("/uploads")
      ) {
        return res.sendFile(
          path.join(dependencies.webDistDirectory, "index.html"),
        );
      }
      return next();
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
