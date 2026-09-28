import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Navbar } from "./Navbar.jsx";

describe("Navbar", () => {
  it("expõe os destinos públicos e o acesso administrativo", () => {
    render(
      <MemoryRouter
        initialEntries={["/praias"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Navbar />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("navigation", { name: "Navegação principal" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Praias" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("link", { name: "Área administrativa" }),
    ).toHaveAttribute("href", "/admin/login");
  });

  it("abre e fecha o menu móvel com um botão acessível", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Navbar />
      </MemoryRouter>,
    );

    const button = screen.getByRole("button", { name: "Abrir menu" });
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByTestId("mobile-navigation")).toHaveAttribute(
      "data-open",
      "true",
    );
    await user.click(screen.getByRole("button", { name: "Fechar menu" }));
    expect(screen.getByTestId("mobile-navigation")).toHaveAttribute(
      "data-open",
      "false",
    );
  });
});
