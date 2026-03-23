# Localia — Sprint Mockups Paralelo

## TL;DR

> **Summary**: Completar el ecosistema Localia con 3 sesiones paralelas: Portal B2C pulido, Features Interior (Masterplans + Tablero), e Integraciones Mock (ChePibe + Furnisher + Landing Inmobiliaria).
> **Deliverables**: 3 rutas nuevas completas + extensiones a sistema existente
> **Effort**: Medium
> **Parallel**: YES — 3 sesiones simultáneas
> **Critical Path**: Session A define extensiones de filters.ts primero → B y C pueden arrancar

---

## Context

### Estado Actual
- Portal B2C funcional (landing, búsqueda, filtros, detalle propiedad)
- CRM Agente funcional (publicar, editar, mis propiedades, auth)
- Motor bimonetario (USD/ARS)
- Distribución a portales (Zonaprop, Argenprop, ML)
- Sistema de diseño (Tailwind + CSS vars + Lucide)

### Lo Que Falta
- Filtros hiper-locales
- Masterplans interactivos (loteos)
- Tablero de búsquedas activas
- Landing pages por inmobiliaria
- ChePibe.ai mock
- Furnisher.ai mock
- Tipologías interior (Chacras, Quintas, Galpones)

---

## Work Objectives

### Core Objective
Completar 100% de UI mockups del ecosistema Localia, organizados en 3 sesiones paralelas con territorio de archivos no superpuesto.

### Deliverables por Sesión

**Sesión A — Portal B2C + Polish**
- Extender `properties.ts` con tipologías interior
- Extender `filters.ts` con filtros hiper-locales
- Agregar filtros "cerca de la plaza", "Barrio Sur", etc. en FiltersSidebar
- Mejorar detalle propiedad con datos más ricos

**Sesión B — Features Interior**
- `src/routes/masterplan/[id]/+page.svelte` — Plano interactivo de loteo
- `src/routes/tablero/+page.svelte` — Cartelera de búsquedas activas
- Mock data de loteos y búsquedas

**Sesión C — Integraciones Mock**
- `src/routes/chepibe/+page.svelte` — Chat WhatsApp mock del CRM
- `src/routes/furnisher/+page.svelte` — Before/After staging virtual
- `src/routes/inmobiliaria/[slug]/+page.svelte` — Landing page por inmobiliaria

### Definition of Done (verifiable conditions)

**Sesión A:**
- [ ] FiltersSidebar tiene filtros: "Cerca de la plaza", "Barrio Norte", "Zona Club"
- [ ] properties.ts incluye 3 Chacras, 2 Quintas, 2 Galpones
- [ ] Detalle propiedad muestra todos los nuevos campos

**Sesión B:**
- [ ] Masterplan permite hover por parcelas y muestra estado (disponible/reservada/vendida)
- [ ] Tablero muestra posteos de búsqueda con: tipo, presupuesto, zona, contacto
- [ ] Click en posteo abre WhatsApp con mensaje prearmado

**Sesión C:**
- [ ] ChePibe muestra conversación real de flujo CRM (lead capture, comandos, búsqueda)
- [ ] Furnisher tiene slider before/after con staging virtual
- [ ] Landing inmobiliaria tiene: logo, propiedades exclusivas, botón WhatsApp

### Must Have
- Header actualizado con links a nuevas rutas
- Navegación funcional entre todas las páginas
- Mock data creíble (Buenos Aires, precios realistas ARS/USD)

### Must NOT Have
- No backend real — todo es mock con localStorage/svelte stores
- No integrar APIs reales de ChePibe/Furnisher — simular solo UI
- No autenticación nueva — reuse auth store existente

---

## Verification Strategy

- Test decision: tests-after (QA manual)
- Cada sesión verifica sus propias rutas
- No hay tests automatizados en este sprint de mockups

---

## Execution Strategy

### Territorio de Archivos (CRÍTICO — evitar conflictos)

