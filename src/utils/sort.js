export const SORT_OPTIONS = [
  { id: 'default', name: 'Más recientes' },
  { id: 'name-asc', name: 'Nombre A-Z' },
  { id: 'price-asc', name: 'Precio: menor a mayor' },
  { id: 'price-desc', name: 'Precio: mayor a menor' },
];

export function sortProducts(products, sortBy) {
  const sorted = [...products];
  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    default:
      return sorted.sort((a, b) => a.id - b.id);
  }
}
