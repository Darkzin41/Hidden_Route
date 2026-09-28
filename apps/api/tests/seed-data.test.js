import { describe, expect, it } from "vitest";
import { buildSeedData } from "../src/database/seed-data.js";

describe("dados iniciais", () => {
  it("publica somente Ponta Verde e mantém praias incompletas em rascunho", () => {
    const seed = buildSeedData();

    expect(seed.beaches.map(({ slug, status }) => ({ slug, status }))).toEqual([
      { slug: "ponta-verde", status: "published" },
      { slug: "jucatuba", status: "draft" },
      { slug: "unicamping", status: "draft" },
    ]);
  });

  it("vincula os dois parceiros existentes à Ponta Verde sem inventar contatos", () => {
    const seed = buildSeedData();

    expect(seed.partners).toHaveLength(2);
    expect(
      seed.partners.every((partner) => partner.beachSlug === "ponta-verde"),
    ).toBe(true);
    expect(seed.partners.every((partner) => partner.whatsappUrl === null)).toBe(
      true,
    );
  });
});