```
Session A — NO TOCA archivos de B o C:
├── src/lib/data/properties.ts (EXTEND)
├── src/lib/stores/filters.ts (EXTEND)
├── src/lib/components/FiltersSidebar.svelte (EXTEND)
├── src/routes/property/[id]/+page.svelte (IMPROVE)
└── src/routes/+page.svelte (POLISH)

Session B — ARCHIVOS NUEVOS, no conflictua con A ni C:
├── src/routes/masterplan/[id]/+page.svelte (NEW)
├── src/routes/tablero/+page.svelte (NEW)
├── src/lib/data/masterplans.ts (NEW)
└── src/lib/data/searches.ts (NEW)

Session C — ARCHIVOS NUEVOS, no conflictua con A ni B:
├── src/routes/chepibe/+page.svelte (NEW)
├── src/routes/furnisher/+page.svelte (NEW)
└── src/routes/inmobiliaria/[slug]/+page.svelte (NEW)
```

**Archivos COMPARTIDOS (lectura ok, escritura Coordinada):**
- `src/lib/components/Header.svelte` — Session A agrega links a nuevas rutas
- `src/app.css` — Si necesita extensiones, Session A lo hace

### Orden de Lanzamiento

**Primero (Wave 1):**
- Session A: Extender properties.ts y filters.ts + Header con nuevos links
- Una vez que A confirme extensiones hechas, B y C pueden arrancar

**Segundo (Wave 2):**
- Session A: FiltrosSidebar + polish
- Session B: Masterplans + Tablero
- Session C: ChePibe + Furnisher + Landing inmobiliaria

---

## TODOs

### Session A — Portal B2C + Polish

- [ ] A1. Extender properties.ts con tipologías interior

  **What to do**: Agregar al archivo `src/lib/data/properties.ts` 8 propiedades nuevas:
  - 3 Chacras (Carmen de Areco, Lobos, San Antonio de Areco)
  - 2 Quintas (Exaltación de la Cruz, Pilar)
  - 2 Galpones (Avellaneda, Lanús)
  - 1 Terreno grande (Nordelta)
  - Agregar campos: `features: string[]`, `outdoor: boolean`, `pool: boolean`

  **Must NOT do**: No modificar propiedades existentes de Buenos Aires

  **Recommended Agent Profile**:
  - Category: `visual-engineering`
  - Skills: [] — UI simple, no lógica compleja

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: B, C

  **References**:
  - Pattern: `src/lib/data/properties.ts:45-245` — formato de propiedad existente
  - Existing property: id `018d1a2b-3c4e-7f89-ab08-234567890ac3` — Chalet en Carmen de Areco (ya es del interior)

  **Acceptance Criteria**:
  - [ ] properties.ts tiene 8 propiedades nuevas con `propertyType` diferenciado
  - [ ] Nuevas propiedades tienen campos `features`, `outdoor`, `pool`

  **QA Scenarios**:
  ```
  Scenario: Nuevas propiedades aparecen en landing
    Tool: Bash
    Steps: |
      cd /Users/mauriciogenebrieres/programming/projects/freelance/localia/temp/localia
      npm run dev
      Abrir http://localhost:5173/
    Expected: Grid muestra propiedades del interior junto con Buenos Aires
    Evidence: .sisyphus/evidence/a1-properties-interior.{ext}
  ```

  **Commit**: YES | Message: `feat(data): add interior property types (chacras, quintas, galpones)` | Files: `src/lib/data/properties.ts`

- [ ] A2. Extender filters.ts con filtros hiper-locales

  **What to do**: En `src/lib/stores/filters.ts`, agregar al interface Filters:
  - `zone: '' | 'plaza' | 'barrio-norte' | 'barrio-sur' | 'zona-club' | 'centro'`
  - Actualizar DEFAULT_FILTERS y derived filteredProperties para filtrar por zona

  **Must NOT do**: No romper filtros existentes — solo agregar nuevos

  **Recommended Agent Profile**:
  - Category: `visual-engineering`
  - Skills: [] — Store extension simple

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: B, C (necesitan filters actualizado para saber qué campos existen)

  **References**:
  - Pattern: `src/lib/stores/filters.ts:6-30` — interface Filters existente

  **Acceptance Criteria**:
  - [ ] Filters interface tiene campo `zone`
  - [ ] filteredProperties filtra por zona si está seteado

  **QA Scenarios**:
  ```
  Scenario: Filtro zona Plaza filtra correctamente
    Tool: Bash
    Steps: |
      cd /Users/mauriciogenebrieres/programming/projects/freelance/localia/temp/localia
      npm run dev
      Agregar ?zone=plaza a URL
    Expected: Solo propiedades con "plaza" en location aparecen
    Evidence: .sisyphus/evidence/a2-zone-filter.{ext}
  ```

  **Commit**: YES | Message: `feat(filters): add hyper-local zone filter` | Files: `src/lib/stores/filters.ts`

