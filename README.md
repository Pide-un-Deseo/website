# Pide un Deseo — Website

Web estática en español de Pide un Deseo, animación infantil en La Habana.
React + TypeScript estricto + Vite, CSS propio y fuentes locales; sin backend.
Contacto y consultas por WhatsApp, sin confirmación automática de reservas.

Web documentada: https://pideundeseo-cuba.pages.dev.
Repositorio: https://github.com/Pide-un-Deseo/website.
Cloudflare Pages publica producción desde `main`; las ramas de trabajo generan
vistas previas no indexables cuando están habilitadas en Pages.

## Por dónde empezar

- [Guía rápida para Rayko](docs/rayko.md): entrar en tu rama, cambiar, comprobar y publicar en main.

- [Subir una foto JPG](docs/subir-fotos.md): desde GitHub o desde tu equipo.
- [Mantenimiento y entrega a Rarkey](docs/mantenimiento.md): mapa del proyecto,
  contenido, configuración, pruebas, colaboración y recuperación.
- [Galería](galeria/README.md): ubicación de originales y acceso a la guía.
- [Instrucciones de desarrollo](AGENTS.md): reglas del repositorio.
- [Registro de validación](docs/validation.md): resultados históricos y comprobaciones de entrega.

## Desarrollo local

Versión fijada en `.nvmrc`: **Node.js 22.23.2**. `package.json` admite
Node >=22.12.0; usa la versión fijada para reproducir el entorno.
La entrega se prepara con **npm 10.9.8**. Usa npm y conserva `package-lock.json`.

```sh
git clone https://github.com/Pide-un-Deseo/website.git
cd website
git switch --track origin/feat/rarkey
npm ci
npm run dev
```

Si ya tienes la rama local, usa `git switch feat/rarkey`.
Abre la URL que indica Vite. No se requieren claves ni base de datos.

| Comando                   | Función                                                           |
| ------------------------- | ----------------------------------------------------------------- |
| `npm run dev`             | Prepara la galería e inicia desarrollo                            |
| `npm run gallery:prepare` | Genera WebP y catálogo desde originales                           |
| `npm run lint`            | Comprueba reglas de código                                        |
| `npm run typecheck`       | Prepara galería y comprueba TypeScript                            |
| `npm test`                | Prepara galería y ejecuta Vitest                                  |
| `npm run build`           | Prepara galería, comprueba tipos y genera el sitio prerenderizado |
| `npm run preview`         | Sirve el build local; requiere compilar antes                     |
| `npm run test:e2e`        | Ejecuta Playwright sobre el build local                           |
| `npm run check`           | Ejecuta lint, pruebas, build y E2E; build comprueba tipos         |
| `npm run format:check`    | Comprueba formato                                                 |
| `npm run format`          | Reescribe formato; revisar el diff después                        |
| `npm run prepare:media`   | Preparación manual de logo, favicon y portada social              |

Para E2E, instala Chromium con `npx playwright install chromium`.
Si la descarga falla y tienes Chrome, en PowerShell usa
`$env:PLAYWRIGHT_CHANNEL = 'chrome'` antes de `npm run test:e2e`.

## Contenido e imágenes

Textos y datos: `src/content.ts`; catálogo de personajes, portadas y referencias:
`src/gallery-config.json`. Algunos textos de composición siguen en `src/App.tsx`.
El crédito de desarrollo se configura en `developmentCredit` del archivo de contenido.

Los JPG revisados se guardan en `galeria/<personaje>/` y se versionan.
El procesador genera `public/images/galeria/` y `src/generated/`, ignorados en Git.
No edites ni subas esos resultados. Los originales no se copian al sitio publicado,
aunque sí están disponibles para quien tenga acceso al repositorio.

Solo se admiten fotografías revisadas de animadoras sin niños.
`material-pide-un-deseo/` y los videos de referencia permanecen locales.
La compilación funciona sin ese material; `prepare:media` es manual y no forma parte del build.

## Autoría y colaboración

Organización: [Pide un Deseo](https://github.com/Pide-un-Deseo).
Desarrollo: [JD3M0N](https://github.com/JD3M0N).

Rama de trabajo de Rarkey: `feat/rarkey`. Los cambios se revisan mediante pull
requests antes de integrarlos en `main`, que despliega producción automáticamente.
Una rama no concede acceso al repositorio ni bloquea escrituras en otras ramas.
