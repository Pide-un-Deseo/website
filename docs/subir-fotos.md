# Cómo subir una foto JPG

Esta guía sirve para añadir una fotografía a un personaje existente.
No hay panel de subida en la web: las imágenes se incorporan al repositorio y
Cloudflare las procesa durante la compilación.

## 1. Revisar y nombrar la fotografía

1. Revisa la imagen completa: solo animadoras, sin niños ni información privada.
   El procesador convierte imágenes, pero no reconoce ni revisa a las personas.
2. Usa un JPG real, no otro formato renombrado. También se admiten JPEG, PNG y
   WebP estáticos, con extensiones en mayúsculas o minúsculas.
3. Elige la carpeta del personaje según `src/gallery-config.json`:
   `huntrix`, `cenicienta`, `rapunzel`, `ariel`, `moana`,
   `blancanieves`, `elsa`, `anna`, `barbie` o `bella`.
4. Usa un nombre descriptivo, preferiblemente sin espacios ni acentos:
   `001-retrato.jpg`. El ejemplo completo sería
   `galeria/cenicienta/001-retrato.jpg`; no es una foto incluida en el proyecto.
5. No crees subcarpetas dentro del personaje. El nombre sin extensión debe ser
   único en esa carpeta, incluso ignorando mayúsculas: `foto.jpg` y `Foto.png`
   son un duplicado. En personajes distintos sí puede repetirse.

Los originales se versionan: revisa también sus metadatos antes de subirlos.
No copies la carpeta de material privado. No pongas originales en `public/`.
No hace falta convertir a WebP ni ampliar una foto pequeña.

## 2A. Subir desde el navegador de GitHub