- [ ] A3. Actualizar Header con links a nuevas rutas

  **What to do**: En `src/lib/components/Header.svelte`, agregar al nav:
  - "Masterplans" → `/masterplan`
  - "Tablero" → `/tablero`
  - "ChePibe" → `/chepibe` (solo visible si isAgent)
  - Dropdown o sección "Herramientas" con: Furnisher, Landing Inmobiliaria

  **Must NOT do**: No cambiar estilo visual del Header existente

  **Recommended Agent Profile**:
  - Category: `visual-engineering`
  - Skills: [] — Componente UI existente

  **Parallelization**: Can Parallel: YES | Wave 1

  **References**:
  - Pattern: `src/lib/components/Header.svelte` — Header existente

  **Acceptance Criteria**:
  - [ ] Header tiene links funcionales a /masterplan, /tablero, /chepibe, /furnisher, /inmobiliaria/test

  **QA Scenarios**:
  ```
  Scenario: Links de navegación funcionan
    Tool: Bash
    Steps: |
      npm run dev
      Click en cada link del Header
    Expected: Navega a la ruta correcta sin errores 404
    Evidence: .sisyphus/evidence/a3-header-links.{ext}
  ```

  **Commit**: YES | Message: `feat(nav): add links to new routes` | Files: `src/lib/components/Header.svelte`

- [ ] A4. Extender FiltersSidebar con filtros de zona

  **What to do**: En `src/lib/components/FiltersSidebar.svelte`, agregar sección "Zona" con botones de filtro:
  - "Cerca de la plaza"
  - "Barrio Norte"
  - "Barrio Sur"
  - "Zona del Club"
  - "Centro"
  - "Aire libre" (toggle que filtra properties con outdoor: true)

  **Must NOT do**: No remover filtros existentes

  **Recommended Agent Profile**:
  - Category: `visual-engineering`
  - Skills: [] — Componente existente con extensión

  **Parallelization**: Can Parallel: YES | Wave 2

  **References**:
  - Pattern: `src/lib/components/FiltersSidebar.svelte` — Sidebar existente
  - Pattern: `src/routes/+page.svelte:42-64` — botones de tipo de propiedad

  **Acceptance Criteria**:
  - [ ] FiltersSidebar tiene nueva sección "Zona" con 5 opciones
  - [ ] Toggle "Aire libre" visible en filtros

  **QA Scenarios**:
  ```
  Scenario: Filtros de zona aplicables
    Tool: Bash
    Steps: |
      npm run dev
      Abrir filtros
      Click "Cerca de la plaza"
      Click "Aplicar"
    Expected: Grid filtra por zona
    Evidence: .sisyphus/evidence/a4-zone-filter-sidebar.{ext}
  ```

  **Commit**: YES | Message: `feat(filters): add zone filters to sidebar` | Files: `src/lib/components/FiltersSidebar.svelte`

- [ ] A5. Mejorar detalle propiedad con más datos

  **What to do**: En `src/routes/property/[id]/+page.svelte`, mejorar la vista:
  - Mostrar todos los features de la propiedad como tags
  - Mostrar amenities con iconos (pool, garden, garage, outdoor)
  - Si es Chacra/Quinta/Galpón, mostrar badge de tipología interior

  **Must NOT do**: No cambiar estructura de la página radicalmente

  **Recommended Agent Profile**:
  - Category: `visual-engineering`
  - Skills: [] — Página existente con mejora

  **Parallelization**: Can Parallel: YES | Wave 2

  **References**:
  - Pattern: `src/routes/property/[id]/+page.svelte` — Detalle existente
  - Pattern: `src/lib/components/PropertyCard.svelte` — Cards con features

  **Acceptance Criteria**:
  - [ ] Detalle propiedad muestra features como pills
  - [ ] Amenities con iconos (pool, garden, garage)
  - [ ] Badge de tipología para Chacras/Quintas/Galpones

  **QA Scenarios**:
  ```
  Scenario: Detalle muestra features de propiedad interior
    Tool: Bash
    Steps: |
      npm run dev
      Buscar propiedad con features (chacra)
      Abrir detalle
    Expected: Muestra todos los features como tags + amenities
    Evidence: .sisyphus/evidence/a5-property-detail.{ext}
  ```

  **Commit**: YES | Message: `feat(property): show all features and amenities` | Files: `src/routes/property/[id]/+page.svelte`

