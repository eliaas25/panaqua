export const LOW_STOCK_THRESHOLD = 5;

export function getStockStatus(stock) {
  if (stock <= 0) {
    return {
      label: 'Agotado',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      canBuy: false,
      isLow: false,
    };
  }
  if (stock <= LOW_STOCK_THRESHOLD) {
    return {
      label: stock === 1 ? '¡Queda 1 unidad!' : `¡Quedan ${stock} unidades!`,
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      canBuy: true,
      isLow: true,
    };
  }
  return {
    label: 'En stock',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    canBuy: true,
    isLow: false,
  };
}
