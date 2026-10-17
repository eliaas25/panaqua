# Instrucciones para Panaqua

## Primeros Pasos

### 1. Instalar Dependencias

```bash
cd panaqua
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (basado en `.env.example`):

```
VITE_WHATSAPP_NUMBER=549XXXXXXXXXX
VITE_CONTACT_EMAIL=tu@email.com
VITE_INSTAGRAM_URL=https://www.instagram.com/tu-usuario
```

Los valores se centralizan en `src/config/site.js` (con fallbacks). **No** editar números en componentes.

### 3. Iniciar Desarrollo

```bash
npm run dev
```

Esto abrirá el servidor de desarrollo en `http://localhost:5173/`

## Personalización

### Cambiar Logo

- Logo: `src/assets/logo.svg` (usado por el Navbar)
- Favicon: `public/favicon.svg`

### Cambiar Contacto (WhatsApp / email / Instagram)

1. Editá `.env` (o los fallbacks en `src/config/site.js`)
2. Los componentes lo toman automáticamente

### Cambiar Colores

1. Abre `src/index.css`
2. Modifica las variables en la sección `@theme`:

```css
@theme {
  --color-bg: #FAFAF8;      /* Color de fondo */
  --color-text: #1A1A1A;    /* Color de texto */
  --color-accent: #C9A96E;  /* Color de acento (dorado) */
  --color-muted: #6B6B6B;   /* Color de texto secundario */
  --color-border: #E5E5E5;  /* Color de bordes */
}
```

### Agregar Productos

1. Abre `src/data/products.js`
2. Agrega nuevos objetos al array `products`:

```javascript
{
  id: 7,
  name: "Nombre del Producto",
  category: "bags", // "bags" o "bolsos"
  price: 25000,
  materials: [],
  dimensions: "",
  availability: "En stock", // "En stock", "Pocas unidades", "Agotado"
  image: importFoto, // import desde src/assets/products/
  description: "Descripción del producto",
  featured: false
}
```

### Cambiar Imágenes

1. Coloca tus imágenes en `src/assets/products/`
2. Importalas por ESM en `src/data/products.js` (no URLs externas)

## Comandos Útiles

```bash
# Iniciar desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview

# Formatear código
npm run format

# Verificar formato
npm run format:check

# Ejecutar linting
npm run lint

# Ejecutar tests (27 tests)
npm test

# Tests en modo watch
npm run test:watch
```

## Deploy

Push a `main` → GitHub Actions ejecuta lint + tests + build + deploy automático a GitHub Pages.

Settings > Pages > Source: "GitHub Actions" (ya configurado).

## Estructura del Proyecto

```
panaqua/
├── public/
│   ├── favicon.svg
│   └── images/og-image.jpg
├── src/
│   ├── components/       # 11 componentes React
│   ├── config/site.js    # contacto centralizado
│   ├── data/products.js  # 6 productos + 2 categorías
│   ├── utils/            # sort.js, format.js
│   ├── assets/           # logo.svg + 6 fotos
│   ├── test/             # 6 archivos de test
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env                  # Variables de entorno (gitignored)
├── .env.example          # Plantilla
├── package.json
└── vite.config.js
```

## Próximos Pasos (Fase 2)

Cuando estés listo para agregar funcionalidad de e-commerce:

1. **Carrito de Compras**
   - Usar localStorage para persistir el carrito
   - Crear componentes: Cart, CartItem, CartSummary

2. **Pasarela de Pagos**
   - Integrar Mercado Pago
   - Crear flujo de checkout

3. **Sistema de Envíos**
   - Integrar APIs de Andreani o Correo Argentino
   - Calcular costos de envío

4. **Panel de Administración**
   - CRUD de productos
   - Gestión de pedidos
   - Reportes de ventas

## Soporte

Si tenés problemas, revisá:

1. Que Node.js esté instalado (versión 18+)
2. Que las dependencias estén instaladas (`npm install`)
3. Que no haya errores en la consola del navegador
4. Que las imágenes estén en formatos compatibles (JPG, PNG, WebP)
