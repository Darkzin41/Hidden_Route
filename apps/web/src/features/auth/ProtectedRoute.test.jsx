import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AuthProvider } from "./AuthProvider.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";

function renderRoute(client) {
  return render(
    <MemoryRouter
      initialEntries={["/admin"]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AuthProvider client={client}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<h1>Painel protegido</h1>} />
          </Route>
          <Route path="/admin/login" element={<h1>Entrar</h1>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  it("libera o painel quando a sessão é válida", async () => {
    const client = { get: vi.fn().mockResolvedValue({ id: 1, name: "Admin" }) };
    renderRoute(client);

    expect(
      await screen.findByRole("heading", { name: "Painel protegido" }),
    ).toBeInTheDocument();
  });

  it("redireciona para login quando não há sessão", async () => {
    const client = {
      get: vi.fn().mockRejectedValue(new Error("unauthorized")),
    };
    renderRoute(client);

    expect(
      await screen.findByRole("heading", { name: "Entrar" }),
    ).toBeInTheDocument();
  });
});
