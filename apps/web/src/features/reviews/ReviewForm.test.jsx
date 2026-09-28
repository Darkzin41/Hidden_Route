import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ReviewForm } from "./ReviewForm.jsx";

describe("ReviewForm", () => {
  it("envia nota e comentário para moderação", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue({ status: "pending" });
    render(<ReviewForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Seu nome"), "Maria");
    await user.click(screen.getByRole("radio", { name: "5 estrelas" }));
    await user.type(
      screen.getByLabelText("Sua avaliação"),
      "Um lugar bonito, tranquilo e muito acolhedor.",
    );
    await user.click(screen.getByRole("button", { name: "Enviar avaliação" }));

    expect(onSubmit).toHaveBeenCalledWith({
      authorName: "Maria",
      rating: 5,
      comment: "Um lugar bonito, tranquilo e muito acolhedor.",
    });
    expect(
      await screen.findByText("Avaliação enviada para moderação."),
    ).toBeInTheDocument();
  });
});
