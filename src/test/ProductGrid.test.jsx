import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductGrid from '../components/ProductGrid';
import { products } from '../data/products';

describe('ProductGrid', () => {
  it('renders all products', () => {
    render(<ProductGrid products={products} onProductClick={() => {}} />);
    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it('renders the correct number of product cards', () => {
    render(<ProductGrid products={products} onProductClick={() => {}} />);
    const names = products.map((p) => p.name);
    names.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('shows empty state when no products', () => {
    render(<ProductGrid products={[]} onProductClick={() => {}} />);
    expect(screen.getByText('No se encontraron productos')).toBeInTheDocument();
  });

  it('renders filtered subset correctly', () => {
    const bags = products.filter((p) => p.category === 'bags');
    render(<ProductGrid products={bags} onProductClick={() => {}} />);
    bags.forEach((bag) => {
      expect(screen.getByText(bag.name)).toBeInTheDocument();
    });
    const bolsos = products.filter((p) => p.category === 'bolsos');
    bolsos.forEach((bolso) => {
      expect(screen.queryByText(bolso.name)).not.toBeInTheDocument();
    });
  });
});
