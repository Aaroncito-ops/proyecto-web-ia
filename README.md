# Rick and Morty: Multiverse Explorer

**Tarea 3 — Explorador interactivo de información**

**Repositorio:** https://github.com/Aaroncito-ops/proyecto-web-ia

**Página publicada:** https://aaroncito-ops.github.io/proyecto-web-ia/

**Integrantes:** [Agregar nombres completos de los integrantes del equipo]

**Cuenta responsable del repositorio:** Aaroncito-ops

## 1. Descripción del proyecto

Rick and Morty: Multiverse Explorer es una aplicación web interactiva inspirada en la serie animada Rick and Morty.

Su objetivo es consultar información real de personajes mediante una API pública y permitir que los usuarios exploren sus características, realicen búsquedas, apliquen filtros y organicen una colección de favoritos.

La interfaz tiene una temática espacial con portales interdimensionales, efectos visuales futuristas y colores inspirados en la serie.

## 2. Tecnologías utilizadas

- **HTML5:** estructura y organización del contenido.
- **CSS3:** diseño, animaciones y adaptación a distintos dispositivos.
- **JavaScript:** interacción, búsquedas, filtros y favoritos.
- **Fetch API:** consultas de personajes desde Internet.
- **localStorage:** almacenamiento local de favoritos.
- **GitHub:** control de versiones, commits, Issues y Pull Requests.
- **GitHub Pages:** publicación de la aplicación.
- **ChatGPT Plus:** asistencia para generar, revisar, explicar y corregir código.

**API utilizada:** https://rickandmortyapi.com/documentation

## 3. Funcionalidades implementadas

1. Consulta de personajes mediante `fetch()`.
2. Visualización de 20 personajes por página consultada.
3. Tarjetas con imagen, nombre, estado, especie y origen.
4. Búsqueda de personajes por nombre.
5. Filtros por estado y especie.
6. Mensajes de carga, errores y resultados vacíos.
7. Sistema para agregar y eliminar favoritos.
8. Persistencia de favoritos utilizando `localStorage`.
9. Interfaz adaptable a computadoras y celulares.
10. Ordenamiento alfabético de personajes de A-Z y Z-A.

El ordenamiento corresponde a la funcionalidad adicional implementada después de la primera versión.

## 4. Instrucciones de uso

1. Abrir la página desde el enlace de GitHub Pages.
2. Presionar "Abrir el explorador" para consultar personajes.
3. Escribir un nombre en el buscador y presionar "Buscar".
4. Utilizar los filtros para seleccionar estado o especie.
5. Seleccionar "Añadir a favoritos" para guardar un personaje.
6. Acceder a "Mi colección multiversal" para visualizar los favoritos.
7. Utilizar "Quitar de favoritos" para eliminar personajes de la colección.
8. Cambiar el selector de ordenamiento para organizar los resultados.

Los favoritos se guardan en el navegador mediante localStorage, por lo que pueden conservarse después de actualizar o cerrar la página, siempre que el almacenamiento local no se borre.

## 5. Estructura del proyecto

**index.html:** estructura principal de la página, buscador, filtros, selector de ordenamiento y secciones de personajes y favoritos.

**style.css:** estilos visuales, colores, animaciones, diseño espacial y reglas responsive.

**script.js:** conexión con la API, procesamiento de personajes, eventos, filtros, ordenamiento y almacenamiento de favoritos.

**README.md:** documentación del proyecto, prompts, dificultades y explicación del desarrollo.

## 6. Uso de inteligencia artificial: prompts importantes

Durante el desarrollo se utilizó ChatGPT Plus para orientar la creación del proyecto y resolver dificultades. Los siguientes textos recogen las instrucciones principales de tres de los prompts utilizados.

### Prompt 1 — Diseño inicial

"Actúa como diseñador UI/UX y desarrollador frontend especializado en HTML5 y CSS3. Estoy desarrollando una actividad universitaria llamada Explorador interactivo de información, basada en la API pública de Rick and Morty.

Quiero crear una experiencia web inmersiva y visualmente profesional, completamente tematizada en el universo de Rick and Morty, bajo el nombre Rick and Morty: Multiverse Explorer.

Usa fondo espacial oscuro, estrellas, tonos azules profundos, verde portal luminoso y detalles futuristas. Incluye encabezado, sección hero, buscador, filtros, cuadrícula de personajes, favoritos y pie de página.

Genera index.html y style.css con diseño responsive. No escribas personajes manualmente y no implementes todavía la lógica JavaScript.

Entrega código listo para copiar manualmente desde la interfaz web de GitHub, acompañado de explicaciones."

**Objetivo:** desarrollar la estructura visual inicial del proyecto.

### Prompt 2 — Conexión con la API

"Actúa como desarrollador frontend senior y tutor de programación.

Estoy realizando mi Tarea 3 universitaria: Rick and Morty: Multiverse Explorer.

Ya tengo index.html y style.css creados en GitHub.

Implementa JavaScript puro utilizando fetch() para consultar https://rickandmortyapi.com/api/character.

Muestra al menos 10 personajes con imagen, nombre, estado, especie y origen. Implementa un buscador por nombre, filtros de estado y especie, contador de resultados y mensajes para errores de conexión o búsquedas sin coincidencias.

Respeta los identificadores existentes del HTML y las clases CSS de las tarjetas.

No implementes todavía favoritos ni localStorage. Proporciona el código de script.js y explica las funciones principales."

**Objetivo:** conectar la aplicación a una fuente real de datos y permitir búsquedas interactivas.

### Prompt 3 — Sistema de favoritos

"Actúa como desarrollador frontend senior y tutor de programación.

