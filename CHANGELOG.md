# Changelog

## [0.4.0] - 2026-10-17

### Added
- Carrito de compras: reducer + localStorage, drawer lateral, contador en navbar
- Badges de stock en tarjetas y modal (verde/amarillo/rojo, umbral de 5 unidades)
- Integración con Supabase: productos, categorías, métodos de pago y settings desde BD (fallback local si no hay credenciales)
- Esquema SQL de 8 tablas con RLS + RPC `crear_pedido` (valida stock y precios del lado servidor) en `supabase/schema.sql`
- Ruteo con HashRouter: `/` (home), `/checkout`, `/pedido/:numero`
- Página de checkout: datos, retiro/envío con costo por zona, método de pago, validaciones y resumen
- Página de confirmación: resumen del pedido, datos de transferencia (alias/CBU) y envío por WhatsApp con número de pedido
- Zonas de envío (`src/data/shippingZones.js`): Rosario ciudad gratis, resto "A coordinar" (cotización Andreani referenciada en el archivo)
- Esquema SQL idempotente (re-pegable sin duplicar datos) + script `supabase/fix-duplicados.sql`
- Tests: 67 (Checkout, OrderConfirmation, shippingZones, carrito, stock)

### Changed
- Navbar, Footer y Hero navegan con scroll programático (compatibles con HashRouter)
- Botón "Finalizar compra" del carrito habilitado → lleva al checkout
- Hero: imagen con ancho máximo (antes ocupaba toda la columna)
- Filtros, búsqueda y orden en una sola línea
- Cursores `pointer` globales en botones, links y selects
- Email de contacto copiable al portapapeles con feedback "¡Copiado!"
- Modal de producto: scroll completo en mobile e imagen a todo el ancho

## [0.3.0] - 2026-10-17

### Added
- Búsqueda por nombre en el catálogo
- Ordenamiento: más recientes, nombre A-Z, precio ↑/↓
- 27 tests automatizados (Vitest + React Testing Library)
- CI/CD: lint + tests + build + deploy en GitHub Actions (Node 24)
- `src/utils/format.js` con `formatPrice` (formato ARS)
- `src/utils/sort.js` con `sortProducts` y `SORT_OPTIONS`
- Estado vacío en ProductGrid ("No se encontraron productos")

### Changed
- Logo SVG optimizado con SVGO: 1,15 MB → 24 KB
- og-image comprimida: 431 KB → 87 KB (1200×630)
- Formato de precio extraído a util compartido (antes duplicado en Card y Modal)

### Fixed
- Vulnerabilidad npm en `source-map-js`
- CI fallaba con Node 20 (vitest 5 y jsdom 30 requieren ≥22)

## [0.2.0] - 2026-10-16

### Added
- Fotos oficiales de los 6 productos (reemplazan placeholders)
- Logo oficial del usuario (sin fondo, viewBox recortado)
- Configuración con variables de entorno `.env` (gitignored)
- `src/config/site.js` como único punto de verdad de contacto
- og-image y favicon reales

### Changed
- Formulario de contacto redirige a WhatsApp (sin backend)
- Categorías: Bags (4) y Bolsos (2) — antes 4 categorías placeholder
- Contacto centralizado (antes hardcodeado en componentes)

### Removed
- Facebook (decisión del cliente)
- `netlify.toml` (deploy solo en GitHub Pages)
- Assets huérfanos

## [0.1.0] - 2026-08-26

### Added
- Estructura inicial del proyecto con React + Vite
- Configuración de Tailwind CSS
- Sistema de diseño personalizado (colores, tipografía)
- Componentes principales:
  - Navbar responsive con menú hamburguesa
  - Hero section con llamada a la acción
  - ProductCard con efectos hover
  - ProductGrid responsive
  - CategoryFilter para filtrar por categoría
  - ProductModal para detalles del producto
  - About section
  - Contact section con formulario
  - Footer con redes sociales
  - WhatsAppButton flotante
- Datos de productos de ejemplo
- Configuración de deploy con GitHub Actions
- Herramientas de desarrollo: oxlint, Prettier

### Changed
- Eliminado App.css (reemplazado por Tailwind CSS)

## [0.0.0] - 2026-08-26

### Added
- Proyecto inicial creado con Vite + React