1. Abre [el repositorio](https://github.com/Pide-un-Deseo/website).
2. Selecciona **feat/rarkey** en el selector de ramas y confirma el nombre antes
   de editar. Necesitas acceso de escritura; la rama no concede ese acceso.
3. Entra en `galeria/<personaje>/`, pulsa **Add file → Upload files** y selecciona
   el JPG revisado. Si la carpeta aún no existe, usa el procedimiento local
   de abajo para crearla sin introducir archivos auxiliares.
4. Comprueba la ruta y escribe un mensaje como
   `feat: añadir retrato de Cenicienta`. Confirma en **feat/rarkey**.
5. Si corresponde, edita los textos o la portada siguiendo el apartado 3,
   siempre en la misma rama.
6. Revisa **Actions → Website checks** para el último commit y la vista previa de
   Cloudflare asociada a la rama, si está disponible. Un commit no significa
   que el build haya terminado ni que la foto esté en producción.
7. Comprueba la foto en la galería y en la colección del personaje, también en móvil.
8. Cuando el cambio esté listo, abre un pull request con base `main` y rama
   `feat/rarkey`. Describe qué foto se añadió y las comprobaciones realizadas.
   Pide revisión al responsable y espera su aprobación antes de integrar.

Si ya hay un pull request abierto desde esa rama, los nuevos commits se añaden
a él: comprueba que todos pertenezcan a la misma entrega. No uses la rama
simultáneamente con otra persona sin coordinar los cambios.

## 2B. Subir desde tu equipo

Con Node y npm instalados según el [README](../README.md), prepara el repositorio:

```sh
git clone https://github.com/Pide-un-Deseo/website.git
cd website
git switch --track origin/feat/rarkey
npm ci
```

Si ya lo tienes, comprueba que no hay cambios pendientes y actualiza tu rama:

```sh
git status
git fetch origin
git switch feat/rarkey
git pull --ff-only origin feat/rarkey
```

Si el avance rápido falla, no uses force push: revisa la divergencia con el
responsable. Conserva tus cambios antes de cambiar de rama.

Copia el JPG mediante el explorador a `galeria/cenicienta/001-retrato.jpg`
(crea la carpeta del personaje si falta). Después ejecuta:

```sh
npm run gallery:prepare
npm run dev
```

Abre la URL local y comprueba la foto. Si añades archivos con Vite abierto,
ejecuta `npm run gallery:prepare` en otra terminal o reinicia desarrollo;
no existe vigilancia continua de las carpetas.

Antes de subir:

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
git diff --check
git status --short
git add galeria/cenicienta/001-retrato.jpg
git diff --cached --stat
git commit -m "feat: añadir retrato de Cenicienta"
git push
```

Playwright necesita Chromium instalado; consulta el README. Si cambiaste
textos o portadas, añade también esos archivos concretos antes del commit.
No uses `git add .` sin revisar todo. Comprueba Actions, vista previa y pull request
como en el procedimiento del navegador.

## 3. Orden, portadas y descripciones

- El orden global sigue los personajes del catálogo y los nombres de archivo con
  orden numérico. Los prefijos `001`, `002`, etc. ayudan a ordenar.
- La colección del personaje muestra primero su portada; sin portada configurada,
  usa la primera foto. Sin fotos, conserva espacio blanco, nombre y consulta.
- Para elegir portada, cambia `cover` dentro del personaje en
  `src/gallery-config.json` por el nombre sin extensión: `"cover": "001-retrato"`.
- Las referencias de `presentation` usan `personaje/nombre-sin-extension`.
  Controlan imágenes de presentación de la página, no la lista de la galería.
- Añadir una foto no exige editar listas. Para describirla mejor, añade una entrada
  a `photoDetails` en `src/content.ts`, describiendo la fotografía real:

```ts
"cenicienta/001-retrato": {
  alt: "Descripción accesible de lo que muestra la fotografía",
  caption: "Texto visible opcional",
  position: "center 20%",
},
```

El ejemplo es una plantilla: sustituye los textos por descripciones reales.
`caption` y `position` son opcionales. Sin entrada editorial, se utiliza un
texto alternativo básico del personaje y no aparece caption.
Los captions de tarjetas se configuran por separado en el catálogo.

## 4. Sustituir, renombrar o eliminar

- **Sustituir:** reemplaza el original conservando nombre y extensión. Revisa que
  el texto alternativo siga siendo válido. La preparación genera nuevas URLs
  basadas en el contenido.
- **Renombrar o mover:** actualiza cualquier `cover`, referencia de
  `presentation` y clave de `photoDetails` que usara la ruta anterior.
- **Eliminar:** retira el original, limpia sus textos opcionales y cambia o retira
  la portada afectada. Una imagen de presentación debe apuntar a otra existente.
- Ejecuta de nuevo la preparación y las comprobaciones. Los derivados obsoletos se
  retiran automáticamente; no se borran logo ni otros recursos públicos.

## 5. Problemas habituales

| Problema                                 | Cómo continuar                                                                                                       |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Carpeta desconocida                      | Usa un identificador del catálogo; para un personaje nuevo, actualiza primero el catálogo con información confirmada |
| Archivo o subcarpeta no admitido         | Retira subcarpetas, videos u otros formatos; usa una imagen estática admitida                                        |
| Nombre duplicado                         | Cambia el nombre sin extensión; cambiar solo mayúsculas o formato no basta                                           |
| Falta una foto de portada o presentación | Restaura el archivo o corrige la referencia exacta en el catálogo                                                    |
| Error de conversión                      | Abre y exporta de nuevo el archivo como JPG válido; revisa la ruta indicada por el error                             |
| No aparece en desarrollo                 | Ejecuta la preparación y recarga, o reinicia Vite                                                                    |
| No aparece en producción                 | Comprueba rama, último commit y build; solo integrar en main actualiza producción                                    |
| Push rechazado                           | Confirma acceso y rama; actualiza sin sobrescribir cambios ajenos                                                    |

La preparación corrige orientación y genera WebP de hasta 320, 480, 800 y
1200 píxeles sin ampliar imágenes pequeñas. Los resultados
`public/images/galeria/` y `src/generated/` son automáticos y se ignoran en Git.
Los errores de conversión conservan los resultados anteriores; corrige el original
y vuelve a ejecutar. Un build fallido no constituye una publicación correcta.
