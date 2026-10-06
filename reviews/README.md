# Reseñas

Módulo separado del sitio principal. Mantén frontend, reglas, almacenamiento,
migraciones y pruebas dentro de esta carpeta. `functions/api/` solo contiene los
adaptadores requeridos por Cloudflare Pages Functions y delega en `reviews/`.

Los valores reales de D1 y Cloudflare Access se configuran fuera del repositorio.
Para desarrollo local, copia `.dev.vars.example` a `.dev.vars` y usa los scripts
`db:migrate:local` y `dev:pages` después de sustituir el identificador de D1 local
en `wrangler.jsonc`.