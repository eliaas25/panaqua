import bagIsadora from '../assets/products/bag-isadora.webp';
import bagTini from '../assets/products/bag-tini.webp';
import bolsoKaren from '../assets/products/bolso-karen.webp';
import bagFlower from '../assets/products/bag-flower.webp';
import bolsoMindy from '../assets/products/bolso-mindy.webp';
import bagVirkin from '../assets/products/bag-virkin.webp';

export const products = [
  {
    id: 1,
    name: 'Bag Isadora',
    category: 'bags',
    price: 32500,
    materials: [],
    dimensions: '',
    stock: 8,
    image: bagIsadora,
    description:
      'Bag color suela con monedero accesorio. Diseño elegante y versátil para cualquier ocasión.',
    featured: true,
  },
  {
    id: 2,
    name: 'Bag Tini',
    category: 'bags',
    price: 35000,
    materials: [],
    dimensions: '',
    stock: 3,
    image: bagTini,
    description: 'Bag color beige con pañuelo accesorio. Estilo chic y moderno.',
    featured: true,
  },
  {
    id: 3,
    name: 'Bolso Karen',
    category: 'bolsos',
    price: 35900,
    materials: [],
    dimensions: '',
    stock: 12,
    image: bolsoKaren,
    description: 'Bolso negro clásico. Elegancia y funcionalidad en un solo diseño.',
    featured: true,
  },
  {
    id: 4,
    name: 'Bag Flower',
    category: 'bags',
    price: 37500,
    materials: [],
    dimensions: '',
    stock: 0,
    image: bagFlower,
    description: 'Bag color verde con toque floral. Perfecta para sumar color a tu look.',
    featured: false,
  },
  {
    id: 5,
    name: 'Bolso Mindy',
    category: 'bolsos',
    price: 36900,
    materials: [],
    dimensions: '',
    stock: 2,
    image: bolsoMindy,
    description: 'Bolso negro sofisticado. Ideal para el día a día con estilo.',
    featured: false,
  },
  {
    id: 6,
    name: 'Bag Virgin',
    category: 'bags',
    price: 35000,
    materials: [],
    dimensions: '',
    stock: 10,
    image: bagVirkin,
    description: 'Bag color negro con pañuelo accesorio. Diseño refinado y moderno.',
    featured: false,
  },
];

export const categories = [
  { id: 'bags', name: 'Bags' },
  { id: 'bolsos', name: 'Bolsos' },
];
