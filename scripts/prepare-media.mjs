import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
// Solo esta lista revisada puede pasar del material privado a los recursos públicos.
// No se ejecuta durante build: los derivados ya están versionados.
const root = path.resolve("material-pide-un-deseo");
const output = path.resolve("public/images");
await mkdir(output, { recursive: true });
const sources = {
  ariel: "fotos/01-ariel.webp",
  "ariel-retrato": "fotos/02-ariel.webp",
  blancanieves: "fotos/03-blancanieves.webp",
  "blancanieves-jardin": "fotos/04-blancanieves-panoramica.jpg",
  rapunzel: "fotos/05-rapunzel.webp",
  "rapunzel-portada": "fotos/06-rapunzel.webp",
  "rapunzel-jardin": "fotos/19-rapunzel-panoramica.jpg",
  cenicienta: "fotos/09-cenicienta.jpg",
  "cenicienta-retrato": "fotos/10-cenicienta.jpg",
  "cenicienta-fiesta": "fotos/08-cenicienta.jpg",
  huntrix: "fotos/11-huntrix.webp",
  "huntrix-poses": "fotos/12-huntrix.webp",
  moana: "otras-fotos/mohana.png",
  "detalle-rapunzel": "otras-fotos/ig_2026-04-16_DXM-Q5vGr0b_03.webp",
};
for (const [id, file] of Object.entries(sources)) {
  for (const width of [320, 480, 800, 1200]) {
    await sharp(path.join(root, file))
      .rotate()
      .resize({ width })
      .webp({ quality: 75 })
      .toFile(path.join(output, `${id}-${width}.webp`));
  }
}
const logo = path.join(root, "logo/logo-pide-un-deseo-1080.jpg");
await sharp(logo)
  .resize(256, 256)
  .webp({ quality: 88 })
  .toFile(path.join(output, "logo.webp"));
await sharp(logo).resize(64, 64).png().toFile("public/favicon.png");
const logoBuffer = await sharp(logo).resize(420, 420).toBuffer();
const portrait = await sharp(path.join(root, sources["rapunzel-portada"]))
  .resize(460, 630, { fit: "cover" })
  .toBuffer();
const caption = Buffer.from(
  '<svg width="740" height="100"><text x="370" y="60" text-anchor="middle" font-family="sans-serif" font-size="25" fill="#8f204a">Animación infantil · La Habana, Cuba</text></svg>',
);
await sharp({
  create: { width: 1200, height: 630, channels: 3, background: "#fffaf7" },
})
  .composite([
    { input: logoBuffer, left: 160, top: 55 },
    { input: caption, left: 0, top: 470 },
    { input: portrait, left: 740, top: 0 },
  ])
  .jpeg({ quality: 85 })
  .toFile("public/social-cover.jpg");
await writeFile(
  "public/images/README.txt",
  "Fotografías de Pide un Deseo. Derivados optimizados de una selección revisada sin niños. No incluyen el material privado de referencia.\n",
);
console.log(
  `Preparados ${Object.keys(sources).length} motivos fotográficos, logo, favicon y portada social.`,
);
