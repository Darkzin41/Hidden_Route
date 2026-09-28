import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { asyncHandler } from "../../lib/async-handler.js";
import { AppError } from "../../lib/errors.js";
import { contactSchema, reviewSchema } from "./catalog-schemas.js";

export function createCatalogRouter(catalogRepository) {
  const router = Router();
  const formLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 40,
    standardHeaders: true,
    legacyHeaders: false,
  });

  router.get(
    "/beaches",
    asyncHandler(async (req, res) => {
      const search =
        typeof req.query.search === "string"
          ? req.query.search.trim().slice(0, 100)
          : "";
      const beaches = await catalogRepository.listPublicBeaches({ search });
      res.json({ data: beaches });
    }),
  );

  router.get(
    "/beaches/:slug",
    asyncHandler(async (req, res) => {
      const beach = await catalogRepository.getPublicBeachBySlug(
        req.params.slug,
      );
      if (!beach)
        throw new AppError(404, "BEACH_NOT_FOUND", "Praia não encontrada.");
      res.json({ data: beach });
    }),
  );

  router.post(
    "/beaches/:id/reviews",
    formLimiter,
    asyncHandler(async (req, res) => {
      const beachId = Number.parseInt(req.params.id, 10);
      if (!Number.isInteger(beachId) || beachId < 1) {
        throw new AppError(422, "VALIDATION_ERROR", "Praia inválida.", {
          beachId: ["Praia inválida."],
        });
      }
      const review = reviewSchema.parse(req.body);
      const created = await catalogRepository.createReview({
        beachId,
        ...review,
      });
      res.status(201).json({ data: created });
    }),
  );

  router.post(
    "/contact",
    formLimiter,
    asyncHandler(async (req, res) => {
      const contact = contactSchema.parse(req.body);
      const created = await catalogRepository.createContact(contact);
      res.status(201).json({ data: created });
    }),
  );

  return router;
}
