# Añadir fotos

Copia fotografías revisadas de animadoras, sin niños, en la carpeta del personaje:

```text
galeria/cenicienta/001-retrato.jpg
galeria/rapunzel/001-jardin.png
```

Admite JPG, JPEG, PNG y WebP estáticos, con extensiones en mayúsculas o minúsculas.
No crees subcarpetas dentro de un personaje. Los nombres sin extensión deben ser
únicos dentro de cada carpeta, incluso si cambia el formato o las mayúsculas.
Puedes repetir un nombre en personajes diferentes.

Los originales de esta carpeta se suben a Git. Antes de incorporarlos, revisa
la imagen completa: nunca copies automáticamente el material privado ni fotos
de niños. El proceso de conversión no revisa quién aparece en una fotografía.

## Preparación y publicación

```sh
npm run gallery:prepare
```

Este comando genera las imágenes optimizadas y el catálogo. También se ejecuta
automáticamente antes de `npm run dev`, `npm run typecheck`, `npm test` y
`npm run build`. Con el servidor local abierto, vuelve a ejecutar el comando
o reinicia desarrollo cuando añadas o cambies fotos.

Al llegar los originales a `main`, Cloudflare ejecuta `npm run build` y convierte
las fotos antes de publicar. No necesitas subir los WebP generados, editar una
lista de fotos ni configurar otro workflow. Las vistas previas usan el mismo flujo.
Si falla una conversión, el despliegue no se completa: corrige el archivo indicado
y vuelve a publicar el cambio.

Los derivados de `public/images/galeria/` y el catálogo de `src/generated/` son
automáticos y están ignorados en Git. No los edites. Los originales no se copian
al sitio público; los visitantes reciben únicamente las variantes WebP.

## Orden, portadas y textos

- La galería global sigue el orden de personajes de `src/gallery-config.json` y,
  dentro de cada personaje, el nombre con orden numérico (`2` antes que `10`).
  Usa prefijos `001`, `002`, etc. para ordenar tus fotos.
- Las colecciones individuales muestran primero su portada configurada. Sin
  portada explícita, usan la primera foto. Sin fotos, la tarjeta queda vacía.
- `cover` indica el nombre del archivo sin extensión dentro del personaje.
  `presentation` contiene referencias `personaje/nombre` usadas en la página.
  Si borras o renombras una de esas fotos, actualiza también su referencia.
- Las carpetas deben coincidir con los personajes registrados. Para dar de alta
  un personaje, añádelo primero al catálogo compartido.
- Los textos de fotos son opcionales en `photoDetails` de `src/content.ts`:

```ts
"cenicienta/001-retrato": {
  alt: "Descripción accesible de lo que muestra la fotografía",
  caption: "Texto visible opcional",
  position: "center 20%",
}
```

Sin esta entrada, la foto se publica igualmente y utiliza una descripción básica
del personaje como texto alternativo. No muestra caption. Los captions de las
tarjetas de personajes son independientes.

Al borrar, mover o sustituir archivos, la siguiente preparación reconstruye la
galería y retira los derivados obsoletos. No borra logo ni otros recursos públicos.
