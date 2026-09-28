import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createPool } from "../src/database/pool.js";
import { createAdminRepository } from "../src/modules/admin/admin-repository.js";
import { createAuthRepository } from "../src/modules/auth/auth-repository.js";
import { createCatalogRepository } from "../src/modules/catalog/catalog-repository.js";

describe("repositórios MySQL", () => {
  let databasePool;
  let connection;
  let catalog;
  let admin;
  let auth;

  beforeAll(async () => {
    databasePool = createPool({ connectionLimit: 2 });
    connection = await databasePool.getConnection();
    catalog = createCatalogRepository(connection);
    admin = createAdminRepository(connection);
    auth = createAuthRepository(connection);
  });

  beforeEach(async () => {
    await connection.rollback();
    await connection.beginTransaction();
  });

  afterAll(async () => {
    await connection.rollback();
    connection.release();
    await databasePool.end();
  });

  it("lista somente praias publicadas e mantém rascunhos fora do catálogo", async () => {
    const beaches = await catalog.listPublicBeaches({ search: "" });

    expect(beaches.map((beach) => beach.slug)).toEqual(["ponta-verde"]);
  });

  it("inclui apenas avaliações aprovadas no detalhe e na média", async () => {
    const [result] = await connection.execute(
      `INSERT INTO beaches (name, slug, location, summary, description, status, featured)
       VALUES (?, ?, ?, ?, ?, 'published', FALSE)`,
      [
        "Praia de Integração",
        "praia-integracao-avaliacoes",
        "São Luís, MA",
        "Registro temporário para validar avaliações.",
        "Registro criado dentro de uma transação e removido ao final do teste.",
      ],
    );
    const pending = await catalog.createReview({
      beachId: result.insertId,
      authorName: "Visitante Teste",
      rating: 5,
      comment: "Uma avaliação completa que começa como pendente.",
    });

    const beforeApproval = await catalog.getPublicBeachBySlug(
      "praia-integracao-avaliacoes",
    );
    expect(
      beforeApproval.reviews.some((review) => review.id === pending.id),
    ).toBe(false);

    await admin.updateReviewStatus(pending.id, "approved");
    const afterApproval = await catalog.getPublicBeachBySlug(
      "praia-integracao-avaliacoes",
    );
    expect(
      afterApproval.reviews.some((review) => review.id === pending.id),
    ).toBe(true);
    expect(afterApproval.ratingAverage).toBe(5);
  });

  it("persiste contato e o expõe na fila administrativa", async () => {
    const created = await catalog.createContact({
      name: "Contato Teste",
      email: "contato@example.com",
      message:
        "Mensagem de integração criada dentro de uma transação reversível.",
    });

    const messages = await admin.listMessages({
      status: "new",
      search: "Contato",
      page: 1,
      limit: 20,
    });
    expect(messages.items.some((message) => message.id === created.id)).toBe(
      true,
    );
  });

  it("encontra o administrador sem expor a senha nas listagens públicas", async () => {
    const administrator = await auth.findAdminByEmail(
      "admin@hiddenroute.local",
    );
    const beaches = await catalog.listPublicBeaches({ search: "" });

    expect(administrator.passwordHash).toMatch(/^\$2[aby]\$/);
    expect(JSON.stringify(beaches)).not.toContain("password");
  });
});
