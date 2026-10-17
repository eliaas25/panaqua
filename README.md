# Panaqua - Carteras y Bolsos Elegantes

Catálogo online de carteras y bolsos. **[Live](https://eliaas25.github.io/panaqua/)**

## Características

- Diseño elegante y minimalista (dorado + blancos cálidos)
- Catálogo de 6 productos con búsqueda y ordenamiento
- Filtro por categorías (Bags / Bolsos)
- Modal de detalles con consulta directa por WhatsApp
- Responsive design (mobile-first)
- 27 tests automatizados + CI/CD con GitHub Actions

## Tecnologías

- React 19 + Vite 8
- Tailwind CSS 4 (via `@theme`, sin config JS)
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
npm test             # Correr tests (27 tests)
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
```

> Los valores reales están centralizados en `src/config/site.js` (con fallbacks). **No** editar números en componentes.

## Estructura del Proyecto

```
src/
├── components/       # 11 componentes React (.jsx)
├── config/site.js    # ← contacto centralizado (WhatsApp, email, Instagram)
├── data/products.js  # 6 productos + 2 categorías
├── utils/            # sort.js, format.js
├── assets/           # logo.svg + 6 fotos de productos
├── test/             # 6 archivos de test (Vitest)
├── App.jsx           # orquestador (4 estados)
├── main.jsx
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

1. Abrí `src/data/products.js`
2. Agregá un objeto al array `products`:

```javascript
{
  id: 7,
  name: "Nombre",
  category: "bags",        // o "bolsos"
  price: 25000,
  materials: [],
  dimensions: "",
  availability: "En stock",
  image: importFoto,       // import de src/assets/products/
  description: "Texto...",
  featured: false
}
```

## Deploy

Push a `main` → GitHub Actions corre lint + tests → build → deploy automático a GitHub Pages.

## Próximos Pasos (Fase 2)

- [ ] Carrito de compras
- [ ] Integración con Mercado Pago
- [ ] Sistema de envíos
- [ ] Panel de administración
- [ ] Base de datos para stock y ventas

## Licencia

Proyecto privado - Panaqua © 2026
