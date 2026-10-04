# Guía de desarrollo

Estas instrucciones se aplican a todo el repositorio. Las instrucciones más
específicas de un `AGENTS.md` en un subdirectorio se aplican a ese ámbito.

## Contexto y alcance

- Este repositorio contiene la web estática en español de Pide un Deseo, animación infantil en La Habana.
- Stack: React + TypeScript estricto + Vite, npm, CSS propio y Cloudflare Pages. Sin backend.
- Consulta el README y el código existente antes de trabajar. Mantén el stack y la arquitectura estática acordados.
- No presentes funcionalidades previstas como implementadas ni inventes contenido
  del negocio, precios, testimonios o resultados.

## Código y dependencias

- Haz cambios pequeños y centrados en la tarea. Evita refactorizaciones ajenas.
- Usa nombres descriptivos y componentes o funciones con una responsabilidad clara.
- Sigue las convenciones existentes y reutiliza soluciones antes de crear otras.
- Justifica las nuevas dependencias por una necesidad concreta. Mantén el archivo
  de bloqueo del gestor elegido y evita mezclar gestores de paquetes.
- Cuando se defina el stack, documenta las versiones requeridas y los comandos
  reales de instalación, desarrollo, comprobación y compilación.
- Comenta decisiones y restricciones relevantes, sin repetir lo que dice el código.

## Interfaz, accesibilidad y rendimiento

- Diseña primero para móvil y adapta la interfaz a pantallas mayores sin desbordes.
- Usa HTML semántico, jerarquía coherente de encabezados y controles nativos.
- Asegura navegación por teclado, foco visible, etiquetas de formularios, contraste
  legible y textos alternativos adecuados; respeta la reducción de movimiento.
- Contempla estados de carga, vacío, éxito y error cuando correspondan. Los errores
  deben explicar cómo continuar y ser accesibles a tecnologías de asistencia.
- Optimiza tamaño y formato de imágenes, declara sus dimensiones y carga de forma
  diferida las que no sean prioritarias. Evita JavaScript y peticiones innecesarias.
- Al implementar páginas públicas, añade títulos y descripciones útiles. Configura
  metadatos sociales, URLs canónicas, sitemap y robots según el dominio y despliegue
  reales; no inventes URLs de producción ni datos estructurados del negocio.

## Seguridad y datos

- Nunca subas credenciales, tokens, archivos `.env` ni datos personales de clientes.
  Usa datos ficticios para ejemplos y pruebas.
- Documenta las variables necesarias en `.env.example`, con valores de ejemplo sin
  secretos. No incluyas claves privadas en código enviado al navegador.
- Cuando existan formularios o backend, valida entradas en el servidor; la validación
  del navegador mejora la experiencia, pero no sustituye la del servidor.
- Trata las entradas como datos no confiables, evita inyección de HTML y consultas
  inseguras, y no expongas datos sensibles en errores o registros.
- Implementa autorización en el servidor para acciones restringidas y protecciones
  contra abuso según los endpoints que se incorporen. Recoge solo datos necesarios.

## Validación y documentación

- Añade pruebas proporcionadas al riesgo y al comportamiento: prioriza flujos
  importantes, regresiones y errores. No añadas pruebas que solo repitan el código.
- Ejecuta las comprobaciones disponibles que correspondan al cambio: formato, lint,
  tipos, pruebas y compilación. No inventes comandos que el proyecto no tenga.
- Para cambios de interfaz, revisa móvil y escritorio, teclado y estados relevantes.
- Para cambios solo de documentación, revisa contenido, enlaces y `git diff --check`;
  no hace falta incorporar herramientas o pruebas de aplicación.
- Actualiza la documentación cuando cambien requisitos, configuración o comandos.
- Al entregar, explica qué cambió, qué comprobaste y cualquier limitación. Indica
  expresamente las verificaciones que no pudieron ejecutarse.

## Git y colaboración

- Trabaja en ramas descriptivas, como `feat/<tema>`, `fix/<tema>` o `chore/<tema>`.
  Integra cambios mediante pull requests; evita commits directos en `main`.
- Usa commits pequeños y descriptivos con prefijos como `feat:`, `fix:` y `docs:`.
  Mantén la autoría asociada a la cuenta real de quien hace el trabajo.
- Revisa el diff antes de confirmar: incluye solo archivos de la tarea y comprueba
  que no haya secretos, artefactos generados ni cambios accidentales.
- Respeta cambios locales de otras personas. No reescribas historial compartido
  ni hagas force push sin una instrucción explícita.
- Describe en cada pull request el problema, el resultado y su validación. No abras
  pull requests ni publiques despliegues si la tarea no lo incluye.

## Convenciones específicas de esta web

- Edita textos en `src/content.ts`; personajes, portadas y referencias de presentación
  están en `src/gallery-config.json`, compartido con el procesador. Utiliza
  `whatsappUrl` para todo contacto. Nunca
  conviertas una consulta en una confirmación automática de reserva.
- Conserva las tarjetas del catálogo, incluidas las cuatro actualmente sin foto
  (Elsa, Anna, Barbie y Bella): espacio blanco, nombre y
  enlace útiles. No inventes fotografías de personajes ni testimonios.
- `material-pide-un-deseo/` es material local ignorado. No lo copies completo ni lo
  publiques. Solo imágenes revisadas de las animadoras pasan a `public/images`.
- No publiques fotografías de niños. Los videos de referencia permanecen locales.
- Los originales revisados de `galeria/<personaje>/` se versionan. `gallery:prepare`
  genera las variantes WebP y el catálogo antes de build, dev, tipos y pruebas.
  No versiones `public/images/galeria/` ni `src/generated/`, ni copies originales
  al sitio publicado. La compilación debe funcionar desde un checkout limpio
  sin depender de `material-pide-un-deseo/`.
- `prepare:media` sigue siendo manual para logo, favicon y portada social, nunca
  un requisito de build; esos recursos públicos siguen versionados.
- Las fuentes son locales. Evita feeds sociales, reproducción automática y scripts
  de terceros que aumenten el coste de datos móviles.
- Mantén el prerenderizado: no uses `window`, `document` o valores aleatorios durante
  render. Accede al navegador solo en efectos o eventos.
- Comprueba `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` y
  `npm run test:e2e`. Chromium se instala con `npx playwright install chromium`.
  Si la descarga falla y Chrome ya está instalado, usa `PLAYWRIGHT_CHANNEL=chrome`.
- En Cloudflare configura `SITE_URL` con el origen real. Las vistas previas no se
  indexan. No presentes un subdominio sugerido como una publicación existente.
- Revisa móvil (360 y 390), tablet (768) y escritorio (1440), teclado, galería,
  retorno del foco, imágenes y contenido sin JavaScript antes de entregar.

## Guías de mantenimiento

- Consulta [la guía de fotos](docs/subir-fotos.md) y [mantenimiento](docs/mantenimiento.md).
- Mantén los resultados históricos de validación identificados como históricos; documenta solo las nuevas comprobaciones ejecutadas.
