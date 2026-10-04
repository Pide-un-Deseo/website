# Originales de la galería

Guarda aquí las fotografías revisadas en `galeria/<personaje>/<nombre>.jpg`.
Los originales se versionan; no se copian al sitio publicado. Solo se admiten
animadoras sin niños, nunca el material privado completo.

Consulta [Cómo subir una foto JPG](../docs/subir-fotos.md) para los pasos desde
GitHub y Git local, nombres, formatos, portadas, textos, eliminación y errores.

`npm run gallery:prepare` genera los WebP y el catálogo. También se ejecuta
antes de desarrollo, tipos, pruebas unitarias y compilación. Los resultados
en `public/images/galeria/` y `src/generated/` están ignorados: no los edites
ni los subas. Con el servidor abierto, repite el comando o reinicia Vite
después de modificar originales.
