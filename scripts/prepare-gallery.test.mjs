import { afterEach, describe, expect, it } from "vitest";
import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { prepareGallery } from "./prepare-gallery.mjs";

const roots = [];
async function fixture(
  config = { characters: { cenicienta: {}, ariel: {} }, presentation: {} },
) {
  const root = await mkdtemp(path.join(os.tmpdir(), "pide-galeria-"));
  roots.push(root);
  await mkdir(path.join(root, "src"));
  for (const id of Object.keys(config.characters))
    await mkdir(path.join(root, "galeria", id), { recursive: true });
  await writeFile(
    path.join(root, "src/gallery-config.json"),
    JSON.stringify(config),
  );
  return root;
}
async function photo(root, name, width = 1300, height = 1700, color = "blue") {
  await sharp({
    create: { width, height, channels: 3, background: color },
  }).toFile(path.join(root, "galeria", name));
}
afterEach(async () => {
  for (const root of roots.splice(0)) {
    if (
      !path.resolve(root).startsWith(path.resolve(os.tmpdir()) + path.sep) ||
      !path.basename(root).startsWith("pide-galeria-")
    )
      throw new Error("Unsafe test cleanup");
    await rm(root, { recursive: true, force: true });
  }
});

describe("preparación real de la galería", () => {
  it("clasifica por carpeta, ordena numéricamente y produce WebP y dimensiones reales", async () => {
    const root = await fixture();
    await photo(root, "cenicienta/10.JPG");
    await photo(root, "cenicienta/2.png");
    await photo(root, "ariel/2.webp");
    const entries = await prepareGallery(root);
    expect(entries.map((item) => item.id)).toEqual([
      "cenicienta/2",
      "cenicienta/10",
      "ariel/2",
    ]);
    expect(entries.map((item) => item.characterId)).toEqual([
      "cenicienta",
      "cenicienta",
      "ariel",
    ]);
    expect(entries[0].variants.map((item) => item.width)).toEqual([
      320, 480, 800, 1200,
    ]);
    for (const entry of entries)
      for (const variant of entry.variants) {
        const metadata = await sharp(
          await readFile(path.join(root, "public", variant.src)),
        ).metadata();
        expect(metadata.format).toBe("webp");
        expect(metadata.width).toBe(variant.width);
        expect(metadata.height).toBe(variant.height);
      }
    expect(
      JSON.parse(
        await readFile(path.join(root, "src/generated/gallery.json"), "utf8"),
      ),
    ).toEqual(entries);
  });

  it("no amplía fotos pequeñas ni duplica variantes y corrige orientación EXIF", async () => {
    const root = await fixture();
    await photo(root, "cenicienta/small.jpeg", 200, 300);
    await sharp({
      create: { width: 900, height: 1500, channels: 3, background: "red" },
    })
      .jpeg()
      .withMetadata({ orientation: 6 })
      .toFile(path.join(root, "galeria/ariel/rotated.jpg"));
    const entries = await prepareGallery(root);
    expect(entries[0].variants).toHaveLength(1);
    expect(entries[0].variants[0]).toMatchObject({ width: 200, height: 300 });
    expect(entries[1].variants.at(-1)).toMatchObject({
      width: 1200,
      height: 720,
    });
  });

  it("refleja altas, reemplazos, movimientos y borrados sin tocar otros recursos", async () => {
    const root = await fixture();
    await mkdir(path.join(root, "public/images"), { recursive: true });
    await writeFile(path.join(root, "public/images/logo.webp"), "preservar");
    await photo(root, "cenicienta/foto.jpg", 400, 600);
    const first = await prepareGallery(root);
    expect(await prepareGallery(root)).toEqual(first);
    await photo(root, "cenicienta/foto.jpg", 400, 600, "red");
    const second = await prepareGallery(root);
    expect(second[0].variants[0].src).not.toBe(first[0].variants[0].src);
    await expect(
      readFile(path.join(root, "public", first[0].variants[0].src)),
    ).rejects.toThrow();
    await photo(root, "ariel/foto.jpg", 400, 600);
    await rm(path.join(root, "galeria/cenicienta/foto.jpg"));
    expect((await prepareGallery(root)).map((item) => item.id)).toEqual([
      "ariel/foto",
    ]);
    await rm(path.join(root, "galeria/ariel/foto.jpg"));
    expect(await prepareGallery(root)).toEqual([]);
    expect(await readdir(path.join(root, "public/images/galeria"))).toEqual([]);
    expect(
      await readFile(path.join(root, "public/images/logo.webp"), "utf8"),
    ).toBe("preservar");
  });

  it("conserva los resultados anteriores si encuentra una imagen dañada", async () => {
    const root = await fixture();
    await photo(root, "cenicienta/foto.jpg", 200, 300);
    const before = await prepareGallery(root);
    await writeFile(path.join(root, "galeria/cenicienta/bad.jpg"), "invalid");
    await expect(prepareGallery(root)).rejects.toThrow(
      "galeria/cenicienta/bad.jpg",
    );
    expect(
      JSON.parse(
        await readFile(path.join(root, "src/generated/gallery.json"), "utf8"),
      ),
    ).toEqual(before);
    await expect(
      readFile(path.join(root, "public", before[0].variants[0].src)),
    ).resolves.toBeInstanceOf(Buffer);
  });

  it.each(["portada", "presentación"])(
    "rechaza una referencia eliminada de %s",
    async (kind) => {
      const root = await fixture({
        characters: {
          cenicienta: kind === "portada" ? { cover: "missing" } : {},
        },
        presentation:
          kind === "presentación" ? { hero: "cenicienta/missing" } : {},
      });
      await expect(prepareGallery(root)).rejects.toThrow("cenicienta/missing");
    },
  );

  it("rechaza colisiones entre formatos o mayúsculas", async () => {
    const root = await fixture();
    await photo(root, "cenicienta/foto.jpg", 200, 300);
    await photo(root, "cenicienta/FOTO.png", 200, 300);
    await expect(prepareGallery(root)).rejects.toThrow("duplicado");
  });

  it("rechaza carpetas desconocidas y anidadas e ignora archivos auxiliares", async () => {
    const root = await fixture();
    await writeFile(path.join(root, "galeria/README.md"), "instrucciones");
    await writeFile(path.join(root, "galeria/cenicienta/.gitkeep"), "");
    expect(await prepareGallery(root)).toEqual([]);
    await photo(root, "cenicienta/README.jpg", 200, 300);
    expect((await prepareGallery(root)).map((photo) => photo.id)).toEqual([
      "cenicienta/README",
    ]);
    await mkdir(path.join(root, "galeria/cenicienta/nested"));
    await expect(prepareGallery(root)).rejects.toThrow("cenicienta/nested");
    await mkdir(path.join(root, "galeria/unknown"));
    await expect(prepareGallery(root)).rejects.toThrow("unknown");
  });
});
