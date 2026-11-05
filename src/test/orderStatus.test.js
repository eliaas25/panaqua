import { describe, it, expect } from 'vitest';
import { ORDER_STATUSES, NEXT_STATES, ACTION_LABELS, getStatusInfo } from '../utils/orderStatus';

describe('orderStatus', () => {
  it('define los 5 estados con etiqueta y estilo de badge', () => {
    const estados = Object.keys(ORDER_STATUSES);
    expect(estados).toEqual(['pendiente_pago', 'pagado', 'enviado', 'entregado', 'cancelado']);
    for (const info of Object.values(ORDER_STATUSES)) {
      expect(info.label).toBeTruthy();
      expect(info.badge).toBeTruthy();
    }
  });

  it('define las transiciones válidas', () => {
    expect(NEXT_STATES.pendiente_pago).toEqual(['pagado', 'cancelado']);
    expect(NEXT_STATES.pagado).toContain('enviado');
    expect(NEXT_STATES.pagado).toContain('cancelado');
    expect(NEXT_STATES.enviado).toContain('entregado');
    expect(NEXT_STATES.entregado).toEqual([]);
    expect(NEXT_STATES.cancelado).toEqual([]);
  });

  it('cada transición tiene etiqueta de acción', () => {
    for (const estados of Object.values(NEXT_STATES)) {
      for (const estado of estados) {
        expect(ACTION_LABELS[estado]).toBeTruthy();
      }
    }
  });

  it('getStatusInfo devuelve fallback para estado desconocido', () => {
    expect(getStatusInfo('pendiente_pago').label).toBe('Pendiente de pago');
    expect(getStatusInfo('otro').label).toBe('otro');
  });
});
