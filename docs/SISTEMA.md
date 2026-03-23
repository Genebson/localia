# Localia — Guía de Usuario

## Introducción

Localia es un ecosistema inmobiliario digital que conecta compradores, vendedores y agentes inmobiliarios en Mercedes, provincia de Buenos Aires, Argentina. La plataforma incluye un portal de búsqueda (B2C), herramientas para agentes (CRM), y funcionalidades adicionales como masterplans interactivos y staging virtual.

---

## Roles de Usuario

Localia tiene dos tipos de cuenta:

| Rol          | Descripción                       | Funcionalidades                                                                 |
| ------------ | --------------------------------- | ------------------------------------------------------------------------------- |
| **Buscador** | Usuario estándar                  | Buscar propiedades, guardar favoritos, publicar búsquedas en el Tablero         |
| **Agente**   | Corredor inmobiliario matriculado | Todas las anteriores + publicar propiedades, ChePibe CRM, acceso a herramientas |

Para registrarse como agente se requiere una matrícula profesional válida.

---

## Navegación Principal

El menú superior (Header) siempre está visible e incluye:

- **Comprar / Alquilar** — Filtra por tipo de operación
- **Herramientas** (dropdown) — Acceso a Masterplans, Tablero, Furnisher y ChePibe
- **Iniciar sesión / Registrarse** — Autenticación
- **Publicar propiedad** — Solo visible para agentes

---

## Página de Inicio (`/`)

La página principal muestra las propiedades destacadas con un sistema de filtros avanzado.

### Buscador rápido

En la parte superior hay un buscador con:

- Ciudad, barrio o dirección
- Cantidad de habitaciones
- Botón "Buscar"

### Tipo de propiedad

Botones para filtrar por categoría:

- Departamentos
- Casas
- Terrenos

### Filtros avanzados (sidebar izquierdo)

Todos los filtros se encuentran en el sidebar. Cada sección se puede expandir:

**Operación**

- Todas
- Comprar
- Alquilar

**Estado**

- Obra nueva
- Buen estado
- A reformer

**Habitaciones y baños**

- Botones 0, 1, 2, 3, 4+ para dormitorios
- Botones 1, 2, 3+ para baños

**Zona** (Mercedes, Buenos Aires)

- Cerca de la plaza — Centro histórico, cercanía a Plaza San Martín
- Barrio Norte — Zona norte de Mercedes, Barrio San Martín
- Barrio Sur — Zona sur de Mercedes, Barrio Progreso
- Zona del Club — Cerca del Jockey Club y Estadio Municipal
- Centro — Centro de Mercedes, Av. Principal, zona peatonal
- Aire libre (checkbox para propiedades con espacio exterior)

**Características**

- Admite mascotas
- Aire acondicionado
- Armarios empotrados
- Ascensor
- Balcón / Terraza
- Exterior
- Garaje
- Jardín
- Piscina
- Trastero
- Vivienda accesible

**Equipamiento**

- Amueblado
- Solo cocina equipada

**Fecha de publicación**

- Últimas 24 horas
- La última semana
- El último mes

Los filtros se sincronizan con la URL, por lo que se puede compartir un resultado de búsqueda copiando la dirección.

Para limpiar todos los filtros, hacer clic en "Limpiar" en la parte superior del sidebar.

### Tarjetas de propiedad

Cada propiedad en el grid muestra:

- Imagen
- Badge "Destacado" (si aplica)
- Tipo de operación (Venta / Alquiler)
- Título
- Precio
- Ubicación
- Fecha de publicación (relativa: "Hoy", "Ayer", "Hace 3 días")
- Dormitorios, baños y metros cuadrados
- Botón de favorito (corazón)

---

## Detalle de Propiedad (`/property/[id]`)

Al hacer clic en una tarjeta se abre la página de detalle con:

- Galería de imágenes
- Título, precio y ubicación
- Atributos (dormitorios, baños, superficie, antigüedad)
- Descripción
- Características como tags
- Amenities con iconos (para Chacras, Quintas y Galpones)
- Badge de tipología interior (Chacra / Quinta / Galpón)
- Botones "Contactar agente" y "Agendar visita"
- Datos del agente a cargo

---

## Autenticación

El modal de autenticación permite iniciar sesión o registrarse. Se accede desde el botón "Iniciar sesión" en el Header.