Mi proyecto Rick and Morty: Multiverse Explorer ya está publicado y muestra personajes obtenidos desde la API.

Implementa un sistema de favoritos utilizando JavaScript puro y localStorage.

Permite agregar y eliminar personajes, mostrar la colección dentro de favoritesGrid y conservar los favoritos después de recargar la página.

Evita duplicados usando el ID de los personajes, sincroniza los botones del explorador y de favoritos, y muestra un mensaje cuando la colección esté vacía.

Mantén la búsqueda, los filtros, fetch() y el diseño existente. Reutiliza las funciones del código actual y explica cómo se guardan y recuperan los datos."

**Objetivo:** permitir que los usuarios construyan una colección de personajes persistente.

### Prompt adicional — Ordenamiento alfabético

Se solicitó orientación para agregar un selector con las opciones "Orden original", "Nombre A-Z" y "Nombre Z-A", utilizando `sort()` y `localeCompare()`.

La implementación se desarrolló en la rama `feature/ordenamiento-alfabetico` y posteriormente se integró mediante el Pull Request #3.

## 7. Respuesta de IA que requirió correcciones

Durante la implementación del ordenamiento alfabético, una modificación al código JavaScript dejó un operador lógico `||` adicional al final de la condición que verificaba los elementos HTML.

Esto provocaba un error de sintaxis que podía impedir el funcionamiento de JavaScript.

**Corrección realizada:** se eliminó el operador innecesario y se conservó la validación correcta de `sortOrder`.

La corrección quedó registrada en el commit "Fix formatting issue in error handling condition".

Esta experiencia permitió comprender que el código generado con IA debe revisarse antes de integrarse al proyecto.

## 8. Error encontrado y solución

**Problema:** después de implementar los favoritos, la página seguía mostrando los botones deshabilitados con el mensaje "Favoritos próximamente".

**Causa identificada:** el navegador seguía mostrando una versión anterior del archivo JavaScript.

**Solución:** se actualizó la referencia del script agregando un parámetro de versión (`script.js?v=3`) y se recargó la aplicación.

Posteriormente se comprobó visualmente que era posible agregar personajes a la colección y eliminarlos.

También se identificaron mensajes desactualizados en la sección de favoritos. Este problema quedó documentado mediante el Issue #1.

## 9. Modificación adicional explicada: ordenamiento alfabético

La funcionalidad adicional permite organizar alfabéticamente los personajes mostrados en la página actual.

**Funcionamiento:**

1. El usuario selecciona una opción de ordenamiento.
2. JavaScript obtiene los personajes previamente cargados.
3. Se crea una copia del arreglo utilizando el operador de propagación (`[...personajes]`).
4. El método `sort()` organiza los elementos.
5. `localeCompare()` compara los nombres alfabéticamente.
6. La cuadrícula se actualiza sin volver a consultar la API.

Crear una copia permite conservar el orden original de los resultados.

Esta modificación no altera los favoritos, porque estos se administran de forma independiente mediante un `Map` y se guardan en localStorage.

## 10. Control de versiones y trabajo en GitHub

Durante el desarrollo se registraron más de seis commits que muestran la creación y modificación de los archivos.

**Issues documentados:**

- Issue #1: corregir mensajes desactualizados de favoritos. Cerrado.
- Issue #2: implementar ordenamiento alfabético. Cerrado.

**Pull Request:**

- PR #3: implementar ordenamiento alfabético de personajes. Fusionado con la rama main.

Enlaces:

- https://github.com/Aaroncito-ops/proyecto-web-ia/issues/1
- https://github.com/Aaroncito-ops/proyecto-web-ia/issues/2
- https://github.com/Aaroncito-ops/proyecto-web-ia/pull/3

Los cambios se registraron mediante el historial de GitHub utilizando su editor web.

## 11. Pruebas del proyecto

Las siguientes comprobaciones permiten evaluar las funcionalidades principales:

- Visualización de los personajes obtenidos de la API.
- Búsqueda de personajes por nombre.
- Filtrado por estado y especie.
- Agregar y eliminar personajes de favoritos.
- Comprobar que localStorage conserve favoritos después de recargar.
- Ordenamiento original, A-Z y Z-A.
- Mensaje cuando una búsqueda no tiene resultados.
- Adaptación visual en dispositivos móviles.
- Publicación correcta en GitHub Pages.

Se verificó visualmente la carga de personajes, la colección de favoritos y la opción de ordenamiento A-Z. Las demás pruebas deben confirmarse individualmente antes de la entrega.

## 12. Reflexión sobre el uso de inteligencia artificial

El desarrollo de este proyecto permitió comprender cómo la inteligencia artificial puede apoyar la programación web.

ChatGPT ayudó a organizar las etapas del proyecto, proponer estructuras de código, explicar conceptos y detectar errores.

También aprendimos que las respuestas generadas por IA no siempre son correctas y que es necesario revisar, probar y comprender las modificaciones antes de utilizarlas.

Una parte importante del aprendizaje fue comprender la relación entre HTML, CSS y JavaScript, el uso de fetch() para obtener información externa y localStorage para conservar datos en el navegador.

Finalmente, GitHub permitió registrar los cambios mediante commits, documentar dificultades con Issues e integrar mejoras mediante Pull Requests.

## 13. Conclusión

Rick and Morty: Multiverse Explorer demuestra cómo desarrollar una aplicación web interactiva mediante tecnologías frontend y una API pública.

El proyecto integra búsqueda, filtros, favoritos persistentes y ordenamiento de personajes dentro de una interfaz temática.

La actividad permitió practicar programación web, control de versiones, resolución de errores y uso responsable de inteligencia artificial como herramienta de apoyo al desarrollo.
