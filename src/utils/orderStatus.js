export const ORDER_STATUSES = {
  pendiente_pago: { label: 'Pendiente de pago', badge: 'bg-amber-100 text-amber-800' },
  pagado: { label: 'Pagado', badge: 'bg-blue-100 text-blue-800' },
  enviado: { label: 'Enviado', badge: 'bg-indigo-100 text-indigo-800' },
  entregado: { label: 'Entregado', badge: 'bg-green-100 text-green-800' },
  cancelado: { label: 'Cancelado', badge: 'bg-red-100 text-red-700' },
};

export const NEXT_STATES = {
  pendiente_pago: ['pagado', 'cancelado'],
  pagado: ['enviado', 'pendiente_pago', 'cancelado'],
  enviado: ['entregado', 'cancelado'],
  entregado: [],
  cancelado: [],
};

export const ACTION_LABELS = {
  pagado: 'Marcar pagado',
  enviado: 'Marcar enviado',
  entregado: 'Marcar entregado',
  pendiente_pago: 'Volver a pendiente',
  cancelado: 'Cancelar pedido',
};

export function getStatusInfo(estado) {
  return ORDER_STATUSES[estado] || { label: estado, badge: 'bg-border text-muted' };
}