### Tipos de cuenta disponibles al registrarse:

1. **Buscador** — Acceso estándar a la plataforma
2. **Agente inmobiliario** — Requiere matrícula profesional

---

## Publicar Propiedad (`/publicar`) — Agentes

Solo los usuarios con rol de agente pueden acceder a esta sección.

### Métodos de publicación

Se puede publicar de tres formas:

1. **Formulario** — Completar todos los campos manualmente
2. **Subir archivo** — Arrastrar o seleccionar un archivo PDF/Word con los datos de la propiedad
3. **Desde URL** — Ingresar un enlace para extraer datos automáticamente

### Campos del formulario

- Título de la propiedad
- Descripción
- Operación (Venta / Alquiler)
- Moneda (USD / ARS)
- Precio
- Ubicación y dirección
- Tipo (Departamento, Casa, PH, Terreno, etc.)
- Dormitorios, baños y superficie

### Imágenes

Se pueden subir hasta 5 fotos de la propiedad.

### Distribución a otros portales

Después de publicar, hay botones para compartir la misma propiedad en:

- ZonaProp
- ArgenProp
- MercadoLibre

Tras publicar exitosamente, aparece la opción de ver la publicación o ir a "Mis propiedades".

---

## Mis Propiedades (`/mis-propiedades`) — Agentes

Página que muestra todas las propiedades publicadas por el agente logueado, incluyendo las creadas a través del formulario y las que se encuentran en localStorage del navegador.

Para cada propiedad se puede:

- Ver los detalles
- Editar los datos
- Eliminar la publicación

---

## Perfil (`/perfil`)

Desde "Mi perfil" en el menú de usuario, el agente puede:

- Ver sus datos personales y de contacto
- Crear su propia página de inmobiliaria (Inmobiliaria personal)
- Editar los datos de la inmobiliaria

### Crear Inmobiliaria

El agente puede generar una landing page personalizada con:

- Logo y banner
- Descripción de la inmobiliaria
- Lista de propiedades exclusivas del agente
- Datos del equipo (nombre, rol, teléfono)
- Botón de WhatsApp
- Enlace directo: `/inmobiliaria/[nombre-slug]`

---

## Masterplans (`/masterplan`)

Sección que muestra loteos y desarrollos inmobiliarios disponibles.

### Lista de loteos

Tarjetas con:

- Imagen del loteo
- Nombre y ubicación
- Descripción breve
- Cantidad de parcelas disponibles
- Rango de precios

### Detalle de loteo (`/masterplan/[id]`)

Al hacer clic en un loteo se abre el plano interactivo con:

- **SVG parcelado** — Plano del terreno dividido en parcelas numeradas
- **Colores por estado:**
    - Verde: Disponible
    - Amarillo: Reservado
    - Rojo: Vendido
- **Hover sobre parcela** — Muestra tooltip con manzana, lote y precio
- **Click en parcela** — Abre modal con detalles y botón de contacto por WhatsApp
- **Sidebar** — Lista de parcelas disponibles para consulta rápida

---

## Tablero de Búsquedas (`/tablero`)

Cartelera pública donde los buscadores publican qué tipo de propiedad están buscando.

### Información de cada posteo

- Avatar e iniciales del buscado
- Nombre y hace cuánto tiempo publicó
- Tipo de propiedad buscada
- Presupuesto
- Zona deseada
- Descripción de la búsqueda
- Botón "Contactar" — Abre WhatsApp con mensaje prearmado

### Filtros

Botones para filtrar por tipo:

- Todas
- Casa
- Departamento
- Terreno
- Galpón
- Local
- Chacra
- Quinta
- Oficina

### Publicar búsqueda

Cualquier usuario logueado puede publicar una búsqueda. Los campos son:

- Nombre
- Tipo de propiedad
- Presupuesto
- Zona
- Descripción

---

## ChePibe CRM (`/chepibe`) — Agentes

Herramienta de CRM que simula la integración con WhatsApp.

### Características

- **Layout tipo WhatsApp** con panel de conversaciones
- **3 conversaciones mockeadas** mostrando el flujo real del CRM:
    1. Lead que consulta una propiedad → ChePibe pide presupuesto → se registra en CRM
    2. Agente envía un mensaje formateado para un cliente
    3. Agente consulta por propiedades disponibles → ChePibe busca y responde
