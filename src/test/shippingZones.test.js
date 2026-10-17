import { describe, it, expect } from 'vitest';
import { shippingZones, getShippingCost } from '../data/shippingZones';

describe('shippingZones', () => {
  it('define zonas con id, nombre y precio (número o null para coordinar)', () => {
    expect(shippingZones.length).toBeGreaterThan(0);
    for (const zone of shippingZones) {
      expect(zone.id).toBeTruthy();
      expect(zone.name).toBeTruthy();
      expect(zone.price === null || typeof zone.price === 'number').toBe(true);
      if (typeof zone.price === 'number') expect(zone.price).toBeGreaterThanOrEqual(0);
    }
  });

  it('Rosario ciudad es gratis', () => {
    const rosario = shippingZones.find((z) => z.id === 'rosario-ciudad');
    expect(rosario.price).toBe(0);
  });

  it('devuelve el precio de la zona conocida (puede ser null)', () => {
    expect(getShippingCost(shippingZones[0].id)).toBe(shippingZones[0].price);
  });

  it('devuelve 0 para zona desconocida', () => {
    expect(getShippingCost('no-existe')).toBe(0);
  });
});
