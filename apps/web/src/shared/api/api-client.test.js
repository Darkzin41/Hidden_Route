import { describe, expect, it, vi } from "vitest";
import { createApiClient } from "./api-client.js";

describe("cliente HTTP", () => {
  it("envia JSON com cookies e retorna o conteúdo do envelope", async () => {
    const fetchImplementation = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ data: { id: 4, status: "new" } }),
    });
    const client = createApiClient(fetchImplementation);

    const data = await client.post("/api/contact", { name: "Ana" });

    expect(data).toEqual({ id: 4, status: "new" });
    expect(fetchImplementation).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ name: "Ana" }),
      }),
    );
  });

  it("transforma envelope de erro em erro de aplicação", async () => {
    const client = createApiClient(async () => ({
      ok: false,
      status: 422,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        error: {
          code: "VALIDATION_ERROR",
          message: "Revise os campos.",
          fields: { email: ["Inválido"] },
        },
      }),
    }));

    await expect(client.post("/api/contact", {})).rejects.toMatchObject({
      status: 422,
      code: "VALIDATION_ERROR",
      fields: { email: ["Inválido"] },
    });
  });
});
