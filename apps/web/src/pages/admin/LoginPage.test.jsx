import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AuthContext } from "../../features/auth/auth-context.js";
import LoginPage from "./LoginPage.jsx";

describe("LoginPage", () => {
  it("envia as credenciais informadas", async () => {
    const user = userEvent.setup();
    const login = vi.fn().mockResolvedValue({ id: 1, name: "Equipe" });
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AuthContext.Provider value={{ status: "anonymous", login }}>
          <LoginPage />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText("E-mail"), "admin@hiddenroute.local");
    await user.type(screen.getByLabelText("Senha"), "uma-senha-segura");
    await user.click(screen.getByRole("button", { name: "Entrar no painel" }));

    expect(login).toHaveBeenCalledWith({
      email: "admin@hiddenroute.local",
      password: "uma-senha-segura",
    });
  });
});
