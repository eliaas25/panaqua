// Zonas y costos de envío.
// price: número = precio fijo | 0 = gratis | null = se coordina con el cliente
//
// Cotización Andreani (oct 2026, envío de referencia):
//   Rosario → Rosario: sucursal $16.036 | domicilio $19.939 | "llega hoy" $23.257
//   Rosario → Santa Fe Capital / Buenos Aires: sucursal $26.435 | domicilio $27.576
// Pendiente: definir precios finales por zona (hoy todo "a coordinar" salvo Rosario ciudad).
export const shippingZones = [
  { id: 'rosario-ciudad', name: 'Rosario ciudad', price: 0 },
  { id: 'gran-rosario', name: 'Gran Rosario', price: null },
  { id: 'santa-fe', name: 'Ciudad de Santa Fe', price: null },
  { id: 'resto-pais', name: 'Resto del país', price: null },
];

export function getShippingCost(zoneId) {
  const zone = shippingZones.find((z) => z.id === zoneId);
  return zone ? zone.price : 0;
}
