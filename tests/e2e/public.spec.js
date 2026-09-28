import { expect, test } from "@playwright/test";

test("catálogo público, detalhe e navegação responsiva", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Há caminhos que o mapa/i }),
  ).toBeVisible();

  const navbar = page.locator(".site-navbar");
  if (isMobile) {
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await expect(page.getByTestId("mobile-navigation")).toBeVisible();
    await page
      .getByTestId("mobile-navigation")
      .getByRole("link", { name: "Praias", exact: true })
      .click();
  } else {
    await page
      .getByRole("navigation", { name: "Navegação principal" })
      .getByRole("link", { name: "Praias", exact: true })
      .click();
  }

  await expect(page).toHaveURL(/\/praias$/);
  await expect(
    page.getByRole("heading", { name: "Ponta Verde" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Juçatuba" })).toHaveCount(0);
  await page
    .getByPlaceholder("Buscar praia ou localidade")
    .fill("local inexistente");
  await expect(
    page.getByRole("heading", { name: "Nenhuma praia nesta busca" }),
  ).toBeVisible();

  await page.getByPlaceholder("Buscar praia ou localidade").fill("Ponta Verde");
  await page.getByRole("link", { name: "Conhecer Ponta Verde" }).click();
  await expect(page).toHaveURL(/\/praias\/ponta-verde$/);
  await expect(
    page.getByRole("heading", { name: "Ponta Verde", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Recanto da Júlia" }),
  ).toBeVisible();

  await expect
    .poll(async () =>
      page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    )
    .toBe(true);

  if (!isMobile) {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /Há caminhos que o mapa/i }),
    ).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect
      .poll(async () => navbar.getAttribute("data-visible"))
      .toBe("false");
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect
      .poll(async () => navbar.getAttribute("data-visible"))
      .toBe("true");
  }
});

test("contato e avaliação exibem confirmação", async ({ page }, testInfo) => {
  const unique = `${testInfo.project.name}-${Date.now()}`;
  await page.goto("/contato");
  await page.getByLabel("Nome").fill(`Visitante ${unique}`);
  await page.getByLabel("E-mail").fill(`visitante-${unique}@example.com`);
  await page
    .getByLabel("Mensagem")
    .fill("Tenho uma sugestão de rota para a equipe verificar com cuidado.");
  await page.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(
    page.getByText("Mensagem recebida. Obrigado por conversar com a gente."),
  ).toBeVisible();

  await page.goto("/praias/ponta-verde");
  await page.getByLabel("Seu nome").fill(`Avaliador ${unique}`);
  await page.getByRole("radio", { name: "5 estrelas", exact: true }).check();
  await page
    .getByLabel("Sua avaliação")
    .fill(
      "Uma visita tranquila, com paisagem bonita e acesso que merece planejamento.",
    );
  await page.getByRole("button", { name: "Enviar avaliação" }).click();
  await expect(
    page.getByText("Avaliação enviada para moderação."),
  ).toBeVisible();
});
