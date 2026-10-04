# Rayko: cómo trabajar y publicar tus cambios

Tu rama se llama **`feat/rarkey`**. Ahí haces y pruebas los cambios.
**`main` es la versión que se publica en la web.**
Para pasar de tu rama a main, sube tus cambios y abre un pull request en GitHub:
es una pantalla para revisar e integrar la entrega.

## 1. Preparar el proyecto (solo la primera vez)

Necesitas Git, Node.js **22.23.2** y acceso de escritura al repositorio con tu
cuenta de GitHub. Abre una terminal en la carpeta donde quieras guardar el proyecto:

```sh
git clone https://github.com/Pide-un-Deseo/website.git
cd website
git switch --track origin/feat/rarkey
npm ci
npx playwright install chromium
```

Si ya tienes el proyecto, abre su carpeta `website` en tu editor y usa su terminal.
Si la rama local ya existe, basta con `git switch feat/rarkey`.
No vuelvas a clonar dentro del proyecto.

## 2. Antes de empezar cada día

Desde la carpeta `website`:

```sh
git status
git switch feat/rarkey
git pull --ff-only origin feat/rarkey
git fetch origin
git merge origin/main --no-edit
npm ci
npm run dev
```

**Si `git status` muestra cambios pendientes, guárdalos con un commit antes
de cambiar de rama o actualizar.** Si un comando falla, detente y revisa el error
antes de seguir. `git merge origin/main` trae a tu rama lo último de la web.

Abre la dirección que aparece en la terminal. Edita, guarda y revisa el resultado.
Deja esa terminal abierta; para detener el servidor pulsa **Ctrl+C**.

## 3. Dónde hacer los cambios

| Quieres cambiar…                         | Edita…                                         |
| ---------------------------------------- | ---------------------------------------------- |
| Textos, contacto o crédito de desarrollo | `src/content.ts`                               |
| Personajes y sus portadas                | `src/gallery-config.json`                      |
| Colores, tamaños y diseño                | `src/styles.css`                               |
| Estructura de las secciones              | `src/App.tsx`                                  |
| Fotografías                              | Sigue [la guía para subir JPG](subir-fotos.md) |

No subas fotos de niños, material privado, videos ni secretos.
No edites las imágenes generadas ni `src/generated/`.

## 4. Comprobar y subir a tu rama

Detén el servidor con **Ctrl+C** o abre otra terminal en `website`. Ejecuta:

```sh
npm run check
git diff --check
git status
git diff
```

`npm run check` comprueba código, pruebas, tipos mediante build, compilación y
navegador. Si falla, corrige el problema antes de publicar.
Revisa también la web en móvil y escritorio. Si solo cambias documentación,
basta con revisar el contenido, los enlaces y `git diff --check`.

Lee la lista de archivos de `git status` y el diff. Solo si **todos** pertenecen
a tu cambio y no hay material privado, ejecuta:

```sh
git add .
git diff --cached --stat
git commit -m "feat: describir aqui el cambio realizado"
git push
```

Cambia el mensaje por una descripción real, por ejemplo
`docs: aclarar como subir fotos` o `fix: corregir texto de contacto`.
Si hay archivos ajenos, usa `git add ruta/del/archivo` para añadir solo los tuyos.
Subir a `feat/rarkey` todavía no cambia la web de producción.

## 5. Pasar tus cambios a main y publicarlos

1. Abre [la comparación de tu rama con main](https://github.com/Pide-un-Deseo/website/compare/main...feat/rarkey).
2. Confirma **base: main** y **compare: feat/rarkey**.
3. Pulsa **Create pull request**. Pon un título claro y explica qué cambiaste y
   qué comprobaste. Si ya hay uno abierto de tu rama, los nuevos commits se
   añaden a él: revisa ese pull request.
4. Espera a que **Website checks** y la compilación de Cloudflare estén correctos.
   Revisa la vista previa enlazada por Cloudflare cuando esté disponible.
5. Pide revisión al responsable del proyecto. Cuando esté aprobado y puedas
   integrar, elige **Create a merge commit**, pulsa **Merge pull request** y
   después **Confirm merge**. Si no tienes permiso, lo hace el responsable.
6. **No borres `feat/rarkey`**: la seguirás usando.
7. Espera a que termine el despliegue de producción de Cloudflare y abre
   [la web](https://pideundeseo-cuba.pages.dev). Comprueba tus cambios, imágenes
   y enlaces de WhatsApp. Integrar en main inicia el despliegue, pero no significa
   que ya haya terminado.

## 6. Dejar tu rama lista para el siguiente cambio

Después de integrar, con la carpeta sin cambios pendientes:

```sh
git switch feat/rarkey
git fetch origin
git pull --ff-only origin feat/rarkey
git merge origin/main --no-edit
git push
```

Así tu rama incorpora también la integración de main y queda preparada para
seguir trabajando. No necesitas editar ni hacer push directamente en main.

## Si algo falla

- **No tienes acceso:** pide al propietario que compruebe los permisos de tu cuenta.
- **Git pide identidad:** configura tu propio nombre y correo de GitHub; no copies
  los de otro programador.
- **Hay conflictos o ramas divergentes:** detente y pide ayuda. No uses force push.
  Si estabas en una fusión con conflictos, `git merge --abort` la cancela.
- **Falta Chromium:** ejecuta `npx playwright install chromium`. Si la descarga
  falla y tienes Chrome, consulta la alternativa del [README](../README.md).
- **Un check o despliegue falla:** abre su log, corrige en `feat/rarkey` y vuelve
  a subir. No integres con errores.
- **No ves una foto nueva en local:** ejecuta `npm run gallery:prepare` o reinicia
  `npm run dev`.

Para más detalles, consulta [mantenimiento](mantenimiento.md).
