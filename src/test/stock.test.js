import { describe, it, expect } from 'vitest';
import { getStockStatus, LOW_STOCK_THRESHOLD } from '../utils/stock';

describe('getStockStatus', () => {
  it('returns "Agotado" and cannot buy when stock is 0', () => {
    const status = getStockStatus(0);
    expect(status.label).toBe('Agotado');
    expect(status.canBuy).toBe(false);
    expect(status.isLow).toBe(false);
  });

  it('treats negative stock as agotado', () => {
    expect(getStockStatus(-1).canBuy).toBe(false);
  });

  it('returns low stock label with unit count when stock is 1', () => {
    const status = getStockStatus(1);
    expect(status.label).toBe('¡Queda 1 unidad!');
    expect(status.isLow).toBe(true);
    expect(status.canBuy).toBe(true);
  });

  it('uses plural for stock above 1', () => {
    expect(getStockStatus(3).label).toBe('¡Quedan 3 unidades!');
  });

  it('marks stock at threshold as low', () => {
    expect(getStockStatus(LOW_STOCK_THRESHOLD).isLow).toBe(true);
  });

  it('returns "En stock" when above threshold', () => {
    const status = getStockStatus(LOW_STOCK_THRESHOLD + 1);
    expect(status.label).toBe('En stock');
    expect(status.isLow).toBe(false);
    expect(status.canBuy).toBe(true);
  });

  it('uses yellow text for low stock and green for normal', () => {
    expect(getStockStatus(2).textColor).toBe('text-yellow-600');
    expect(getStockStatus(8).textColor).toBe('text-green-600');
  });
});
