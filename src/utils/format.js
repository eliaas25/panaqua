export function formatPrice(price) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(price);
}

export function formatShippingCost(cost) {
  if (cost === null || cost === undefined) return 'A coordinar';
  if (cost === 0) return 'Gratis';
  return formatPrice(cost);
}
