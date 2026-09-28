import { expect, test } from "@playwright/test";

test("admin autentica, modera conteúdo e encerra a sessão", async ({
  page,
  request,
  isMobile,
}) => {
  test.skip(
    isMobile,
    "Fluxo administrativo completo validado no projeto desktop.",
  );
  const unique = Date.now();
  const authorName = `Moderação ${unique}`;
  const senderName = `Contato ${unique}`;

  const beachResponse = await request.get("/api/beaches/ponta-verde");
  const beach = (await beachResponse.json()).data;
  await request.post(`/api/beaches/${beach.id}/reviews`, {
    data: {
      authorName,
      rating: 4,
      comment: "Relato criado para validar a fila de moderação administrativa.",
    },
  });
  await request.post("/api/contact", {
    data: {
      name: senderName,
      email: `contato-${unique}@example.com`,
      message: "Mensagem criada para validar a caixa de entrada do painel.",
    },
  });

  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
  await page
    .getByLabel("E-mail")
    .fill(process.env.ADMIN_EMAIL || "admin@hiddenroute.local");
  await page
    .getByLabel("Senha")
    .fill(process.env.ADMIN_PASSWORD || "hidden-route-local-admin");
  await page.getByRole("button", { name: "Entrar no painel" }).click();
  await expect(
    page.getByRole("heading", { name: "Visão geral" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Avaliações", exact: true }).click();
  const reviewCard = page
    .locator(".moderation-card")
    .filter({ hasText: authorName });
  await expect(reviewCard).toBeVisible();
  await reviewCard.getByRole("button", { name: "Aprovar" }).click();
  await expect(reviewCard).toHaveCount(0);

  await page.getByRole("link", { name: "Mensagens", exact: true }).click();
  const messageCard = page
    .locator(".message-card")
    .filter({ hasText: senderName });
  await expect(messageCard).toBeVisible();
  await messageCard.getByRole("button", { name: "Marcar como lida" }).click();
  await expect(messageCard).toHaveCount(0);

  await page.getByRole("button", { name: "Sair do painel" }).click();
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.goto("/admin/praias");
  await expect(page).toHaveURL(/\/admin\/login/);
});
