# Mantenimiento y entrega a Rarkey

## Inicio y mapa del proyecto

Lee el [README](../README.md), [AGENTS.md](../AGENTS.md) y la
[guía de fotos](subir-fotos.md). Instala Node 22.23.2 y usa npm con el lockfile.
Después de `npm ci`, ejecuta `npm run dev`. No hay backend, base de datos,
panel de administración ni secretos necesarios para desarrollo.

| Ubicación                                           | Responsabilidad                                                                  |
| --------------------------------------------------- | -------------------------------------------------------------------------------- |
| `src/content.ts`                                    | Datos del negocio, textos, detalles opcionales de fotos y crédito de desarrollo  |
| `src/gallery-config.json`                           | Personajes, portadas y referencias de presentación; compartido con el procesador |
| `src/App.tsx`                                       | Composición de secciones y pie; conserva algunos textos de presentación          |
| `src/components/`                                   | Tarjetas, galería, diálogo, imágenes e iconos                                    |
| `src/lib/whatsapp.ts`                               | Construcción de todos los enlaces de consulta                                    |
| `src/styles.css`                                    | Diseño adaptable, estados y reducción de movimiento                              |
| `src/main.tsx`, `src/entry-server.tsx`              | Entrada del navegador e interfaz de render del servidor de compilación           |
| `scripts/prerender.mjs`                             | HTML final, metadatos, robots, sitemap y cabeceras                               |
| `scripts/prepare-gallery.mjs`                       | Validación de originales y generación de WebP y catálogo                         |
| `galeria/`                                          | Originales revisados versionados por personaje                                   |
| `public/`                                           | Recursos estáticos; las variantes de galería se generan y se ignoran             |
| `tests/e2e/`, `src/*.test.ts`, `scripts/*.test.mjs` | Pruebas de navegador, contenido y procesador                                     |
| `.github/workflows/ci.yml`                          | Comprobaciones en GitHub Actions                                                 |

## Flujo de datos y restricciones

El catálogo y los originales producen `src/generated/gallery.json` y variantes
WebP en `public/images/galeria/`. El contenido combina ese catálogo con
`photoDetails`; los componentes muestran las fotos y sus colecciones.
No edites los generados: se reconstruyen antes de dev, tipos, pruebas y build.
La preparación no vigila carpetas continuamente.

Build comprueba TypeScript, compila el cliente, genera la entrada SSR en
`.build/` y prerenderiza HTML en `dist/`. El navegador hidrata ese HTML.
No uses APIs de navegador ni valores aleatorios durante render.
El contenido y los enlaces esenciales deben funcionar sin JavaScript.

Mantén los personajes del catálogo, incluidas las cuatro tarjetas actualmente sin
foto (Elsa, Anna, Barbie y Bella). La primera imagen disponible sirve de portada
si no se configuró una. No inventes contenido del negocio, precios o testimonios.
Usa `whatsappUrl`: una consulta no confirma una reserva.

Los originales de galería se versionan, pero no se incluyen en `dist/`.
El material privado y los videos permanecen locales. `prepare:media` necesita
material local revisado y solo se ejecuta manualmente para logo, favicon y
portada social; esos recursos públicos sí están versionados.

## Trabajo en feat/rarkey

Para una copia nueva:

```sh
git clone https://github.com/Pide-un-Deseo/website.git
cd website
git switch --track origin/feat/rarkey
npm ci
```

Para retomar trabajo con la rama ya creada:

```sh
git status
git fetch origin
git switch feat/rarkey
git pull --ff-only origin feat/rarkey
```

Resuelve o guarda cambios pendientes antes de cambiar de rama. Si las ramas
divergen, coordina la integración; no sobrescribas el remoto con force push.
Para incorporar avances de producción, con el árbol limpio:

```sh
git fetch origin
git merge origin/main
```

Si aparecen conflictos, revisa cada archivo con el responsable y vuelve a
ejecutar las comprobaciones antes de confirmar. Puedes cancelar una fusión
aún en curso con `git merge --abort`.

Trabaja en cambios pequeños. Revisa `git diff`, añade solo los archivos de tu
tarea con `git add <ruta>`, revisa `git diff --cached`, crea un commit descriptivo
(`docs:`, `feat:` o `fix:`) y ejecuta `git push`.
Usa tu identidad real en Git; no copies la identidad del autor inicial.