---

### Session B — Features Interior

- [ ] B1. Crear Masterplan interactivo de loteo

  **What to do**: Crear `src/routes/masterplan/[id]/+page.svelte`:
  - Plano SVG de loteo con 20+ parcelas
  - Hover sobre parcela muestra tooltip: "Manzana X Lote Y — USD 45.000"
  - Color de parcela según estado: verde=disponible, amarillo=reservado, rojo=vendido
  - Sidebar con lista de parcelas disponibles
  - Click en parcela abre modal con detalles + botón WhatsApp
  - Mock data: 2 loteos (Loteo "El Sol" y "La Esperanza")

  **Must NOT do**: No usar mapa real de Google/Mapbox — SVG only

  **Recommended Agent Profile**:
  - Category: `visual-engineering`
  - Skills: [] — UI interactiva pero sin backend

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocked By: A1 (necesita properties.ts extendido)

  **References**:
  - Pattern: `src/lib/components/MapView.svelte` — Componente de mapa existente
  - Mock data参考: `src/lib/data/properties.ts` — formato de datos

  **Acceptance Criteria**:
  - [ ] `/masterplan/el-sol` muestra plano SVG con 20 parcelas
  - [ ] Hover sobre parcela muestra tooltip con precio
  - [ ] Click abre modal con datos de parcela

  **QA Scenarios**:
  ```
  Scenario: Hover sobre parcela disponible muestra tooltip
    Tool: Bash
    Steps: |
      npm run dev
      Ir a /masterplan/el-sol
      Hacer hover sobre parcela verde
    Expected: Tooltip con "Manzana 3 Lote 12 — USD 45.000"
    Evidence: .sisyphus/evidence/b1-masterplan-hover.{ext}

  Scenario: Click en parcela abre modal
    Tool: Bash
    Steps: |
      Click en parcela verde
    Expected: Modal con detalles + botón WhatsApp
    Evidence: .sisyphus/evidence/b1-masterplan-modal.{ext}
  ```

  **Commit**: YES | Message: `feat(masterplan): add interactive lot plan view` | Files: `src/routes/masterplan/[id]/+page.svelte`, `src/lib/data/masterplans.ts`

- [ ] B2. Crear Tablero de búsquedas activas

  **What to do**: Crear `src/routes/tablero/+page.svelte`:
  - Header: "Buscamos propiedades" con filtro por tipo (Casa, Terreno, Galpón, etc.)
  - Grid de "postes" tipo cartelera:
    - Avatar + nombre
    - "Busco: Casa de 3 dormitorios"
    - "Zona: Carmen de Areco"
    - "Presupuesto: USD 200.000"
    - "Hace 2 días" (timestamp)
  - Cada poste tiene botón "Contactar" que abre WhatsApp con mensaje prearmado
  - Formulario para publicar nueva búsqueda (mock — no persiste)
  - 8-10 searches mockeadas con datos creíbles

  **Must NOT do**: No necesita auth para publicar (mock)

  **Recommended Agent Profile**:
  - Category: `visual-engineering`
  - Skills: [] — UI de cartelera

  **Parallelization**: Can Parallel: YES | Wave 2

  **References**:
  - Pattern: `src/routes/+page.svelte` — Grid de cards
  - Pattern: `src/lib/components/PropertyCard.svelte` — Card styling

  **Acceptance Criteria**:
  - [ ] Tablero muestra 8+ búsquedas con datos creíbles
  - [ ] Filtro por tipo funciona
  - [ ] Botón "Contactar" abre WhatsApp con mensaje

  **QA Scenarios**:
  ```
  Scenario: Tablero muestra búsquedas
    Tool: Bash
    Steps: |
      npm run dev
      Ir a /tablero
    Expected: Grid con 8+ postes de búsqueda
    Evidence: .sisyphus/evidence/b2-tablero-view.{ext}

  Scenario: Click en Contactar abre WhatsApp
    Tool: Bash
    Steps: |
      Click en "Contactar" de un poste
    Expected: Abre wa.me con mensaje prearmado
    Evidence: .sisyphus/evidence/b2-tablero-whatsapp.{ext}
  ```

  **Commit**: YES | Message: `feat(billboard): add active searches board` | Files: `src/routes/tablero/+page.svelte`, `src/lib/data/searches.ts`

