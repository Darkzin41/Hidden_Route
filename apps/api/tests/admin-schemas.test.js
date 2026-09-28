import { describe, expect, it } from "vitest";
import {
  beachCreateSchema,
  partnerCreateSchema,
} from "../src/modules/admin/admin-schemas.js";

const beach = {
  name: "Praia Segura",
  slug: "praia-segura",
  location: "São Luís, MA",
  summary: "Resumo confirmado para publicação no catálogo.",
  description: "Descrição confirmada para publicação no catálogo local.",
};

const partner = {
  beachId: 1,
  name: "Parceiro Local",
  category: "restaurant",
  description: "Estabelecimento parceiro com informações confirmadas.",
};

describe("URLs administrativas", () => {
  it.each(["javascript:alert(1)", "data:text/html,conteudo"])(
    "rejeita protocolo ativo em link público: %s",
    (unsafeUrl) => {
      expect(
        beachCreateSchema.safeParse({ ...beach, mapUrl: unsafeUrl }).success,
      ).toBe(false);
      expect(
        partnerCreateSchema.safeParse({
          ...partner,
          websiteUrl: unsafeUrl,
        }).success,
      ).toBe(false);
    },
  );

  it("aceita links HTTP e HTTPS legítimos", () => {
    expect(
      beachCreateSchema.safeParse({
        ...beach,
        mapUrl: "https://maps.example.com/praia-segura",
      }).success,
    ).toBe(true);
    expect(
      partnerCreateSchema.safeParse({
        ...partner,
        websiteUrl: "http://example.com/parceiro",
      }).success,
    ).toBe(true);
  });
});
