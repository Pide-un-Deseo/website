import { createHash } from "node:crypto";
import {
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const widths = [320, 480, 800, 1200];
const auxiliary =
  /^(readme(?:\.(?:md|txt|rst))?|\.gitkeep|\.DS_Store|Thumbs\.db)$/i;
const extensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const compare = new Intl.Collator("es", {
  numeric: true,
  sensitivity: "variant",
});

// Only this dedicated generated directory may be replaced or cleaned.
function generatedPath(root, relative) {
  const result = path.resolve(root, relative);
  if (!result.startsWith(path.resolve(root) + path.sep)) {
    throw new Error(`Ruta generada fuera del proyecto: ${result}`);
  }
  return result;
}

export async function prepareGallery(root = process.cwd()) {
  const config = JSON.parse(
    await readFile(path.join(root, "src/gallery-config.json"), "utf8"),
  );
  const input = path.join(root, "galeria");
  const output = generatedPath(root, "public/images/galeria");
  const temporary = generatedPath(root, "public/images/.galeria-temporal");
  const manifest = generatedPath(root, "src/generated/gallery.json");
  const entries = await readdir(input, { withFileTypes: true });
  for (const entry of entries) {
    if (auxiliary.test(entry.name)) continue;
    if (!entry.isDirectory() || !Object.hasOwn(config.characters, entry.name)) {
      throw new Error(
        `Carpeta de personaje desconocida o entrada no permitida: galeria/${entry.name}`,
      );
    }
  }
  const photos = [];
  const pending = [];
  for (const characterId of Object.keys(config.characters)) {
    if (!entries.some((entry) => entry.name === characterId)) continue;
    const folder = path.join(input, characterId);
    const files = (await readdir(folder, { withFileTypes: true })).sort(
      (a, b) =>
        compare.compare(a.name, b.name) ||
        (a.name < b.name ? -1 : a.name > b.name ? 1 : 0),
    );
    const names = new Set();
    for (const file of files) {
      if (auxiliary.test(file.name)) continue;
      const relative = `${characterId}/${file.name}`;
      const extension = path.extname(file.name).toLowerCase();
      if (!file.isFile() || !extensions.has(extension)) {
        throw new Error(
          `Archivo o subcarpeta no admitido: galeria/${relative}. Usa JPG, JPEG, PNG o WebP.`,
        );
      }
      const stem = path.basename(file.name, path.extname(file.name));
      const normalized = stem.normalize("NFC").toLowerCase();
      if (names.has(normalized))
        throw new Error(`Nombre de foto duplicado: galeria/${relative}`);
      names.add(normalized);
      pending.push({
        characterId,
        id: `${characterId}/${stem}`,
        relative,
        file: path.join(folder, file.name),
      });
    }
  }
  const ids = new Set(pending.map((photo) => photo.id));
  const references = [
    ...Object.entries(config.characters)
      .filter(([, value]) => value.cover)
      .map(([id, value]) => [`portada de ${id}`, `${id}/${value.cover}`]),
    ...Object.entries(config.presentation).map(([name, id]) => [
      `presentación ${name}`,
      id,
    ]),
  ];
  for (const [reference, id] of references) {
    if (!ids.has(id))
      throw new Error(
        `Falta la foto ${id}, usada en ${reference}. Corrige src/gallery-config.json o restaura el archivo.`,
      );
  }
  await rm(temporary, { recursive: true, force: true });
  await mkdir(temporary, { recursive: true });
  try {
    for (const photo of pending) {
      try {
        const bytes = await readFile(photo.file);
        const metadata = await sharp(bytes).metadata();
        if ((metadata.pages ?? 1) > 1)
          throw new Error("Solo se admiten imágenes estáticas");
        const orientedWidth =
          metadata.orientation >= 5 && metadata.orientation <= 8
            ? metadata.height
            : metadata.width;
        const targets = [
          ...new Set(widths.map((width) => Math.min(width, orientedWidth))),
        ];
        const hash = createHash("sha256")
          .update(bytes)
          .update(
            JSON.stringify({
              widths,
              quality: 75,
              version: 1,
              sharp: sharp.versions,
            }),
          )
          .digest("hex")
          .slice(0, 16);
        const folder = path.join(temporary, photo.characterId);
        await mkdir(folder, { recursive: true });
        const variants = [];
        // Hash the ID as well so arbitrary filenames never become output paths.
        const key = createHash("sha256")
          .update(photo.id)
          .digest("hex")
          .slice(0, 16);
        for (const width of targets) {
          const filename = `${key}-${hash}-${width}.webp`;
          const info = await sharp(bytes)
            .rotate()
            .resize({ width, withoutEnlargement: true })
            .webp({ quality: 75 })
            .toFile(path.join(folder, filename));
          variants.push({
            src: `/images/galeria/${photo.characterId}/${filename}`,
            width: info.width,
            height: info.height,
          });
        }
        photos.push({ id: photo.id, characterId: photo.characterId, variants });
      } catch (error) {
        throw new Error(
          `No se pudo procesar galeria/${photo.relative}: ${error.message}`,
          { cause: error },
        );
      }
    }
    // Do not touch existing output until every source has converted successfully.
    await mkdir(path.dirname(manifest), { recursive: true });
    await writeFile(`${manifest}.tmp`, JSON.stringify(photos, null, 2) + "\n");
    await rm(output, { recursive: true, force: true });
    await rename(temporary, output);
    await rename(`${manifest}.tmp`, manifest);
  } finally {
    await rm(temporary, { recursive: true, force: true });
    await rm(`${manifest}.tmp`, { force: true });
  }
  return photos;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  prepareGallery()
    .then((photos) => console.log(`Galería preparada: ${photos.length} fotos.`))
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
