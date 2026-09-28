import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../src/app.js";

function createDependencies() {
  return {
    healthCheck: vi.fn().mockResolvedValue(undefined),
    catalogRepository: {
      listPublicBeaches: vi.fn().mockResolvedValue([
        {
          id: 1,
          slug: "ponta-verde",
          name: "Ponta Verde",
          location: "São José de Ribamar, MA",
          summary: "Um refúgio tranquilo perto de São Luís.",
          heroImage: "/images/ponta-verde-hero.webp",
          featured: true,
          ratingAverage: 4.8,
          reviewCount: 2,
        },
      ]),
      getPublicBeachBySlug: vi.fn().mockResolvedValue({
        id: 1,
        slug: "ponta-verde",
        name: "Ponta Verde",
        status: "published",
        images: [],
        partners: [],
        reviews: [],
      }),
      createReview: vi.fn().mockResolvedValue({ id: 9, status: "pending" }),
      createContact: vi.fn().mockResolvedValue({ id: 4, status: "new" }),
    },
    authRepository: {
      findAdminByEmail: vi.fn().mockResolvedValue({
        id: 1,
        name: "Administrador",
        email: "admin@hiddenroute.local",
        passwordHash: "hash",
      }),
    },
    adminRepository: {
      getSummary: vi.fn().mockResolvedValue({
        beaches: 3,
        partners: 2,
        pendingReviews: 1,
        newMessages: 1,
      }),
      listBeaches: vi.fn().mockResolvedValue([]),
      createBeach: vi
        .fn()
        .mockResolvedValue({ id: 2, slug: "nova-praia", status: "draft" }),
      updateBeach: vi.fn().mockResolvedValue({ id: 2, name: "Nova Praia" }),
      archiveBeach: vi.fn().mockResolvedValue({ id: 2, status: "archived" }),
      listPartners: vi.fn().mockResolvedValue([]),
      createPartner: vi.fn().mockResolvedValue({ id: 2, status: "draft" }),
      updatePartner: vi.fn().mockResolvedValue({ id: 2, name: "Quiosque" }),
      archivePartner: vi.fn().mockResolvedValue({ id: 2, status: "archived" }),
      listReviews: vi.fn().mockResolvedValue([]),
      updateReviewStatus: vi
        .fn()
        .mockResolvedValue({ id: 9, status: "approved" }),
      listMessages: vi.fn().mockResolvedValue([]),
      updateMessageStatus: vi.fn().mockResolvedValue({ id: 4, status: "read" }),
    },
    passwordService: {
      compare: vi.fn().mockResolvedValue(true),
    },
    uploadService: {
      middleware: (req, _res, next) => {
        req.file = {
          originalname: "praia.jpg",
          mimetype: "image/jpeg",
          buffer: Buffer.from("image"),
        };
        next();
      },
      process: vi.fn().mockResolvedValue({
        path: "/uploads/abc.webp",
        width: 1600,
        height: 900,
      }),
    },
  };
}

describe("API pública", () => {
  let dependencies;
  let app;

  beforeEach(() => {
    dependencies = createDependencies();
    app = createApp(dependencies);
  });

  it("retorna health check no envelope de dados", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: { status: "ok" } });
    expect(dependencies.healthCheck).toHaveBeenCalledOnce();
  });

  it("lista somente o catálogo público e encaminha a busca", async () => {
    const response = await request(app).get("/api/beaches?search=Ponta");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(
      dependencies.catalogRepository.listPublicBeaches,
    ).toHaveBeenCalledWith({ search: "Ponta" });
  });

  it("retorna detalhe público pelo slug", async () => {
    const response = await request(app).get("/api/beaches/ponta-verde");

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("Ponta Verde");
  });

  it("valida avaliação e cria como pendente", async () => {
    const response = await request(app).post("/api/beaches/1/reviews").send({
      authorName: "Maria",
      rating: 5,
      comment: "Lugar tranquilo e muito bonito.",
    });

    expect(response.status).toBe(201);
    expect(response.body.data.status).toBe("pending");
    expect(dependencies.catalogRepository.createReview).toHaveBeenCalledWith({
      beachId: 1,
      authorName: "Maria",
      rating: 5,
      comment: "Lugar tranquilo e muito bonito.",
    });
  });

  it("rejeita avaliação inválida usando o envelope de erro", async () => {
    const response = await request(app).post("/api/beaches/1/reviews").send({
      authorName: "",
      rating: 8,
      comment: "curto",
    });

    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.fields).toBeDefined();
  });

  it("persiste uma mensagem de contato válida", async () => {
    const response = await request(app).post("/api/contact").send({
      name: "Ana Costa",
      email: "ana@example.com",
      message: "Gostaria de sugerir uma nova praia para o catálogo.",
    });

    expect(response.status).toBe(201);
    expect(response.body.data.status).toBe("new");
  });
});

