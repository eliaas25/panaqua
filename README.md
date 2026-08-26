# Panaqua - Carteras y Bolsos Elegantes

Sitio web para mostrar productos de carteras y bolsos elegantes.

## Características

- Diseño elegante y minimalista
- Catálogo de productos con filtros por categoría
- Modal de detalles de producto
- Responsive design (mobile-first)
- Sección de contacto con WhatsApp
- Integración con redes sociales

## Tecnologías

- React + Vite
- Tailwind CSS
- Google Fonts (Playfair Display, Inter, Cormorant Garamond)

## Categorías de Productos

- Carteras de Mano
- Bolsos
- Bolsos Gabardina
- Mini Bags

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── ProductCard.jsx
│   ├── ProductGrid.jsx
│   ├── CategoryFilter.jsx
│   ├── ProductModal.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Footer.jsx
│   └── WhatsAppButton.jsx
├── data/
│   └── products.js
├── assets/
│   └── images/
├── App.jsx
├── main.jsx
└── index.css
```

## Personalización

### Cambiar Logo

1. Coloca tu logo en `public/logo.svg`
2. El componente Navbar lo cargará automáticamente

### Cambiar Número de WhatsApp

1. Abre `src/components/WhatsAppButton.jsx`
2. Reemplaza `549XXXXXXXXXX` con tu número real

3. Abre `src/components/ProductModal.jsx`
4. Actualiza el número en el enlace de WhatsApp

### Cambiar Colores

1. Abre `src/index.css`
2. Modifica las variables en la sección `@theme`

### Agregar Productos

1. Abre `src/data/products.js`
2. Agrega nuevos objetos al array `products`
3. Formato:
```javascript
{
  id: 11,
  name: "Nombre del Producto",
  category: "categoría",
  price: 25000,
  materials: ["Material 1", "Material 2"],
  dimensions: "30cm x 20cm x 12cm",
  availability: "En stock",
  image: "URL de la imagen",
  description: "Descripción del producto",
  featured: false
}
```

## Imágenes

El proyecto usa imágenes de ejemplo de Unsplash. Para reemplazarlas:

1. Coloca tus imágenes en `src/assets/images/`
2. Actualiza las URLs en `src/data/products.js`

## Próximos Pasos

- [ ] Agregar carrito de compras
- [ ] Integrar pasarela de pagos (Mercado Pago)
- [ ] Sistema de envíos
- [ ] Panel de administración
- [ ] Base de datos para gestionar ventas y stock

## Licencia

Proyecto privado - Panaqua © 2026