---

### Session C — Integraciones Mock

- [ ] C1. Crear ChePibe.ai mock (WhatsApp CRM)

  **What to do**: Crear `src/routes/chepibe/+page.svelte`:
  - Layout tipo WhatsApp con 2 paneles: lista de conversaciones (izquierda) y chat (derecha)
  - 3 conversaciones mockeadas mostrando flujo real:
    1. Lead que consulta propiedad → ChePibe pide presupuesto → se registra en CRM
    2. Agente envía "Pasale la casa de San Martín a Juan" → ChePibe genera mensaje formateado
    3. Agente pregunta "¿Tenemos algo de 2 dormitorios por menos de USD 50.000?" → ChePibe busca y devuelve propiedades
  - Cada mensaje tiene timestamp
  - Input para que usuario interactúe (mock — responde con respuestas predefinidas)
  - Badge "CRM Conectado" con logo de Localia

  **Must NOT do**: No es WhatsApp real — es UI que simula el comportamiento

  **Recommended Agent Profile**:
  - Category: `visual-engineering`
  - Skills: [] — UI de chat

  **Parallelization**: Can Parallel: YES | Wave 2

  **References**:
  - Pattern: `src/lib/components/AuthModal.svelte` — Modal existente
  - WhatsApp Web como referencia visual

  **Acceptance Criteria**:
  - [ ] Muestra 3 conversaciones con flujo CRM completo
  - [ ] Input permite enviar mensaje (mock response)
  - [ ] Badge "CRM Conectado" visible

  **QA Scenarios**:
  ```
  Scenario: ChePibe muestra flujo de lead capture
    Tool: Bash
    Steps: |
      npm run dev
      Ir a /chepibe
      Click en conversación 1
    Expected: Ve mensaje de lead, respuesta de ChePibe pidiendo presupuesto
    Evidence: .sisyphus/evidence/c1-chepibe-lead.{ext}

  Scenario: Enviar mensaje a ChePibe
    Tool: Bash
    Steps: |
      Escribir "Tengo presupuesto USD 150.000"
      Enviar
    Expected: Respuesta mock de ChePibe
    Evidence: .sisyphus/evidence/c1-chepibe-response.{ext}
  ```

  **Commit**: YES | Message: `feat(chepibe): add ChePibe WhatsApp CRM mock` | Files: `src/routes/chepibe/+page.svelte`

- [ ] C2. Crear Furnisher.ai mock (Virtual Staging)

  **What to do**: Crear `src/routes/furnisher/+page.svelte`:
  - Header: "Mejorá tus fotos con IA"
  - 2-3 ejemplos de before/after:
    1. Living vacío → Living amueblado (Estilo Escandinavo)
    2. Dormitorio desordenado → Limpio y modernizado
    3. Casa de época → Diseño moderno (Wipe & Replace)
  - Slider interactivo para comparar before/after (arrastrar para revelar)
  - Cada ejemplo tiene:
    - Título del estilo aplicado
    - Botón "Aplicar a mi foto" (mock — abre selector de archivo)
    - Badge "Powered by Furnisher.ai"
  - Lista de estilos disponibles: Escandinavo, Minimalista, Moderno, Nórdico, Industrial

  **Must NOT do**: No llama a API real de Furnisher

  **Recommended Agent Profile**:
  - Category: `visual-engineering`
  - Skills: [] — UI de before/after

  **Parallelization**: Can Parallel: YES | Wave 2

  **References**:
  - Pattern: `src/routes/publicar/+page.svelte` — Upload UI existente
  - Slider pattern: Cualquier slider before/after de CSS

  **Acceptance Criteria**:
  - [ ] 3 ejemplos before/after con slider funcional
  - [ ] Slider revela before/after al arrastrar
  - [ ] Badge "Powered by Furnisher.ai" visible

  **QA Scenarios**:
  ```
  Scenario: Slider before/after funciona
    Tool: Bash
    Steps: |
      npm run dev
      Ir a /furnisher
      Arrastrar slider en primer ejemplo
    Expected: Imagen cambia de before a after
    Evidence: .sisyphus/evidence/c2-furnisher-slider.{ext}

  Scenario: Badge de Furnisher visible
    Tool: Bash
    Steps: |
      Verificar que aparece "Powered by Furnisher.ai"
    Expected: Badge visible en footer del componente
    Evidence: .sisyphus/evidence/c2-furnisher-badge.{ext}
  ```

  **Commit**: YES | Message: `feat(furnisher): add Furnisher virtual staging mock` | Files: `src/routes/furnisher/+page.svelte`

