import bagIsadora from '../assets/products/bag-isadora.webp';
import bagTini from '../assets/products/bag-tini.webp';
import bolsoKaren from '../assets/products/bolso-karen.webp';
import bagFlower from '../assets/products/bag-flower.webp';
import bolsoMindy from '../assets/products/bolso-mindy.webp';
import bagVirkin from '../assets/products/bag-virkin.webp';

export const productImages = {
  'bag-isadora': bagIsadora,
  'bag-tini': bagTini,
  'bolso-karen': bolsoKaren,
  'bag-flower': bagFlower,
  'bolso-mindy': bolsoMindy,
  'bag-virkin': bagVirkin,
};

export function resolveProductImage(imageKey) {
  return productImages[imageKey] || bagFlower;
}
