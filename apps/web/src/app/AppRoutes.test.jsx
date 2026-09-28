import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AuthProvider } from "../features/auth/AuthProvider.jsx";
import { AppRoutes } from "./AppRoutes.jsx";

function renderPath(path) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const authClient = {
    get: async () => Promise.reject(new Error("anonymous")),
  };
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter
        initialEntries={[path]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AuthProvider client={authClient}>
          <AppRoutes />
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("rotas públicas", () => {
  it("renderiza a história do projeto", async () => {
    renderPath("/sobre");
    expect(
      await screen.findByRole("heading", { name: /rotas que começam/i }),
    ).toBeInTheDocument();
  });

  it("renderiza o canal de contato", async () => {
    renderPath("/contato");
    expect(
      await screen.findByRole("heading", {
        name: "Converse com a Hidden Route",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Enviar mensagem" }),
    ).toBeInTheDocument();
  });
});