describe("autenticação e administração", () => {
  let dependencies;
  let app;

  beforeEach(() => {
    dependencies = createDependencies();
    app = createApp(dependencies);
  });

  it("protege rotas administrativas sem cookie", async () => {
    const response = await request(app).get("/api/admin/summary");

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });

  it("autentica administrador, cria cookie httpOnly e libera o painel", async () => {
    const agent = request.agent(app);
    const login = await agent.post("/api/auth/login").send({
      email: "admin@hiddenroute.local",
      password: "test-password",
    });

    expect(login.status).toBe(200);
    expect(login.headers["set-cookie"][0]).toContain("HttpOnly");

    const summary = await agent.get("/api/admin/summary");
    expect(summary.status).toBe(200);
    expect(summary.body.data.pendingReviews).toBe(1);
  });

  it("limita consultas repetidas à sessão administrativa", async () => {
    const agent = request.agent(app);
    await agent.post("/api/auth/login").send({
      email: "admin@hiddenroute.local",
      password: "test-password",
    });

    let response;
    for (let attempt = 0; attempt < 121; attempt += 1) {
      response = await agent.get("/api/auth/me");
    }

    expect(response.status).toBe(429);
    expect(response.body.error.code).toBe("RATE_LIMITED");
  });

  it("retorna credenciais inválidas sem revelar qual campo falhou", async () => {
    dependencies.passwordService.compare.mockResolvedValue(false);
    const response = await request(app).post("/api/auth/login").send({
      email: "admin@hiddenroute.local",
      password: "senha-incorreta",
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toEqual({
      code: "INVALID_CREDENTIALS",
      message: "E-mail ou senha inválidos.",
    });
  });

  it("permite criar, atualizar e arquivar uma praia autenticada", async () => {
    const agent = request.agent(app);
    await agent.post("/api/auth/login").send({
      email: "admin@hiddenroute.local",
      password: "test-password",
    });

    const create = await agent.post("/api/admin/beaches").send({
      name: "Nova Praia",
      slug: "nova-praia",
      location: "São Luís, MA",
      summary: "Conteúdo confirmado será publicado posteriormente.",
      description: "Registro criado como rascunho para edição administrativa.",
      status: "draft",
      featured: false,
    });
    const update = await agent
      .patch("/api/admin/beaches/2")
      .send({ name: "Nova Praia" });
    const archive = await agent.delete("/api/admin/beaches/2");

    expect(create.status).toBe(201);
    expect(update.status).toBe(200);
    expect(archive.body.data.status).toBe("archived");
  });

  it("modera avaliações e atualiza mensagens", async () => {
    const agent = request.agent(app);
    await agent.post("/api/auth/login").send({
      email: "admin@hiddenroute.local",
      password: "test-password",
    });

    const review = await agent
      .patch("/api/admin/reviews/9/status")
      .send({ status: "approved" });
    const message = await agent
      .patch("/api/admin/messages/4/status")
      .send({ status: "read" });

    expect(review.body.data.status).toBe("approved");
    expect(message.body.data.status).toBe("read");
  });

  it("processa upload autenticado e devolve o caminho público", async () => {
    const agent = request.agent(app);
    await agent.post("/api/auth/login").send({
      email: "admin@hiddenroute.local",
      password: "test-password",
    });

    const response = await agent
      .post("/api/admin/uploads")
      .attach("image", Buffer.from("image"), "praia.jpg");

    expect(response.status).toBe(201);
    expect(response.body.data.path).toBe("/uploads/abc.webp");
  });
});