- **Input para interactuar** — Envía mensajes mock que reciben respuestas automáticas
- **Badge "CRM Conectado"**

### Acceso

Solo usuarios con rol de agente pueden acceder. Si un buscador intenta entrar, será redirigido.

---

## Furnisher (`/furnisher`)

Herramienta de staging virtual con inteligencia artificial (mock).

### Características

- **Header**: "Mejorá tus fotos con IA"
- **3 ejemplos before/after**:
    - Living vacío → Living amueblado (Estilo Escandinavo)
    - Dormitorio desordenado → Limpio y modernizado (Estilo Moderno)
    - Casa de época → Diseño moderno (Wipe & Replace)
- **Slider interactivo** — Arrastrar para comparar antes y después
- **Estilos disponibles**: Escandinavo, Minimalista, Moderno, Nórdico, Industrial
- **Botón "Aplicar a mi foto"** — Simula la carga de una imagen propia
- **Badge "Powered by Furnisher.ai"**

### Acceso

Disponible para todos los usuarios (no requiere autenticación).

---

## Landing de Inmobiliaria (`/inmobiliaria/[slug]`)

Páginas públicas personalizadas para cada inmobiliaria.

### Elementos de la landing

- Logo e imagen de banner
- Nombre y tagline de la inmobiliaria
- Descripción "Sobre nosotros"
- Grid de propiedades exclusivas de esa inmobiliaria
- Equipo (foto, nombre, cargo, teléfono)
- Botón "Contactar por WhatsApp" (flotante)
- Datos de contacto (teléfono, email)

### Acceso

Cualquier persona puede acceder. No requiere autenticación. Si el slug no existe, muestra página 404.

---

## Sistema de Filtros

### Cómo funcionan los filtros

Los filtros en el sidebar izquierdo son acumulativos. Al seleccionar múltiples filtros de distintas categorías, se aplica una condición AND entre ellas.

### Sincronización con URL

Cada filtro seleccionado actualiza la URL automáticamente (ejemplo: `/?operation=buy&estado=nueva&features=airConditioning`). Esto permite:

- Compartir resultados de búsqueda exactos
- Usar el botón atrás del navegador
- Recargar la página sin perder los filtros aplicados

### Limpiar filtros

El botón "Limpiar" en la parte superior del sidebar restaura todos los filtros a sus valores por defecto sin recargar la página.

### Propiedades con datos completos

Todas las propiedades mockeadas incluyen datos para todos los filtros:

- `estado`: nueva, bueno, reformar
- `publishedAt`: fechas en los últimos 30 días
- `equipamiento`: amueblado o cocina-equipada
- Booleanos: `airConditioning`, `petFriendly`, `elevator`, `balcony`, `outdoor`, `garage`, `garden`, `pool`, `storageRoom`, `accessible`

---

## Notas Técnicas

- **Frontend only** — No hay backend real. Todos los datos son mockeados con localStorage y stores de Svelte.
- **Ubicación**: Todas las propiedades mockeadas se encuentran en Mercedes, provincia de Buenos Aires, Argentina.
- **Dev server**: `npm run dev` en el directorio `/localia`
- **URL base**: `http://localhost:5173/localia/`
- **Filtros guardados en URL** — La URL refleja el estado de los filtros para poder compartir búsquedas.
- **Favoritos y propiedades guardadas** — Se almacenan en localStorage del navegador.

---

## Estructura de Rutas

| Ruta                   | Descripción                     | Acceso  |
| ---------------------- | ------------------------------- | ------- |
| `/`                    | Homepage con búsqueda y filtros | Público |
| `/property/[id]`       | Detalle de propiedad            | Público |
| `/masterplan`          | Lista de loteos                 | Público |
| `/masterplan/[id]`     | Plano interactivo de loteo      | Público |
| `/tablero`             | Cartelera de búsquedas          | Público |
| `/furnisher`           | Staging virtual con IA          | Público |
| `/publicar`            | Formulario de publicación       | Agentes |
| `/mis-propiedades`     | Propiedades del agente          | Agentes |
| `/perfil`              | Perfil y gestión de agencia     | Agentes |
| `/chepibe`             | CRM de WhatsApp                 | Agentes |
| `/inmobiliaria/[slug]` | Landing de inmobiliaria         | Público |
