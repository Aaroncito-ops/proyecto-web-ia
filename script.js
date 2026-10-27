
/* ==================================================
   RICK AND MORTY: MULTIVERSE EXPLORER

   TAREA 3 - ETAPA 3
   API REST + BUSCADOR + FILTROS + FAVORITOS

   Tecnologías:
   - JavaScript puro
   - Fetch API
   - Manipulación del DOM
   - localStorage

   Pendiente:
   - Ordenamiento alfabético
   - Paginación
================================================== */

(() => {
    "use strict";

    // ==========================================
    // 1. CONFIGURACIÓN GENERAL
    // ==========================================

    const API_URL = "https://rickandmortyapi.com/api/character";

    const STORAGE_KEY = "multiverse-explorer-favorites-v1";

    // Elementos del explorador
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");

    const statusFilter = document.getElementById("statusFilter");
    const speciesFilter = document.getElementById("speciesFilter");

    const charactersGrid = document.getElementById("charactersGrid");
    const favoritesGrid = document.getElementById("favoritesGrid");

    const resultsCount = document.getElementById("resultsCount");
    const statusMessage = document.getElementById("statusMessage");

    // Comprobar los elementos necesarios
    if (
        !searchInput ||
        !searchButton ||
        !statusFilter ||
        !speciesFilter ||
        !charactersGrid ||
        !favoritesGrid ||
        !resultsCount ||
        !statusMessage
    ) {
        console.error(
            "Multiverse Explorer: faltan elementos HTML necesarios."
        );

        return;
    }

    const searchForm = searchInput.closest("form");

    // Permite cancelar búsquedas anteriores
    let activeController = null;

    // Resultados actuales del explorador
    let personajesActuales = [];

    // Map evita favoritos duplicados mediante el ID
    const favoritos = new Map();

    // Información sobre errores de almacenamiento
    let avisoAlmacenamiento = "";

    // Mensaje accesible dentro de la sección favoritos
    const favoritesNotice = document.createElement("p");

    favoritesNotice.className = "status-message";
    favoritesNotice.setAttribute("role", "status");
    favoritesNotice.setAttribute("aria-live", "polite");

    favoritesGrid.before(favoritesNotice);

    // ==========================================
    // 2. MENSAJES DEL EXPLORADOR
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

        statusMessage.textContent = mensaje;
    }

    // ==========================================
    // 3. LIMPIAR RESULTADOS DE BÚSQUEDA
    // ==========================================

    function limpiarResultados() {
        personajesActuales = [];

        charactersGrid.replaceChildren();

        resultsCount.textContent = "0";

        // Evita mostrar el texto decorativo del CSS
        charactersGrid.style.display = "none";
    }

    // ==========================================
    // 4. CONSTRUIR CONSULTA A LA API
    // ==========================================

    function construirConsulta() {
        const nombre = searchInput.value.trim();
        const estado = statusFilter.value;
        const especie = speciesFilter.value;

        const url = new URL(API_URL);

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
    // 5. VALIDAR TEXTOS
    // ==========================================

    function textoSeguro(valor, respaldo = "Desconocido") {
        if (typeof valor !== "string") {
            return respaldo;
        }

        const texto = valor.trim();

        return texto === "" ? respaldo : texto;
    }

    // ==========================================
    // 6. VALIDAR URL DE IMAGEN
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
                url.port === "" &&
                url.username === "" &&
                url.password === "" &&
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
    // 7. NORMALIZAR INFORMACIÓN DE PERSONAJES
    // ==========================================

    function normalizarPersonaje(personaje) {
        if (
            !personaje ||
            typeof personaje !== "object" ||
            Array.isArray(personaje)
        ) {
            return null;
        }

        // Cada personaje necesita un ID válido de la API
        if (
            !Number.isSafeInteger(personaje.id) ||
            personaje.id <= 0
        ) {
            return null;
        }

        // Guardar únicamente los datos necesarios
        return {
            id: personaje.id,

            name: textoSeguro(
                personaje.name,
                "Personaje sin nombre"
            ),

            status: textoSeguro(
                personaje.status,
                "unknown"
            ),

            species: textoSeguro(personaje.species),

            origin: {
                name: textoSeguro(
                    personaje.origin?.name
                )
            },

            image: obtenerImagenSegura(personaje.image) || ""
        };
    }

    // ==========================================
    // 8. RECUPERAR FAVORITOS DE LOCALSTORAGE
    // ==========================================

    function cargarFavoritosGuardados() {
        try {
            const datosGuardados = window.localStorage.getItem(
                STORAGE_KEY
            );

            if (datosGuardados === null) {
                favoritos.clear();
                avisoAlmacenamiento = "";
                return;
            }

            const datos = JSON.parse(datosGuardados);

            if (!Array.isArray(datos)) {
                throw new Error(
                    "Los favoritos almacenados tienen un formato inválido."
                );
            }

            const favoritosRecuperados = new Map();

            datos.forEach((elemento) => {
                const personaje = normalizarPersonaje(elemento);

                if (personaje) {
                    // El ID funciona como clave única
                    favoritosRecuperados.set(
                        personaje.id,
                        personaje
                    );
                }
            });

            favoritos.clear();

            favoritosRecuperados.forEach((personaje, id) => {
                favoritos.set(id, personaje);
            });

            avisoAlmacenamiento = "";

        } catch (error) {
            console.warn(
                "No se pudieron recuperar los favoritos:",
                error
            );

            // No bloquear la aplicación si falla la lectura
            // y conservar lo que ya exista en memoria.
            avisoAlmacenamiento =
                "No fue posible leer los favoritos guardados. " +
                "Puedes seguir usando la colección durante esta sesión.";
        }
    }

    // ==========================================
    // 9. GUARDAR FAVORITOS EN LOCALSTORAGE
    // ==========================================

    function guardarFavoritos() {
        try {
            // Convertir el Map en un arreglo
            const coleccion = Array.from(favoritos.values());

            // Convertir los datos a formato JSON
            const datosJSON = JSON.stringify(coleccion);

            // Guardar los favoritos en el navegador
            window.localStorage.setItem(
                STORAGE_KEY,
                datosJSON
            );

            avisoAlmacenamiento = "";

            return true;

        } catch (error) {
            console.warn(
                "No se pudieron guardar los favoritos:",
                error
            );

            // La colección continúa funcionando en memoria
            avisoAlmacenamiento =
                "No fue posible guardar los cambios en el navegador. " +
                "Puedes seguir utilizando favoritos, pero los cambios " +
                "podrían perderse al recargar la página.";

            return false;
        }
    }

    // ==========================================
    // 10. CONSULTAR SI UN PERSONAJE ES FAVORITO
    // ==========================================

    function esFavorito(id) {
        return favoritos.has(id);
    }

    // ==========================================
    // 11. CONFIGURAR BOTÓN DE FAVORITOS
    // ==========================================

    function configurarBotonFavorito(boton, id, nombre) {
        const seleccionado = esFavorito(id);

        boton.textContent = seleccionado
            ? "Quitar de favoritos"
            : "Añadir a favoritos";

        boton.setAttribute(
            "aria-pressed",
            String(seleccionado)
        );

        boton.setAttribute(
            "aria-label",
            seleccionado
                ? `Quitar a ${nombre} de favoritos`
                : `Añadir a ${nombre} a favoritos`
        );

        boton.title = seleccionado
            ? "Eliminar personaje de mi colección"
            : "Guardar personaje en mi colección";
    }

    // ==========================================
    // 12. SINCRONIZAR BOTONES DE LAS DOS SECCIONES
    // ==========================================

    function actualizarBotonesFavoritos() {
        const botones = document.querySelectorAll(
            ".favorite-button[data-character-id]"
        );

        botones.forEach((boton) => {
            const id = Number(boton.dataset.characterId);

            const nombre =
                boton.dataset.characterName || "personaje";

            configurarBotonFavorito(
                boton,
                id,
                nombre
            );
        });
    }

    // ==========================================
    // 13. MOSTRAR LA COLECCIÓN DE FAVORITOS
    // ==========================================

    function mostrarFavoritos() {
        const fragmento = document.createDocumentFragment();

        favoritos.forEach((personaje) => {
            const tarjeta = crearTarjeta(personaje);

            fragmento.appendChild(tarjeta);
        });

        favoritesGrid.replaceChildren(fragmento);

        // Cuando está vacío, mostrar mensaje accesible
        if (favoritos.size === 0) {
            favoritesGrid.style.display = "none";
        } else {
            favoritesGrid.style.removeProperty("display");
        }

        // Estilo del mensaje de la colección
        favoritesNotice.classList.remove(
            "is-loading",
            "is-error",
            "is-success"
        );

        if (avisoAlmacenamiento !== "") {
            favoritesNotice.classList.add("is-error");
        } else if (favoritos.size > 0) {
            favoritesNotice.classList.add("is-success");
        }

        let mensaje;

        if (favoritos.size === 0) {
            mensaje =
                "Tu colección multiversal está vacía. " +
                "Explora personajes y agrégalos a favoritos.";

        } else if (favoritos.size === 1) {
            mensaje =
                "Tienes 1 personaje en tu colección multiversal.";

        } else {
            mensaje =
                `Tienes ${favoritos.size} personajes ` +
                "en tu colección multiversal.";
        }

        if (avisoAlmacenamiento !== "") {
            mensaje += " " + avisoAlmacenamiento;
        }

        favoritesNotice.textContent = mensaje;

        // Actualizar también los botones del explorador
        actualizarBotonesFavoritos();
    }

    // ==========================================
    // 14. AGREGAR O QUITAR FAVORITOS
    // ==========================================

    function alternarFavorito(personaje) {
        const personajeSeguro = normalizarPersonaje(personaje);

        if (!personajeSeguro) {
            console.warn(
                "No se puede guardar un personaje sin ID válido."
            );
            return;
        }

        const id = personajeSeguro.id;

        if (esFavorito(id)) {
            // Quitar personaje de favoritos
            favoritos.delete(id);

        } else {
            // Agregar personaje a favoritos
            favoritos.set(id, personajeSeguro);
        }

        // Guardar cambios, sin bloquear la interfaz
        guardarFavoritos();

        // Reconstruir la colección y sincronizar botones
        mostrarFavoritos();
    }

    // ==========================================
    // 15. CREAR FILAS DE INFORMACIÓN
    // ==========================================

    function crearDetalle(etiqueta, valor) {
        const fila = document.createElement("div");

        const termino = document.createElement("dt");
        termino.textContent = etiqueta;

        const descripcion = document.createElement("dd");
        descripcion.textContent = textoSeguro(valor);

        fila.append(
            termino,
            descripcion
        );

        return fila;
    }

    // ==========================================
    // 16. CREAR IMAGEN ALTERNATIVA
    // ==========================================

    function crearImagenAlternativa(nombre) {
        const alternativa = document.createElement("div");

        alternativa.className = "character-card__image";

        alternativa.setAttribute("role", "img");

        alternativa.setAttribute(
            "aria-label",
            `Imagen no disponible de ${nombre}`
        );

        alternativa.textContent = "Imagen no disponible";

        return alternativa;
    }

    // ==========================================
    // 17. CREAR TARJETAS DE PERSONAJES
    // ==========================================

    function crearTarjeta(personaje) {

        // Contenedor principal
        const tarjeta = document.createElement("article");
        tarjeta.className = "character-card";

        const nombre = textoSeguro(
            personaje.name,
            "Personaje sin nombre"
        );

        // --------------------------------------
        // Imagen
        // --------------------------------------

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

            // Si la imagen deja de estar disponible
            imagen.addEventListener("error", () => {
                imagen.replaceWith(
                    crearImagenAlternativa(nombre)
                );
            }, { once: true });

            tarjeta.appendChild(imagen);

        } else {
            tarjeta.appendChild(
                crearImagenAlternativa(nombre)
            );
        }

        // --------------------------------------
        // Contenido
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
            Object.prototype.hasOwnProperty.call(
                estados,
                estadoOriginal
            )
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

        const especie = textoSeguro(
            personaje.species
        );

        const origen = textoSeguro(
            personaje.origin?.name
        );

        informacion.append(
            crearDetalle("Especie", especie),
            crearDetalle("Origen", origen)
        );

        // --------------------------------------
        // Botón funcional de favoritos
        // --------------------------------------

        const pie = document.createElement("div");
        pie.className = "character-card__footer";

        const botonFavorito = document.createElement("button");

        botonFavorito.type = "button";
        botonFavorito.className = "favorite-button";

        botonFavorito.dataset.characterId = String(
            personaje.id
        );

        botonFavorito.dataset.characterName = nombre;

        configurarBotonFavorito(
            botonFavorito,
            personaje.id,
            nombre
        );

        // Evento para agregar o quitar personaje
        botonFavorito.addEventListener("click", () => {
            const estabaEnColeccion =
                favoritesGrid.contains(botonFavorito);

            alternarFavorito(personaje);

            // Mantener un destino de foco accesible
            // si el botón fue eliminado de la colección.
            if (estabaEnColeccion) {
                const siguienteBoton = favoritesGrid.querySelector(
                    ".favorite-button"
                );

                if (siguienteBoton) {
                    siguienteBoton.focus();
                } else {
                    const tituloFavoritos = document.getElementById(
                        "favoritesTitle"
                    );

                    if (tituloFavoritos) {
                        tituloFavoritos.setAttribute("tabindex", "-1");
                        tituloFavoritos.focus();
                    }
                }
            }
        });

        pie.appendChild(botonFavorito);

        // --------------------------------------
        // Construir tarjeta completa
        // --------------------------------------

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
    // 18. MOSTRAR PERSONAJES DEL EXPLORADOR
    // ==========================================

    function mostrarPersonajes(personajes) {
        personajesActuales = personajes;

        const fragmento = document.createDocumentFragment();

        personajesActuales.forEach((personaje) => {
            const tarjeta = crearTarjeta(personaje);

            fragmento.appendChild(tarjeta);
        });

        charactersGrid.replaceChildren(fragmento);

        charactersGrid.style.removeProperty("display");

        // Total de personajes realmente mostrados
        resultsCount.textContent = String(
            personajesActuales.length
        );

        // Sincronizar los favoritos que ya existían
        actualizarBotonesFavoritos();
    }

    // ==========================================
    // 19. CONSULTAR API CON FETCH
    // ==========================================

    async function cargarPersonajes() {

        // Cancelar búsqueda anterior
        if (activeController) {
            activeController.abort();
        }

        const controller = new AbortController();
        activeController = controller;

        const consulta = construirConsulta();

        limpiarResultados();

        mostrarMensaje(
            "Abriendo portal interdimensional... Cargando personajes.",
            "loading"
        );

        try {
            // Solicitud a la API pública
            const respuesta = await fetch(consulta.url, {
                method: "GET",

                headers: {
                    Accept: "application/json"
                },

                signal: controller.signal
            });

            // Ignorar solicitudes canceladas
            if (controller.signal.aborted) {
                return;
            }

            // Búsqueda sin coincidencias
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

            // Comprobar errores HTTP
            if (!respuesta.ok) {
                throw new Error(
                    `La API respondió con el error HTTP ${respuesta.status}.`
                );
            }

            let datos;

            try {
                // Convertir JSON a objeto JavaScript
                datos = await respuesta.json();

            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }

                throw new Error(
                    "La API devolvió una respuesta JSON inválida."
                );
            }

            if (controller.signal.aborted) {
                return;
            }

            // Validar estructura de respuesta
            if (
                !datos ||
                !Array.isArray(datos.results)
            ) {
                throw new Error(
                    "La respuesta de la API no tiene el formato esperado."
                );
            }

            // Manejar resultados vacíos
            if (datos.results.length === 0) {
                mostrarMensaje(
                    "La consulta no devolvió personajes."
                );
                return;
            }

            // Normalizar personajes obtenidos
            const personajes = datos.results
                .map(normalizarPersonaje)
                .filter((personaje) => personaje !== null);

            if (personajes.length === 0) {
                throw new Error(
                    "La API no devolvió personajes válidos."
                );
            }

            // Mostrar personajes en la cuadrícula
            mostrarPersonajes(personajes);

            mostrarMensaje(
                `Exploración completada: ${personajes.length} ` +
                "personajes mostrados en esta página.",
                "success"
            );

        } catch (error) {

            // Ignorar cancelaciones voluntarias
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

            // Error de conexión
            if (error instanceof TypeError) {
                mostrarMensaje(
                    "No fue posible conectar con la API. " +
                    "Revisa tu conexión a Internet e inténtalo de nuevo. " +
                    "Tus favoritos guardados permanecen disponibles.",
                    "error"
                );

            } else {
                // Error HTTP o de formato
                mostrarMensaje(
                    `${error.message} Inténtalo nuevamente. ` +
                    "Tus favoritos no se han eliminado.",
                    "error"
                );
            }

            // No borrar favoritos por un error de la API

        } finally {
            if (activeController === controller) {
                activeController = null;
            }
        }
    }

    // ==========================================
    // 20. EVENTOS DEL BUSCADOR
    // ==========================================

    // Botón Buscar
    searchButton.addEventListener(
        "click",
        cargarPersonajes
    );

    // Búsqueda al presionar Enter
    if (searchForm) {
        searchForm.addEventListener("submit", (evento) => {
            evento.preventDefault();
            cargarPersonajes();
        });
    }

    // Filtro por estado
    statusFilter.addEventListener(
        "change",
        cargarPersonajes
    );

    // Filtro por especie
    speciesFilter.addEventListener(
        "change",
        cargarPersonajes
    );

    // ==========================================
    // 21. SINCRONIZACIÓN ENTRE PESTAÑAS
    // ==========================================

    // Si otra pestaña modifica los favoritos
    // del mismo sitio, actualizar esta colección.
    window.addEventListener("storage", (evento) => {
        if (
            evento.key === STORAGE_KEY ||
            evento.key === null
        ) {
            cargarFavoritosGuardados();
            mostrarFavoritos();
        }
    });

    // ==========================================
    // 22. INICIALIZACIÓN DE LA APLICACIÓN
    // ==========================================

    // Primero recuperar los favoritos locales
    cargarFavoritosGuardados();

    // Mostrar colección sin depender de la API
    mostrarFavoritos();

    // Después consultar los personajes en Internet
    cargarPersonajes();

})();