- [ ] C3. Crear Landing page por inmobiliaria

  **What to do**: Crear `src/routes/inmobiliaria/[slug]/+page.svelte`:
  - URL: `/inmobiliaria/inmobiliaria-perez`
  - Header con logo de inmobiliaria + nombre
  - Banner con foto de inmobiliaria + tagline
  - Grid de propiedades exclusivas de esa inmobiliaria
  - Perfil del equipo (foto, nombre, teléfono)
  - Botón WhatsApp flotante (gestionado por ChePibe)
  - 3 inmobiliarias mockeadas: "Inmobiliaria Pérez", "Bienes Raíces del Centro", "Tu Hogar Ideal"
  - Si el slug no existe → página 404

  **Must NOT do**: No necesita auth — página pública

  **Recommended Agent Profile**:
  - Category: `visual-engineering`
  - Skills: [] — Landing page estándar

  **Parallelization**: Can Parallel: YES | Wave 2

  **References**:
  - Pattern: `src/routes/perfil/+page.svelte` — Perfil existente
  - Pattern: `src/routes/+page.svelte` — Grid de propiedades

  **Acceptance Criteria**:
  - [ ] `/inmobiliaria/inmobiliaria-perez` muestra landing completa
  - [ ] Grid muestra solo propiedades de esa inmobiliaria
  - [ ] Botón WhatsApp flotante visible

  **QA Scenarios**:
  ```
  Scenario: Landing inmobiliaria muestra datos
    Tool: Bash
    Steps: |
      npm run dev
      Ir a /inmobiliaria/inmobiliaria-perez
    Expected: Logo, banner, propiedades, equipo, WhatsApp
    Evidence: .sisyphus/evidence/c3-landing-inmobiliaria.{ext}

  Scenario: Slug inexistente muestra 404
    Tool: Bash
    Steps: |
      Ir a /inmobiliaria/no-existe
    Expected: Página 404
    Evidence: .sisyphus/evidence/c3-landing-404.{ext}
  ```

  **Commit**: YES | Message: `feat(landing): add real estate landing pages` | Files: `src/routes/inmobiliaria/[slug]/+page.svelte`, `src/lib/data/inmobiliarias.ts`

---

## Final Verification Wave (MANDATORY)

> 4 review agents run in PARALLEL after ALL implementation tasks.
> ALL must APPROVE. Present consolidated results.

- [ ] F1. Plan Compliance Audit — Verificar que cada sesión respetó su territorio de archivos
- [ ] F2. Code Quality Review — Verificar que no hay errores de TypeScript
- [ ] F3. Navigation Test — Verificar que todos los links del Header funcionan
- [ ] F4. Scope Fidelity Check — Verificar que todas las acceptance criteria fueron cumplidas

---

## Commit Strategy

- 3 commits (uno por sesión) mergeados al final del sprint
- Mensajes: `feat(session-a): ...`, `feat(session-b): ...`, `feat(session-c): ...`
- Rama base: `main`

---

## Success Criteria

1. Landing page de Localia muestra propiedades de Buenos Aires + Interior
2. Filtro "Zona" disponible en FiltersSidebar
3. `/masterplan/el-sol` accesible con plano interactivo
4. `/tablero` accesible con cartelera de búsquedas
5. `/chepibe` accesible con mock de WhatsApp CRM
6. `/furnisher` accesible con slider before/after
7. `/inmobiliaria/inmobiliaria-perez` accesible con landing completa
8. Header tiene links a todas las rutas nuevas
9. Zero errores de consola en todas las rutas
10. UI consistente con sistema de diseño existente
