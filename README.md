# Panaqua - Carteras y Bolsos Elegantes

Catálogo online de carteras y bolsos. **[Live](https://eliaas25.github.io/panaqua/)**

## Características

- Diseño elegante y minimalista (dorado + blancos cálidos)
- Catálogo de 6 productos con búsqueda y ordenamiento
- Filtro por categorías (Bags / Bolsos)
- Modal de detalles con consulta directa por WhatsApp
- Carrito de compras con persistencia local (localStorage)
- Checkout con pedidos guardados en Supabase y confirmación por WhatsApp
- Responsive design (mobile-first)
- 67 tests automatizados + CI/CD con GitHub Actions

## Tecnologías

- React 19 + Vite 8
- Tailwind CSS 4 (via `@theme`, sin config JS)
- Supabase (Postgres + RLS) para productos y pedidos
- react-router-dom (HashRouter)
- Vitest + React Testing Library (tests)
- oxlint + Prettier (linting y formato)
- Google Fonts (Playfair Display, Inter, Cormorant Garamond)

## Categorías

- **Bags** (4 productos)
- **Bolsos** (2 productos)

## Instalación

```bash
npm install
npm run dev          # localhost:5173
```

## Comandos

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Vista previa del build
npm test             # Correr tests (67 tests)
npm run test:watch   # Tests en modo watch
npm run lint         # Linting con oxlint
npm run format       # Formatear con Prettier
```

## Variables de Entorno

Crea un archivo `.env` (gitignored) basado en `.env.example`:

```
VITE_WHATSAPP_NUMBER=549XXXXXXXXXX
VITE_CONTACT_EMAIL=tu@email.com
VITE_INSTAGRAM_URL=https://www.instagram.com/tu-usuario
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...anon...
```

> Los valores reales están centralizados en `src/config/site.js` (con fallbacks). **No** editar números en componentes.

## Estructura del Proyecto

```
supabase/schema.sql   # SQL del esquema completo (pegar en Supabase)
src/
├── components/       # 12 componentes React (.jsx)
├── pages/            # Home, Checkout, OrderConfirmation
├── services/shop.js  # acceso a Supabase con fallback local
├── hooks/            # useCart, useCopyToClipboard, useScrollToSection
├── context/          # CartContext (carrito)
├── config/           # site.js (contacto), payments.js (alias/CBU)
├── data/             # products.js (fallback), shippingZones.js
├── utils/            # sort.js, format.js, stock.js
├── test/             # 12 archivos de test (Vitest)
├── App.jsx           # rutas (/ , /checkout, /pedido/:numero)
├── main.jsx          # HashRouter
└── index.css         # @theme de Tailwind 4
```

## Personalización

### Cambiar contacto (WhatsApp / email / Instagram)

1. Editá `.env` (o los fallbacks en `src/config/site.js`)
2. Los componentes (`Contact`, `Footer`, `WhatsAppButton`, `ProductModal`) lo toman automáticamente

### Cambiar Logo

- Logo: `src/assets/logo.svg` (optimizado con SVGO, ~24 KB)
- Favicon: `public/favicon.svg`

### Cambiar Colores

1. Abrí `src/index.css`
2. Modificá las variables en `@theme`

### Agregar Productos

Los productos se editan en Supabase (tabla `products`, desde el Table Editor o SQL). `src/data/products.js` es solo fallback local; las fotos nuevas van a `src/assets/products/` + alias en `src/data/productImages.js`.

## Deploy

Push a `main` → GitHub Actions corre lint + tests → build → deploy automático a GitHub Pages.

Los secrets `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` deben estar cargados en Settings → Secrets and variables → Actions para que la web publicada use la base de datos.

## Próximos Pasos (Fase 2)

- [x] Carrito de compras
- [x] Checkout con pedidos en Supabase + confirmación por WhatsApp
- [ ] Precios reales de envío por zona
- [ ] Integración con Mercado Pago
- [ ] Panel de administración (M3)
- [ ] Cierre de Fase 2 (M4)

## Licencia

Proyecto privado - Panaqua © 2026
