import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";
import { asyncHandler } from "../../lib/async-handler.js";
import { AppError } from "../../lib/errors.js";
import { SESSION_COOKIE } from "./token-service.js";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .max(180)
    .transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(200),
});

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    maxAge: 8 * 60 * 60 * 1000,
    path: "/",
  };
}

export function createRequireAdmin(tokenService) {
  return function requireAdmin(req, _res, next) {
    const token = req.cookies?.[SESSION_COOKIE];
    if (!token)
      return next(
        new AppError(
          401,
          "UNAUTHORIZED",
          "Autenticação administrativa necessária.",
        ),
      );

    try {
      req.admin = tokenService.verify(token);
      return next();
    } catch {
      return next(
        new AppError(
          401,
          "SESSION_EXPIRED",
          "Sua sessão expirou. Entre novamente.",
        ),
      );
    }
  };
}

export function createAuthRouter({
  authRepository,
  passwordService,
  tokenService,
}) {
  const router = Router();
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) =>
      next(
        new AppError(
          429,
          "RATE_LIMITED",
          "Muitas tentativas de acesso. Aguarde alguns minutos.",
        ),
      ),
  });
  const sessionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) =>
      next(
        new AppError(
          429,
          "RATE_LIMITED",
          "Muitas consultas de sessão. Aguarde alguns minutos.",
        ),
      ),
  });

  router.post(
    "/login",
    loginLimiter,
    asyncHandler(async (req, res) => {
      const credentials = loginSchema.parse(req.body);
      const admin = await authRepository.findAdminByEmail(credentials.email);
      const valid =
        admin &&
        (await passwordService.compare(
          credentials.password,
          admin.passwordHash,
        ));

      if (!valid) {
        throw new AppError(
          401,
          "INVALID_CREDENTIALS",
          "E-mail ou senha inválidos.",
        );
      }

      const token = tokenService.sign(admin);
      res.cookie(SESSION_COOKIE, token, cookieOptions());
      res.json({
        data: { id: admin.id, name: admin.name, email: admin.email },
      });
    }),
  );

  router.get(
    "/me",
    sessionLimiter,
    createRequireAdmin(tokenService),
    (req, res) => {
      res.json({
        data: {
          id: Number(req.admin.sub),
          name: req.admin.name,
          email: req.admin.email,
        },
      });
    },
  );

  router.post("/logout", (_req, res) => {
    res.clearCookie(SESSION_COOKIE, {
      ...cookieOptions(),
      maxAge: undefined,
    });
    res.json({ data: { signedOut: true } });
  });

  return router;
}
