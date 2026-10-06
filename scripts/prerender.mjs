import { readFile, writeFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { render, business } from "../.build/entry-server.js";

export function resolveSiteUrl(env = process.env) {
  const configured = env.SITE_URL?.trim() || env.CF_PAGES_URL?.trim();

  if (env.CF_PAGES_BRANCH === "main" && !configured) {
    throw new Error(
      "Configura SITE_URL con la URL real de producción en Cloudflare Pages antes de publicar main.",
    );
  }

  if (!configured) return undefined;

  const parsed = new URL(configured);
  if (
    (parsed.protocol !== "https:" && parsed.hostname !== "localhost") ||
    parsed.username ||
    parsed.password ||
    parsed.pathname !== "/" ||
    parsed.search ||
    parsed.hash
  ) {
    throw new Error(
      "SITE_URL debe ser el origen HTTPS de producción, sin ruta, credenciales ni parámetros.",
    );
  }

  return parsed.origin;
}

async function main() {
  const siteUrl = resolveSiteUrl();
  const isPreview =
    !siteUrl ||
    (process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== "main");
  const meta = [
    '<meta property="og:image" content="' +
      (siteUrl ?? "") +
      '/social-cover.jpg" />',
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta property="og:image:alt" content="Pide un Deseo: animación infantil en La Habana" />',
    '<meta name="twitter:image" content="' +
      (siteUrl ?? "") +
      '/social-cover.jpg" />',
  ];
  if (isPreview) meta.push('<meta name="robots" content="noindex, nofollow" />');
  const data = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: business.name,
    description: "Princesas y animación infantil en La Habana.",
    ...(siteUrl
      ? {
          url: siteUrl,
          logo: siteUrl + "/images/logo.webp",
          image: siteUrl + "/social-cover.jpg",
        }
      : {}),
    telephone: "+" + business.phone,
    areaServed: { "@type": "City", name: "La Habana" },
    sameAs: [business.instagram, business.facebook],
  }).replaceAll("<", "\\u003c");
  meta.push('<script type="application/ld+json">' + data + "</script>");
  const fontFiles = await readdir("dist/assets");
  for (const prefix of [
    "cormorant-garamond-latin-500-normal-",
    "cormorant-garamond-latin-500-italic-",
  ]) {
    const file = fontFiles.find(
      (name) => name.startsWith(prefix) && name.endsWith(".woff2"),
    );
    if (file)
      meta.push(
        '<link rel="preload" href="/assets/' +
          file +
          '" as="font" type="font/woff2" crossorigin />',
      );
  }
  const template = await readFile("dist/index.html", "utf8");

  function renderPage(pathname, title, description) {
    const pageMeta = [...meta];
    if (pathname !== "/" && !isPreview)
      pageMeta.push('<meta name="robots" content="noindex, nofollow" />');
    if (siteUrl) {
      const canonical = siteUrl + (pathname === "/" ? "/" : pathname);
      pageMeta.push(
        '<link rel="canonical" href="' + canonical + '" />',
        '<meta property="og:url" content="' + canonical + '" />',
      );
    }

    return template
      .replace("<!--app-html-->", render(pathname))
      .replace("<!--site-meta-->", pageMeta.join("\n"))
      .replace(/<title>[\s\S]*?<\/title>/u, "<title>" + title + "</title>")
      .replace(
        /<meta\s+name="description"[\s\S]*?\/>/u,
        '<meta name="description" content="' + description + '" />',
      )
      .replace(
        /<meta\s+property="og:title"[\s\S]*?\/>/u,
        '<meta property="og:title" content="' + title + '" />',
      )
      .replace(
        /<meta\s+property="og:description"[\s\S]*?\/>/u,
        '<meta property="og:description" content="' + description + '" />',
      );
  }

  await writeFile(
    "dist/index.html",
    renderPage(
      "/",
      "Pide un Deseo · Princesas y animación infantil en La Habana",
      "Su personaje favorito, un recuerdo para siempre. Princesas, Huntrix y animación infantil en La Habana. Shows, juegos y momentos mágicos. Consulta por WhatsApp.",
    ),
  );
  for (const page of [
    {
      pathname: "/resena",
      title: "Tu reseña · Pide un Deseo",
      description: "Comparte tu experiencia con Pide un Deseo.",
    },
    {
      pathname: "/admin",
      title: "Administración de reseñas · Pide un Deseo",
      description: "Panel privado de administración de reseñas.",
    },
  ]) {
    await writeFile(
      "dist" + page.pathname + ".html",
      renderPage(page.pathname, page.title, page.description),
    );
  }
  await writeFile(
    "dist/robots.txt",
    isPreview
      ? "User-agent: *\nDisallow: /\n"
      : "User-agent: *\nAllow: /\nSitemap: " + siteUrl + "/sitemap.xml\n",
  );
  if (!isPreview)
    await writeFile(
      "dist/sitemap.xml",
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>' +
        siteUrl +
        "/</loc></url></urlset>",
    );
  const scriptHash = createHash("sha256").update(data).digest("base64");
  await writeFile(
    "dist/_headers",
    [
      "/*",
      "  X-Content-Type-Options: nosniff",
      "  Referrer-Policy: strict-origin-when-cross-origin",
      "  Permissions-Policy: camera=(), microphone=(), geolocation=()",
      "  Content-Security-Policy: default-src 'self'; script-src 'self' 'sha256-" +
        scriptHash +
        "'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'",
      ...(isPreview ? ["  X-Robots-Tag: noindex, nofollow"] : []),
      "/assets/*",
      "  Cache-Control: public, max-age=31536000, immutable",
      "/images/*",
      "  Cache-Control: public, max-age=86400",
    ].join("\n") + "\n",
  );
  console.log(
    "HTML prerenderizado. Modo: " +
      (isPreview ? "vista previa no indexable" : "producción " + siteUrl),
  );
}

const isDirectExecution =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  await main();
}
