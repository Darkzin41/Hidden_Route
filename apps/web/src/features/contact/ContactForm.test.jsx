import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ContactForm } from "./ContactForm.jsx";

describe("ContactForm", () => {
  it("valida os campos antes de enviar", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ContactForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }));

    expect(screen.getByText("Informe seu nome.")).toBeInTheDocument();
    expect(screen.getByText("Informe um e-mail válido.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("envia dados controlados e mostra confirmação", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue({ status: "new" });
    render(<ContactForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Nome"), "Ana Costa");
    await user.type(screen.getByLabelText("E-mail"), "ana@example.com");
    await user.type(
      screen.getByLabelText("Mensagem"),
      "Quero sugerir uma praia para o catálogo Hidden Route.",
    );
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Ana Costa",
      email: "ana@example.com",
      message: "Quero sugerir uma praia para o catálogo Hidden Route.",
    });
    expect(
      await screen.findByText(
        "Mensagem recebida. Obrigado por conversar com a gente.",
      ),
    ).toBeInTheDocument();
  });
});
