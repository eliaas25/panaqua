import { describe, it, expect } from 'vitest';
import { products, categories } from '../data/products';

describe('products data', () => {
  it('has 6 products', () => {
    expect(products).toHaveLength(6);
  });

  it('every product has required fields', () => {
    products.forEach((product) => {
      expect(product.id).toBeDefined();
      expect(product.name).toBeTruthy();
      expect(product.category).toBeTruthy();
      expect(product.price).toBeGreaterThan(0);
      expect(product.image).toBeTruthy();
      expect(product.description).toBeTruthy();
      expect(typeof product.stock).toBe('number');
      expect(product.stock).toBeGreaterThanOrEqual(0);
    });
  });

  it('every product category belongs to defined categories', () => {
    const categoryIds = categories.map((c) => c.id);
    products.forEach((product) => {
      expect(categoryIds).toContain(product.category);
    });
  });

  it('has unique product ids', () => {
    const ids = products.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has bags and bolsos categories', () => {
    expect(categories).toHaveLength(2);
    expect(categories.map((c) => c.id)).toEqual(['bags', 'bolsos']);
  });
});