Después, revisa Actions y la vista previa de Pages. Abre un pull request de
`feat/rarkey` a `main`, describiendo problema, resultado y validación; solicita
revisión al responsable antes de integrar. Si ya existe uno desde esa rama,
los commits se añadirán a él. Tras integrarlo, vuelve a sincronizar las ramas.

La rama no concede permisos ni impide escribir en `main`. Esta entrega no cambia
las protecciones del repositorio ni invita colaboradores. Si no puedes subir,
el propietario debe revisar tu acceso. Los cambios de `main` publican producción.

## Comprobaciones antes de entregar

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
git diff --check
```

La instalación del navegador solo es necesaria si falta. Como alternativa con
Chrome instalado, en PowerShell ejecuta `$env:PLAYWRIGHT_CHANNEL = 'chrome'`
antes de E2E; después puedes retirarlo con
`Remove-Item Env:PLAYWRIGHT_CHANNEL`.
E2E sirve el build con Vite Preview en el puerto 4173: compila antes y evita
dejar un servidor antiguo en ese puerto.

GitHub Actions ejecuta lint, tipos, Vitest, build y E2E en un entorno limpio
para pushes a main, feat/**, fix/** y chore/**, y pull requests hacia main.
`npm run check` agrupa lint, test, build y E2E; build incluye tipos.
No atribuyas a esta entrega resultados históricos de Lighthouse o producción.

Revisa 360, 390, 768 y 1440 píxeles, teclado y foco visible, cierre de galería,
retorno del foco, imágenes y navegación sin JavaScript. Si solo cambias
documentación, revisa enlaces, contenido y diff; no hace falta toda la batería.
Anota lo ejecutado y las limitaciones en el registro de validación.

## Cloudflare Pages y configuración

El proyecto documentado es `pideundeseo-cuba`, conectado a
`Pide-un-Deseo/website`; no crees otro para una actualización.

| Ajuste             | Valor                                |
| ------------------ | ------------------------------------ |
| Rama de producción | `main`                               |
| Directorio raíz    | Raíz del repositorio                 |
| Comando de build   | `npm run build`                      |
| Salida             | `dist`                               |
| `NODE_VERSION`     | `22.23.2`                            |
| `SITE_URL`         | `https://pideundeseo-cuba.pages.dev` |

`SITE_URL` se lee del entorno de compilación, no de archivos `.env`;
`.env.example` solo documenta el ajuste. Debe ser el origen HTTPS real sin
ruta, consulta ni fragmento. Si se adopta un dominio propio, actualiza el ajuste
y la documentación. Cloudflare proporciona `CF_PAGES_BRANCH` para distinguir
producción y vistas previas.

Sin SITE_URL, un build local es no indexable; en Cloudflare, main sin SITE_URL
falla. Las otras ramas son no indexables incluso con SITE_URL configurada.
Producción genera canonical, robots y sitemap. No guardes credenciales en el
repositorio ni en variables enviadas al navegador.

Para comprobar metadatos localmente en PowerShell:

```powershell
$env:SITE_URL = 'https://pideundeseo-cuba.pages.dev'
npm run build
npm run preview
```

Este comando solo genera un build local, no publica. Retira la variable con
`Remove-Item Env:SITE_URL` para volver al comportamiento local de vista previa.
No uses Vite Preview como servidor de producción.

## Diagnóstico y recuperación

- **Falla la galería:** consulta el archivo indicado y la guía de fotos. No
  intentes corregir el catálogo generado a mano.
- **Falla CI:** abre el paso fallido de Website checks. Los errores E2E conservan
  trazas y reportes como artefactos durante siete días según el workflow actual.
- **Falla Pages:** revisa el log de compilación, rama, versión Node y SITE_URL.
  Una comprobación de Actions correcta no garantiza que Pages haya publicado.
- **Una publicación introduce una regresión:** el responsable puede restaurar un
  despliegue correcto desde Pages y preparar una reversión del cambio por pull
  request. No reescribas historial compartido; restaura también el código para
  que la siguiente publicación no repita el problema.
- **Después de publicar:** verifica HTTPS, imágenes, WhatsApp, galería, una ruta
  inexistente (404), metadatos, robots y sitemap; revisa también desde móvil.

Las URLs y resultados de publicación previos están en
[el registro de validación](validation.md). Esta entrega prepara y sube una rama;
no integra cambios ni realiza un despliegue manual de producción.
