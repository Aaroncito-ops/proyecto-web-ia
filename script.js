
/* ==================================================
   RICK AND MORTY: MULTIVERSE EXPLORER

   TAREA 3 - ETAPA 2
   CONEXIÓN CON API Y EXPLORADOR DE PERSONAJES

   Tecnologías:
   - JavaScript puro
   - Fetch API
   - DOM

   No incluye favoritos ni localStorage.
================================================== */

(() => {
    "use strict";

    // ==========================================
    // 1. CONFIGURACIÓN GENERAL
    // ==========================================

    const API_URL = "https://rickandmortyapi.com/api/character";

    // Elementos existentes en index.html
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");

    const statusFilter = document.getElementById("statusFilter");
    const speciesFilter = document.getElementById("speciesFilter");

    const charactersGrid = document.getElementById("charactersGrid");
    const resultsCount = document.getElementById("resultsCount");
    const statusMessage = document.getElementById("statusMessage");

    // Validar que los elementos HTML existan
    if (
        !searchInput ||
        !searchButton ||
        !statusFilter ||
        !speciesFilter ||
        !charactersGrid ||
        !resultsCount ||
        !statusMessage
    ) {
        console.error(
            "Multiverse Explorer: faltan elementos HTML necesarios."
        );
        return;
    }

    const searchForm = searchInput.closest("form");

    // Control para cancelar búsquedas anteriores
    let activeController = null;

    // ==========================================
    // 2. MENSAJES DE ESTADO
    // ==========================================

    function mostrarMensaje(mensaje, tipo = "info") {
        statusMessage.classList.remove(
            "is-loading",
            "is-error",
            "is-success"
        );

        if (tipo === "loading") {
            statusMessage.classList.add("is-loading");
        }

        if (tipo === "error") {
            statusMessage.classList.add("is-error");
        }

        if (tipo === "success") {
            statusMessage.classList.add("is-success");
        }

        // textContent evita interpretar el texto como HTML
        statusMessage.textContent = mensaje;
    }

    // ==========================================
    // 3. LIMPIAR RESULTADOS
    // ==========================================

    function limpiarResultados() {
        charactersGrid.replaceChildren();

        resultsCount.textContent = "0";

        // Oculta el mensaje decorativo del CSS
        // cuando no hay tarjetas disponibles.
        charactersGrid.style.display = "none";
    }

    // ==========================================
    // 4. CONSTRUIR URL DE BÚSQUEDA
    // ==========================================

    function construirConsulta() {
        const nombre = searchInput.value.trim();
        const estado = statusFilter.value;
        const especie = speciesFilter.value;

        const url = new URL(API_URL);

        // Agregar parámetros solo si tienen valor
        if (nombre !== "") {
            url.searchParams.set("name", nombre);
        }

        if (estado !== "") {
            url.searchParams.set("status", estado);
        }

        if (especie !== "") {
            url.searchParams.set("species", especie);
        }

        return {
            url: url.toString(),
            tieneFiltros: Boolean(nombre || estado || especie)
        };
    }

    // ==========================================
    // 5. VALIDAR TEXTOS DE LA API
    // ==========================================

    function textoSeguro(valor, respaldo = "Desconocido") {
        if (typeof valor !== "string") {
            return respaldo;
        }

        const texto = valor.trim();

        return texto === "" ? respaldo : texto;
    }

    // ==========================================
    // 6. VALIDAR IMÁGENES DE LA API
    // ==========================================

    function obtenerImagenSegura(direccion) {
        if (typeof direccion !== "string") {
            return null;
        }

        try {
            const url = new URL(direccion);

            const rutaValida =
                /^\/api\/character\/avatar\/\d+\.(jpeg|jpg|png|webp)$/i
                    .test(url.pathname);

            if (
                url.protocol === "https:" &&
                url.hostname === "rickandmortyapi.com" &&
                rutaValida &&
                url.search === "" &&
                url.hash === ""
            ) {
                return url.href;
            }

            return null;

        } catch (error) {
            return null;
        }
    }

    // ==========================================
    // 7. CREAR FILAS DE INFORMACIÓN
    // ==========================================

    function crearDetalle(etiqueta, valor) {
        const fila = document.createElement("div");

        const termino = document.createElement("dt");
        termino.textContent = etiqueta;

        const descripcion = document.createElement("dd");
        descripcion.textContent = textoSeguro(valor);

        fila.append(termino, descripcion);

        return fila;
    }

    // ==========================================
    // 8. CREAR TARJETA DE PERSONAJE
    // ==========================================

    function crearTarjeta(personaje) {

        // Contenedor principal
        const tarjeta = document.createElement("article");
        tarjeta.className = "character-card";

        // --------------------------------------
        // Imagen del personaje
        // --------------------------------------

        const nombre = textoSeguro(
            personaje.name,
            "Personaje sin nombre"
        );

        const imagenURL = obtenerImagenSegura(
            personaje.image
        );

        if (imagenURL) {
            const imagen = document.createElement("img");

            imagen.className = "character-card__image";
            imagen.src = imagenURL;
            imagen.alt = `Retrato de ${nombre}`;
            imagen.loading = "lazy";
            imagen.decoding = "async";

            tarjeta.appendChild(imagen);

        } else {
            // Alternativa accesible si la URL no es válida
            const imagenAlternativa = document.createElement("div");

            imagenAlternativa.className =
                "character-card__image";

            imagenAlternativa.setAttribute("role", "img");
            imagenAlternativa.setAttribute(
                "aria-label",
                `Imagen no disponible de ${nombre}`
            );

            tarjeta.appendChild(imagenAlternativa);
        }

        // --------------------------------------
        // Contenido de la tarjeta
        // --------------------------------------

        const contenido = document.createElement("div");
        contenido.className = "character-card__content";

        // Nombre
        const titulo = document.createElement("h3");
        titulo.className = "character-card__name";
        titulo.textContent = nombre;

        // --------------------------------------
        // Estado
        // --------------------------------------

        const estado = document.createElement("span");
        estado.className = "character-card__status";

        const estadoOriginal = textoSeguro(
            personaje.status,
            "unknown"
        ).toLowerCase();

        const estados = {
            alive: "Vivo",
            dead: "Muerto",
            unknown: "Desconocido"
        };

        const estadoNormalizado =
            Object.hasOwn(estados, estadoOriginal)
                ? estadoOriginal
                : "unknown";

        estado.textContent = estados[estadoNormalizado];

        estado.classList.add(
            `character-card__status--${estadoNormalizado}`
        );

        // --------------------------------------
        // Especie y origen
        // --------------------------------------

        const informacion = document.createElement("dl");
        informacion.className = "character-card__meta";

        const especie = textoSeguro(personaje.species);

        const origen = textoSeguro(
            personaje.origin?.name
        );

        informacion.append(
            crearDetalle("Especie", especie),
            crearDetalle("Origen", origen)
        );

        // --------------------------------------
        // Pie de tarjeta
        // --------------------------------------

        const pie = document.createElement("div");
        pie.className = "character-card__footer";

        // Solo marcador visual para otra etapa.
        // No guarda ni modifica favoritos.
        const botonFavorito = document.createElement("button");

        botonFavorito.type = "button";
        botonFavorito.className = "favorite-button";
        botonFavorito.textContent = "Favoritos próximamente";
        botonFavorito.disabled = true;

        botonFavorito.title =
            "Esta función se implementará en una etapa posterior.";

        pie.appendChild(botonFavorito);

        // Construir tarjeta completa
        contenido.append(
            titulo,
            estado,
            informacion,
            pie
        );

        tarjeta.appendChild(contenido);

        return tarjeta;
    }

    // ==========================================
    // 9. MOSTRAR PERSONAJES EN PANTALLA
    // ==========================================

    function mostrarPersonajes(personajes) {
        const fragmento = document.createDocumentFragment();

        personajes.forEach((personaje) => {
            const tarjeta = crearTarjeta(personaje);
            fragmento.appendChild(tarjeta);
        });

        // Reemplaza resultados anteriores
        charactersGrid.replaceChildren(fragmento);

        // Reactivar cuadrícula CSS
        charactersGrid.style.removeProperty("display");

        // Mostrar únicamente el total renderizado
        resultsCount.textContent = String(personajes.length);
    }

    // ==========================================
    // 10. CONSULTAR LA API CON FETCH
    // ==========================================

    async function cargarPersonajes() {

        // Cancelar petición anterior si existe
        if (activeController) {
            activeController.abort();
        }

        const controller = new AbortController();
        activeController = controller;

        const consulta = construirConsulta();

        // Preparar interfaz
        limpiarResultados();

        mostrarMensaje(
            "Abriendo portal interdimensional... Cargando personajes.",
            "loading"
        );

        try {

            // Solicitud HTTP GET a la API
            const respuesta = await fetch(consulta.url, {
                method: "GET",
                headers: {
                    Accept: "application/json"
                },
                signal: controller.signal
            });

            // La API utiliza 404 para búsquedas sin coincidencias
            if (
                respuesta.status === 404 &&
                consulta.tieneFiltros
            ) {
                mostrarMensaje(
                    "No se encontraron personajes con esos criterios. " +
                    "Prueba con otro nombre, estado o especie."
                );
                return;
            }

            // Errores HTTP diferentes de una búsqueda vacía
            if (!respuesta.ok) {
                throw new Error(
                    `La API respondió con el error HTTP ${respuesta.status}.`
                );
            }

            // Convertir respuesta JSON a objeto JavaScript
            let datos;

            try {
                datos = await respuesta.json();

            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }

                throw new Error(
                    "La API devolvió una respuesta JSON inválida."
                );
            }

            // Evitar mostrar resultados de una petición cancelada
            if (controller.signal.aborted) {
                return;
            }

            // Comprobar estructura de la respuesta
            if (
                !datos ||
                !Array.isArray(datos.results)
            ) {
                throw new Error(
                    "La respuesta de la API no tiene el formato esperado."
                );
            }

            // Manejar respuestas vacías
            if (datos.results.length === 0) {
                mostrarMensaje(
                    "La consulta no devolvió personajes."
                );
                return;
            }

            // Eliminar elementos inválidos
            const personajes = datos.results.filter(
                (personaje) =>
                    personaje !== null &&
                    typeof personaje === "object" &&
                    !Array.isArray(personaje)
            );

            if (personajes.length === 0) {
                throw new Error(
                    "La API no devolvió personajes válidos."
                );
            }

            // Dibujar tarjetas con la información real
            mostrarPersonajes(personajes);

            mostrarMensaje(
                `Exploración completada: ${personajes.length} ` +
                "personajes mostrados en esta página.",
                "success"
            );

        } catch (error) {

            // No mostrar errores de cancelaciones voluntarias
            if (
                controller.signal.aborted ||
                error.name === "AbortError"
            ) {
                return;
            }

            console.error(
                "Multiverse Explorer - Error al consultar API:",
                error
            );

            limpiarResultados();

            // Mensaje para errores de red
            if (error instanceof TypeError) {
                mostrarMensaje(
                    "No fue posible conectar con la API. " +
                    "Revisa tu conexión a Internet e inténtalo de nuevo.",
                    "error"
                );

            } else {
                // Error HTTP o respuesta inválida
                mostrarMensaje(
                    `${error.message} Inténtalo nuevamente.`,
                    "error"
                );
            }

        } finally {

            // Liberar controlador solo si es la petición actual
            if (activeController === controller) {
                activeController = null;
            }
        }
    }

    // ==========================================
    // 11. EVENTOS DE BÚSQUEDA
    // ==========================================

    // Buscar al presionar el botón
    searchButton.addEventListener(
        "click",
        cargarPersonajes
    );

    // Permitir buscar también al presionar Enter
    if (searchForm) {
        searchForm.addEventListener("submit", (evento) => {
            evento.preventDefault();
            cargarPersonajes();
        });
    }

    // Actualizar resultados al cambiar el estado
    statusFilter.addEventListener(
        "change",
        cargarPersonajes
    );

    // Actualizar resultados al cambiar la especie
    speciesFilter.addEventListener(
        "change",
        cargarPersonajes
    );

    // ==========================================
    // 12. CARGA INICIAL
    // ==========================================

    // Consultar personajes al abrir la página
    cargarPersonajes();

})();
