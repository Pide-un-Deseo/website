# Pide un Deseo — Website

Repositorio para el desarrollo de la web de **Pide un Deseo**.

[Repositorio en GitHub](https://github.com/Pide-un-Deseo/website)

## Estado actual

El proyecto está en preparación inicial. Contiene las reglas de exclusión de Git
y la documentación para comenzar a colaborar. Todavía no hay una aplicación
ejecutable ni funcionalidades implementadas.

| Decisión | Estado |
| --- | --- |
| Requisitos del negocio y alcance del MVP | Pendientes de definir con el responsable del negocio |
| Diseño y contenido | Pendientes |
| Stack y herramientas de desarrollo | Pendientes |
| Comandos de instalación, desarrollo y pruebas | Pendientes de elegir el stack |
| Hosting, dominio y despliegue | Pendientes |

El `.gitignore` inicial incluye exclusiones habituales de Node.js; esto no implica
que se haya elegido un framework o una arquitectura.

## Cómo colaborar

1. Lee [AGENTS.md](AGENTS.md) antes de realizar cambios.
2. Parte de `main` actualizada y crea una rama descriptiva para cada tarea, por
   ejemplo `feat/service-catalog`, `fix/mobile-navigation` o `chore/tooling`.
3. Realiza cambios pequeños y usa commits descriptivos, por ejemplo
   `docs: clarify project requirements`.
4. Revisa el diff y ejecuta las comprobaciones disponibles para tu cambio. Mientras
   solo exista documentación, revisa Markdown, enlaces y `git diff --check`.
5. Publica la rama y abre un pull request cuando corresponda, explicando qué cambia
   y cómo lo verificaste. Revisa los cambios antes de integrarlos en `main`.

La rama de preparación de JD3M0N es `chore/jd3m0n-project-setup`. Las siguientes
tareas deben usar sus propias ramas una vez integrada esta preparación.

No subas credenciales ni datos personales de clientes. Cuando el proyecto necesite
variables de entorno, documenta sus nombres con valores ficticios en `.env.example`.

## Próximos pasos

- Acordar los requisitos y el alcance inicial con el responsable de Pide un Deseo.
- Elegir el stack y documentar la instalación y ejecución local.
- Implementar las funcionalidades acordadas y sus comprobaciones.
- Definir el despliegue y documentarlo cuando exista.

Estos pasos son trabajo pendiente, no capacidades actuales del proyecto.

## Autoría

- Organización propietaria: [Pide un Deseo](https://github.com/Pide-un-Deseo).
- Preparación inicial y desarrollo web: [JD3M0N](https://github.com/JD3M0N).

El historial de commits y los pull requests documentarán las contribuciones reales.
