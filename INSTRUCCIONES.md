# Instrucciones para Panaqua

## Primeros Pasos

### 1. Instalar Dependencias

```bash
cd panaqua
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con:

```
VITE_WHATSAPP_NUMBER=549XXXXXXXXXX
```

Reemplaza `549XXXXXXXXXX` con tu número de WhatsApp real.

### 3. Iniciar Desarrollo

```bash
npm run dev
```

Esto abrirá el servidor de desarrollo en `http://localhost:5173/`

## Personalización

### Cambiar Logo

1. Coloca tu logo en `public/logo.svg`
2. El Navbar lo cargará automáticamente

### Cambiar Número de WhatsApp

1. Abre `src/components/WhatsAppButton.jsx`
2. Reemplaza `549XXXXXXXXXX` con tu número real

3. Abre `src/components/ProductModal.jsx`
4. Actualiza el número en el enlace de WhatsApp

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
  id: 11,
  name: "Nombre del Producto",
  category: "categoría", // "carteras de mano", "bolsos", "bolsos gabardina", "mini bag"
  price: 25000,
  materials: ["Material 1", "Material 2"],
  dimensions: "30cm x 20cm x 12cm",
  availability: "En stock", // "En stock", "Pocas unidades", "Agotado"
  image: "URL de la imagen",
  description: "Descripción del producto",
  featured: false
}
```

### Cambiar Imágenes

1. Coloca tus imágenes en `src/assets/images/`
2. Actualiza las URLs en `src/data/products.js`

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
```

## Deploy

### Opción 1: GitHub Pages (Recomendado)

1. Sube el código a GitHub
2. Ve a Settings > Pages
3. Selecciona "GitHub Actions" como source
4. El deploy se ejecutará automáticamente

### Opción 2: Netlify

1. Sube el código a GitHub
2. Conecta el repositorio en Netlify
3. Configura:
   - Build command: `npm run build`
   - Publish directory: `dist`

## Estructura del Proyecto

```
panaqua/
├── public/
│   ├── favicon.svg
│   └── logo.svg          # Tu logo aquí
├── src/
│   ├── components/       # Componentes React
│   ├── data/             # Datos de productos
│   ├── assets/
│   │   └── images/       # Tus imágenes aquí
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env                  # Variables de entorno
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
