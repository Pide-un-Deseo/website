import { describe, expect, it, vi } from "vitest";

vi.mock("./generated/gallery.json", async (importOriginal) => {
  const actual = await importOriginal<{
    default: {
      id: string;
      characterId: string;
      variants: { src: string; width: number; height: number }[];
    }[];
  }>();
  return {
    default: [
      ...actual.default.filter(
        (photo) =>
          !["elsa", "anna"].includes(photo.characterId) &&
          !photo.id.endsWith("/nueva-prueba"),
      ),
      ...["cenicienta", "elsa"].map((characterId) => ({
        id: `${characterId}/nueva-prueba`,
        characterId,
        variants: [
          {
            src: `/images/galeria/${characterId}/prueba.webp`,
            width: 200,
            height: 300,
          },
        ],
      })),
    ],
  };
});

import {
  characters,
  gallery,
  getCharacterPhotos,
  getPhoto,
  largestVariant,
} from "./content";

describe("catálogo generado y colecciones", () => {
  it("incorpora una foto nueva a la colección global y solo a su personaje, sin editar contenido", () => {
    expect(
      gallery.filter((photo) => photo.id === "cenicienta/nueva-prueba"),
    ).toHaveLength(1);
    for (const character of characters) {
      const count = getCharacterPhotos(character).filter(
        (photo) => photo.id === "cenicienta/nueva-prueba",
      ).length;
      expect(count).toBe(character.id === "cenicienta" ? 1 : 0);
    }
    expect(getPhoto("cenicienta/nueva-prueba").alt).toContain("Cenicienta");
    expect(getPhoto("cenicienta/nueva-prueba").caption).toBeUndefined();
  });
  it("mantiene las portadas, permite la primera foto de Elsa y conserva tarjetas vacías", () => {
    const cinderella = characters.find(
      (character) => character.id === "cenicienta",
    )!;
    expect(getCharacterPhotos(cinderella)[0].id).toBe("cenicienta/cenicienta");
    const elsa = characters.find((character) => character.id === "elsa")!;
    expect(elsa.photo).toBeUndefined();
    expect(getCharacterPhotos(elsa)[0].id).toBe("elsa/nueva-prueba");
    expect(
      getCharacterPhotos(
        characters.find((character) => character.id === "anna")!,
      ),
    ).toEqual([]);
  });
  it("elige la variante disponible mayor y explica las referencias inexistentes", () => {
    expect(largestVariant(getPhoto("cenicienta/nueva-prueba")).width).toBe(200);
    expect(() => getPhoto("no-existe")).toThrow("gallery:prepare");
  });
});
