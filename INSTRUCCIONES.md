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
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...anon...
```

Los valores se centralizan en `src/config/site.js` (con fallbacks). **No** editar números en componentes.

Si faltan las variables de Supabase, el sitio funciona en modo local: muestra los productos de `src/data/products.js` y el checkout queda inactivo.

### 3. Configurar Supabase (Base de Datos)

1. Entrá a [supabase.com](https://supabase.com) → **New Project** (nombre `panaqua`, región South America, contraseña de BD guardada)
2. Esperá ~2 min a que provisione
3. **Project Settings → API** → copiá la **Project URL** y la **anon public key** al `.env`
4. Andá a **SQL Editor → New query**, pegá todo el contenido de `supabase/schema.sql` y presioná **Run**
5. Verificá que aparezcan las tablas en **Table Editor** (`products`, `orders`, `clientes`, etc.)

El esquema crea:
- 8 tablas con RLS habilitado (el anónimo solo lee catálogo/config y crea pedidos vía RPC)
- Los 6 productos de ejemplo ya insertados
- Secuencia de números de pedido (arranca en 1001)
- Función `crear_pedido` que valida stock y precios del lado servidor

### 4. Iniciar Desarrollo

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

Los productos viven en Supabase (tabla `products`): editálos desde el SQL Editor o, a futuro, desde el panel admin (M3). El archivo `src/data/products.js` queda como **fallback local** (y como fuente de las imágenes por `image_key`).

Para agregar uno manualmente:

1. Insertá la fila en la tabla `products` (columnas `nombre`, `descripcion`, `precio`, `stock`, `categoria_id`, `image_key`)
2. Si es una foto nueva: subila a `src/assets/products/` y agregá el alias en `src/data/productImages.js`

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

# Ejecutar tests (67 tests)
npm test

# Tests en modo watch
npm run test:watch
```

## Deploy

Push a `main` → GitHub Actions ejecuta lint + tests + build + deploy automático a GitHub Pages.

Settings > Pages > Source: "GitHub Actions" (ya configurado).

**Importante para producción:** agregá en Settings → Secrets and variables → Actions → Secrets:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

(el workflow los inyecta en el build; sin ellos la web publicada queda en modo local y el checkout no funciona)

## Estructura del Proyecto

```
panaqua/
├── public/
│   ├── favicon.svg
│   └── images/og-image.jpg
├── supabase/
│   └── schema.sql        # SQL completo para Supabase (pegar en SQL Editor)
├── src/
│   ├── components/       # 12 componentes React
│   ├── pages/            # Home, Checkout, OrderConfirmation (ruteo con HashRouter)
│   ├── services/shop.js  # acceso a Supabase con fallback local
│   ├── lib/supabase.js   # cliente de Supabase
│   ├── hooks/            # useCart, useCopyToClipboard, useScrollToSection
│   ├── context/          # CartContext (estado del carrito)
│   ├── config/           # site.js (contacto), payments.js (alias/CBU)
│   ├── data/             # products.js (fallback), shippingZones.js, productImages.js
│   ├── utils/            # sort.js, format.js, stock.js
│   ├── test/             # 12 archivos de test
│   ├── assets/           # logo.svg + 6 fotos
│   ├── App.jsx           # rutas: /, /checkout, /pedido/:numero
│   ├── main.jsx          # HashRouter + StrictMode
│   └── index.css
├── .env                  # Variables de entorno (gitignored)
├── .env.example          # Plantilla
├── package.json
└── vite.config.js
```

## Próximos Pasos (Fase 2)

- [x] Carrito de compras (localStorage + drawer)
- [x] Checkout con pedidos en Supabase + confirmación por WhatsApp
- [ ] Precios reales de envío por zona (`src/data/shippingZones.js`)
- [ ] M3: Panel de administración (login Supabase Auth, gestión de pedidos/estados, stock, CRUD de productos)
- [ ] M4: Cierre de Fase 2 (ajustes finales y QA)

## Soporte

Si tenés problemas, revisá:

1. Que Node.js esté instalado (versión 18+)
2. Que las dependencias estén instaladas (`npm install`)
3. Que no haya errores en la consola del navegador
4. Que las imágenes estén en formatos compatibles (JPG, PNG, WebP)
