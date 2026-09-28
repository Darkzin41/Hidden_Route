import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { AppError } from "../../lib/errors.js";
import {
  beachCreateSchema,
  beachUpdateSchema,
  messageStatusSchema,
  partnerCreateSchema,
  partnerUpdateSchema,
  reviewStatusSchema,
} from "./admin-schemas.js";

function parseId(value) {
  const id = Number.parseInt(value, 10);
  if (!Number.isInteger(id) || id < 1)
    throw new AppError(422, "VALIDATION_ERROR", "Identificador inválido.");
  return id;
}

function listOptions(query) {
  return {
    status: typeof query.status === "string" ? query.status : undefined,
    search:
      typeof query.search === "string" ? query.search.trim().slice(0, 100) : "",
    page: Math.max(1, Number.parseInt(query.page || "1", 10) || 1),
    limit: Math.min(
      100,
      Math.max(1, Number.parseInt(query.limit || "20", 10) || 20),
    ),
  };
}

export function createAdminRouter({
  adminRepository,
  uploadService,
  requireAdmin,
}) {
  const router = Router();
  router.use(requireAdmin);

  router.get(
    "/summary",
    asyncHandler(async (_req, res) =>
      res.json({ data: await adminRepository.getSummary() }),
    ),
  );

  router.get(
    "/beaches",
    asyncHandler(async (req, res) =>
      res.json({
        data: await adminRepository.listBeaches(listOptions(req.query)),
      }),
    ),
  );
  router.post(
    "/beaches",
    asyncHandler(async (req, res) =>
      res.status(201).json({
        data: await adminRepository.createBeach(
          beachCreateSchema.parse(req.body),
        ),
      }),
    ),
  );
  router.patch(
    "/beaches/:id",
    asyncHandler(async (req, res) =>
      res.json({
        data: await adminRepository.updateBeach(
          parseId(req.params.id),
          beachUpdateSchema.parse(req.body),
        ),
      }),
    ),
  );
  router.delete(
    "/beaches/:id",
    asyncHandler(async (req, res) =>
      res.json({
        data: await adminRepository.archiveBeach(parseId(req.params.id)),
      }),
    ),
  );

  router.get(
    "/partners",
    asyncHandler(async (req, res) =>
      res.json({
        data: await adminRepository.listPartners(listOptions(req.query)),
      }),
    ),
  );
  router.post(
    "/partners",
    asyncHandler(async (req, res) =>
      res.status(201).json({
        data: await adminRepository.createPartner(
          partnerCreateSchema.parse(req.body),
        ),
      }),
    ),
  );
  router.patch(
    "/partners/:id",
    asyncHandler(async (req, res) =>
      res.json({
        data: await adminRepository.updatePartner(
          parseId(req.params.id),
          partnerUpdateSchema.parse(req.body),
        ),
      }),
    ),
  );
  router.delete(
    "/partners/:id",
    asyncHandler(async (req, res) =>
      res.json({
        data: await adminRepository.archivePartner(parseId(req.params.id)),
      }),
    ),
  );

  router.get(
    "/reviews",
    asyncHandler(async (req, res) =>
      res.json({
        data: await adminRepository.listReviews(listOptions(req.query)),
      }),
    ),
  );
  router.patch(
    "/reviews/:id/status",
    asyncHandler(async (req, res) =>
      res.json({
        data: await adminRepository.updateReviewStatus(
          parseId(req.params.id),
          reviewStatusSchema.parse(req.body).status,
        ),
      }),
    ),
  );

  router.get(
    "/messages",
    asyncHandler(async (req, res) =>
      res.json({
        data: await adminRepository.listMessages(listOptions(req.query)),
      }),
    ),
  );
  router.patch(
    "/messages/:id/status",
    asyncHandler(async (req, res) =>
      res.json({
        data: await adminRepository.updateMessageStatus(
          parseId(req.params.id),
          messageStatusSchema.parse(req.body).status,
        ),
      }),
    ),
  );

  router.post(
    "/uploads",
    uploadService.middleware,
    asyncHandler(async (req, res) => {
      if (!req.file)
        throw new AppError(422, "IMAGE_REQUIRED", "Selecione uma imagem.");
      const image = await uploadService.process(req.file);
      res.status(201).json({ data: image });
    }),
  );

  return router;
}
