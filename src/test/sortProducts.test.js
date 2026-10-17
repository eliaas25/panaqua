import { describe, it, expect } from 'vitest';
import { sortProducts } from '../utils/sort';
import { products } from '../data/products';

describe('sortProducts', () => {
  it('returns products sorted by id by default', () => {
    const result = sortProducts(products, 'default');
    const ids = result.map((p) => p.id);
    expect(ids).toEqual([...ids].sort((a, b) => a - b));
  });

  it('sorts by name A-Z', () => {
    const result = sortProducts(products, 'name-asc');
    const names = result.map((p) => p.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it('sorts by price ascending', () => {
    const result = sortProducts(products, 'price-asc');
    const prices = result.map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('sorts by price descending', () => {
    const result = sortProducts(products, 'price-desc');
    const prices = result.map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  it('does not mutate the original array', () => {
    const originalIds = products.map((p) => p.id);
    sortProducts(products, 'price-desc');
    expect(products.map((p) => p.id)).toEqual(originalIds);
  });
});
