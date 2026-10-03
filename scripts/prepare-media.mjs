import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
// Solo esta lista revisada puede pasar del material privado a los recursos públicos.
// No se ejecuta durante build: los derivados ya están versionados.
const root = path.resolve("material-pide-un-deseo");
const output = path.resolve("public/images");
await mkdir(output, { recursive: true });
const sources = { "rapunzel-portada": "fotos/06-rapunzel.webp" };
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
  "Preparados logo, favicon y portada social. Usa gallery:prepare para las fotografías.",
);
