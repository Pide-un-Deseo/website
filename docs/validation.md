# Registro de validación

## Historial: primera versión (3 de octubre de 2026)

Los resultados siguientes pertenecen al lanzamiento y a sus commits indicados.
No describen una nueva ejecución sobre feat/rarkey. La galería evolucionó después:
los originales revisados de galeria/ ahora se versionan y los derivados se generan.

## Resultado local

- ESLint y TypeScript: correctos.
- Vitest: 7 pruebas correctas para enlaces de WhatsApp, teléfono, contexto y acentos.
- Playwright con Chrome instalado: 11 pruebas correctas; 1 caso omitido porque
  el menú móvil no se aplica al proyecto de escritorio.
- Tamaños revisados: 360, 390, 768 y 1440 píxeles, sin desbordamiento horizontal.
- Galería: apertura, foco en cerrar, recorrido con Tab, Escape y retorno del foco.
- Contenido y enlaces esenciales disponibles con JavaScript deshabilitado.
- Fotografías publicadas revisadas: solo animadoras y detalles del vestuario.
- En aquella versión, carpeta de originales ignorada; 22 imágenes con niños retiradas; 2 videos conservados
  localmente y excluidos de la publicación.

## Compilación reproducible y vista previa

- Copia limpia con `git archive`: instalación offline, lint, pruebas, tipos y
  compilación correctos sin la carpeta de material privado.
- GitHub Actions: comprobaciones correctas del commit `273d1aa`.
- Pages local: portada 200, ruta inexistente 404 y política CSP aplicada.
- Vista previa real: https://5f4f923e.pideundeseo-cuba.pages.dev.
- HTTPS, imágenes, galería, Escape y retorno del foco correctos; sin errores de
  JavaScript. Sin desbordes a 360, 390, 768 y 1440 px. Respuesta 404 correcta.
- Vista previa marcada `noindex, nofollow`.
- Proyecto conectado a GitHub, producción desde `main`, salida `dist` y
  `SITE_URL` configurada con la dirección real.

## Lighthouse móvil

Auditoría de la compilación de producción servida **localmente**, con Chrome y
el perfil móvil simulado de Lighthouse. Se utilizó `SITE_URL=http://localhost:4173`
solo para comprobar los metadatos de producción; esa dirección no se publicará.

| Categoría        | Puntuación |
| ---------------- | ---------: |
| Rendimiento      |         94 |
| Accesibilidad    |        100 |
| Buenas prácticas |        100 |
| SEO              |        100 |

| Métrica                  | Resultado |
| ------------------------ | --------: |
| First Contentful Paint   |     1,7 s |
| Largest Contentful Paint |     2,9 s |
| Total Blocking Time      |      0 ms |
| Cumulative Layout Shift  |         0 |

Estas mediciones son de laboratorio, no métricas de visitantes reales ni una
garantía de tiempos en redes cubanas. Deben contrastarse con la publicación final.
Los informes completos locales se guardan en `artifacts/lighthouse-mobile.report.html`
y `.json`, ignorados por Git.

## Capturas

Las capturas muestran una ejecución real del sitio, no un mockup.

![Portada en escritorio](screenshots/desktop.webp)

![Portada en móvil](screenshots/mobile.webp)

## Publicación verificada

- Web pública: https://pideundeseo-cuba.pages.dev.
- Pull request #1 integrado tras revisar la vista previa y los checks de GitHub.
- Commit de lanzamiento: `b7e7a4183c67bf68b569179cb740184716501475`.
- Despliegue automático de GitHub a Cloudflare Pages comprobado.
- HTTPS 200, URL canónica correcta, producción indexable, robots y sitemap correctos.
- Imagen social disponible y ruta inexistente con respuesta 404.
- Fotografías cargadas, galería y retorno del foco correctos, sin errores JavaScript.
- Sin desbordes a 360, 390, 768 y 1440 px sobre producción.
- Contenido y 20 enlaces de WhatsApp disponibles sin JavaScript.
- Pendiente únicamente la comprobación del usuario desde una conexión en Cuba.

## Lighthouse móvil en producción

Auditoría del 3 de octubre de 2026 sobre https://pideundeseo-cuba.pages.dev:
**100 rendimiento / 100 accesibilidad / 100 buenas prácticas / 100 SEO**.
FCP 1,2 s, LCP 1,5 s, TBT 0 ms y CLS 0. Es una medición de laboratorio;
no sustituye la comprobación desde conexiones móviles reales en Cuba.
Informes locales: `artifacts/lighthouse-production.report.html` y `.json`.

## Entrega de documentación y crédito en feat/rarkey

Validación local de esta entrega, sobre la base `7fa9ec0`.
Entorno: Windows, Node 22.23.2, npm 10.9.8 y Chromium de Playwright instalado.

- `npm run lint`: correcto.
- `npm run typecheck`: correcto.
- `npm test`: 18 pruebas correctas en 3 archivos.
- `npm run build`: correcto, 14 fotos preparadas y HTML prerenderizado en modo
  vista previa no indexable.
- `npm run test:e2e`: 19 pruebas correctas y 1 omitida (menú móvil en escritorio).
  Incluye imágenes, galerías por personaje, teclado, Escape, retorno del foco,
  contenido sin JavaScript y ausencia de desbordes en los cuatro tamaños.
- Comprobación adicional del crédito en 360, 390, 768 y 1440 píxeles, con y sin
  JavaScript: visible, enlace correcto a JD3M0N, copyright del negocio conservado,
  navegación Tab/Shift+Tab y foco visible correctos.
- Capturas del pie revisadas visualmente en los cuatro tamaños, guardadas en
  `artifacts/handoff/` (ignoradas en Git).
- Los 15 enlaces locales de los Markdown revisados apuntan a archivos existentes.
- Prettier sobre todos los archivos modificados: correcto.
- `git diff --check`: correcto.

### Limitaciones y resultados previos

`npm run format:check` global falla por 27 archivos preexistentes no modificados
en esta entrega: configuración, workflow, lockfile, scripts, componentes y
pruebas. No se reformatearon para evitar cambios ajenos al encargo.
El formato de los archivos de esta tarea se comprobó por separado y pasó.

No se repitieron Lighthouse ni las comprobaciones de producción del historial.
No se hizo una instalación desde checkout limpio en esta entrega.
La validación descrita es local; no equivale a una verificación de la futura
vista previa de Cloudflare ni a una publicación en producción.
