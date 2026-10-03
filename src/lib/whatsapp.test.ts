import { describe, expect, it } from "vitest";
import { whatsappUrl } from "./whatsapp";
describe("Consultas por WhatsApp", () => {
  it("abre el teléfono del negocio con un mensaje general legible", () => {
    const url = new URL(whatsappUrl());
    expect(url.origin).toBe("https://wa.me");
    expect(url.pathname).toBe("/5353893363");
    expect(url.searchParams.get("text")).toContain("celebración en La Habana");
  });
  it.each([
    "Huntrix",
    "Cenicienta",
    "Animación de 3 horas",
    "una entrega de regalos",
    "los próximos eventos",
    "Elsa & Anna",
  ])("conserva acentos y contexto: %s", (subject) => {
    const url = new URL(whatsappUrl(subject));
    expect(url.searchParams.get("text")).toContain(subject);
    expect([...url.searchParams.keys()]).toEqual(["text"]);
    expect(url.searchParams.get("text")).toContain("consultar disponibilidad");
  });
});
