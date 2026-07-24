import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "./page";

describe("HomePage", () => {
  it("presents the product purpose", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /uma rotina que você não precisa guardar só na memória/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/o Pill\.it ajuda a visualizar ciclos/i),
    ).toBeInTheDocument();
  });

  it("identifies the product preview as illustrative", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("complementary", {
        name: /prévia da experiência diária/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/visualização ilustrativa da cartela/i),
    ).toBeInTheDocument();
  });

  it("shows the product boundaries", () => {
    render(<HomePage />);

    expect(
      screen.getByText(/não oferece diagnóstico, prescrição ou orientação clínica/i),
    ).toBeInTheDocument();
  });
});
