// Zonas y costos de envío.
// price: número = precio fijo | 0 = gratis | null = se coordina con el cliente
//
// Por ahora: solo envío gratis a Rosario ciudad.
// Cotización Andreani (oct 2026) de referencia para cuando se definan más zonas:
//   Rosario → Rosario: sucursal $16.036 | domicilio $19.939 | "llega hoy" $23.257
//   Rosario → Santa Fe Capital / Buenos Aires: sucursal $26.435 / domicilio $27.576
export const shippingZones = [{ id: 'rosario-ciudad', name: 'Rosario ciudad', price: 0 }];

export function getShippingCost(zoneId) {
  const zone = shippingZones.find((z) => z.id === zoneId);
  return zone ? zone.price : 0;
}
