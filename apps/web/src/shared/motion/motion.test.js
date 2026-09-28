import { describe, expect, it } from "vitest";
import { calculateParallaxOffset, nextNavbarVisibility } from "./motion.js";

describe("movimento da interface", () => {
  it("oculta a navbar ao descer depois do limiar e mostra ao subir", () => {
    expect(
      nextNavbarVisibility({ previousY: 90, currentY: 140, threshold: 80 }),
    ).toBe(false);
    expect(
      nextNavbarVisibility({ previousY: 140, currentY: 110, threshold: 80 }),
    ).toBe(true);
    expect(
      nextNavbarVisibility({ previousY: 20, currentY: 50, threshold: 80 }),
    ).toBe(true);
  });

  it("mantém a navbar visível durante menu aberto ou foco interno", () => {
    expect(
      nextNavbarVisibility({ previousY: 100, currentY: 150, menuOpen: true }),
    ).toBe(true);
    expect(
      nextNavbarVisibility({ previousY: 100, currentY: 150, focused: true }),
    ).toBe(true);
  });

  it("calcula parallax somente quando movimento é permitido e a camada está ativa", () => {
    expect(
      calculateParallaxOffset({
        scrollY: 200,
        speed: 0.2,
        active: true,
        reducedMotion: false,
      }),
    ).toBe(40);
    expect(
      calculateParallaxOffset({
        scrollY: 200,
        speed: 0.2,
        active: true,
        reducedMotion: true,
      }),
    ).toBe(0);
    expect(
      calculateParallaxOffset({
        scrollY: 200,
        speed: 0.2,
        active: false,
        reducedMotion: false,
      }),
    ).toBe(0);
  });
});
