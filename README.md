# Pide un Deseo — Website

Web en español de **Pide un Deseo**, servicio de princesas y animación infantil
en La Habana. Presenta personajes, experiencias, eventos y contacto directo
por WhatsApp, Instagram y Facebook.

**Estado:** conectado a Cloudflare Pages mediante GitHub.
URL de producción configurada: https://pideundeseo-cuba.pages.dev.
Las ramas de trabajo tienen vistas previas no indexables.

## Desarrollo local

Requiere Node.js **22.23.2** (ver `.nvmrc`) y npm.

```sh
npm ci
npm run dev
```

Abre la dirección local indicada por Vite. No necesita base de datos ni claves.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
npx playwright install chromium
npm run test:e2e
```

`npm run check` ejecuta lint, pruebas unitarias, compilación y pruebas de navegador.
Estas últimas necesitan Chromium instalado. GitHub Actions ejecuta las mismas
comprobaciones en un entorno limpio.

## Editar el contenido

La fuente de contenido es **`src/content.ts`**: contacto, redes, catálogo, servicios,
eventos, galería y preguntas frecuentes. El mensaje de WhatsApp se genera en
`src/lib/whatsapp.ts`. Los textos de presentación y composición están en
`src/App.tsx`; el diseño se controla desde `src/styles.css`.

- **Personajes:** añade o cambia una entrada de `characters`. Sin `photo`, la
  tarjeta conserva un espacio blanco y el botón de consulta.
- **Fotos:** cada motivo usa `/images/<id>-320.webp`, `-480.webp`, `-800.webp` y `-1200.webp`.
  Coloca las cuatro versiones revisadas en `public/images` y actualiza `id` y `alt`.
- **Servicios y eventos:** publica solo información confirmada. Las consultas no
  reservan automáticamente; el equipo confirma disponibilidad por WhatsApp.
- **Teléfono:** usa formato internacional con dígitos, sin espacios ni `+` en
  `phone`; `displayPhone` controla su presentación.

El negocio tiene sede en La Habana Vieja y se desplaza dentro de La Habana.
Se recomienda consultar con un mes de anticipación.

## Material privado y fotografías

`material-pide-un-deseo/` está ignorada y nunca se copia completa al sitio.
Se retiraron las 22 fotografías, collages y vista previa con niños identificados
en la revisión. Los dos videos se conservan localmente y no se publican.

La aplicación usa únicamente los derivados revisados en `public/images`.
No hay fotos de niños en esta selección. Tampoco hay videos automáticos,
feeds sociales incrustados ni analítica de terceros.

`npm run prepare:media` es una herramienta manual para el mantenedor que tenga
los originales: su lista explícita de imágenes está en `scripts/prepare-media.mjs`.
**No forma parte de la compilación**. Una copia limpia del repositorio contiene
todos los recursos necesarios. Revisa las imágenes antes de ampliar esa lista.

## Arquitectura

React + TypeScript + Vite, CSS propio, fuentes locales y contenido estático.
La compilación genera HTML con `react-dom/server`; React añade interactividad en
el navegador. El contenido, las preguntas frecuentes y los enlaces esenciales
siguen disponibles sin JavaScript.

La galería utiliza un diálogo nativo accesible. No existe backend, formulario
de captura, panel administrativo, pagos ni reservas automáticas.

## Cloudflare Pages

1. En Cloudflare, crea un proyecto **Pages con integración Git** y conecta
   `Pide-un-Deseo/website`. El propietario de la organización debe autorizar la
   aplicación si GitHub lo requiere.
2. El proyecto existente se llama `pideundeseo-cuba`; no necesitas crear otro.
3. Configura:
   - Rama de producción: `main`.
   - Directorio raíz: raíz del repositorio.
   - Comando de compilación: `npm run build`.
   - Directorio de salida: `dist`.
   - Variable `NODE_VERSION`: `22.23.2`.
   - Variable **`SITE_URL`**: `https://pideundeseo-cuba.pages.dev` (actualízala
     si en el futuro se configura un dominio propio).
4. Habilita las vistas previas de ramas. La compilación marca las ramas distintas
   de `main` como `noindex`. Sin `SITE_URL`, también genera una vista previa
   no indexable y no inventa URLs de producción.
5. Revisa la vista previa y los checks del pull request antes de integrarlo.
6. Tras publicar, comprueba WhatsApp, redes, HTTPS, `/robots.txt`,
   `/sitemap.xml`, metadatos y una ruta inexistente (404).

`SITE_URL` se lee del entorno de compilación, no de archivos `.env`.
El ejemplo en `.env.example` es documentación. En PowerShell puedes probar:
`$env:SITE_URL = 'https://URL-REAL.pages.dev'` antes de `npm run build`.
No configures una URL provisional como producción.

Una compilación de `main` en Cloudflare sin `SITE_URL` falla con una explicación.
Las imágenes de redes y el logo se sirven desde el mismo sitio. `_headers`
define política de contenido, caché de assets y cabeceras básicas de seguridad.

### Actualizaciones y recuperación

Trabaja en una rama, publica el cambio y revisa la vista previa antes de integrar
el pull request. Los cambios de `main` despliegan producción automáticamente.
Si una publicación falla, conserva la última versión correcta; utiliza el
historial de despliegues de Pages para volver a una versión anterior y corrige
el problema mediante otro pull request. No uses `vite preview` como servidor
de producción.

Documentación: [Vite en Cloudflare Pages](https://vite.dev/guide/static-deploy.html#cloudflare-pages)
y [límites del plan gratuito](https://developers.cloudflare.com/pages/platform/limits/).
El dominio propio no está incluido; se empieza con el subdominio gratuito.

## Autoría y colaboración

Organización: [Pide un Deseo](https://github.com/Pide-un-Deseo).
Desarrollo: [JD3M0N](https://github.com/JD3M0N).

Lee [AGENTS.md](AGENTS.md). Los commits y pull requests documentan las
contribuciones reales. No subas secretos ni material privado de referencia.
