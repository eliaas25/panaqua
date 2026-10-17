import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductGrid from '../components/ProductGrid';
import { CartProvider } from '../context/CartContext';
import { products } from '../data/products';

const renderGrid = (gridProps) =>
  render(
    <CartProvider>
      <ProductGrid {...gridProps} onProductClick={() => {}} />
    </CartProvider>
  );

describe('ProductGrid', () => {
  it('renders all products', () => {
    renderGrid({ products });
    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it('renders the correct number of product cards', () => {
    renderGrid({ products });
    const names = products.map((p) => p.name);
    names.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('shows empty state when no products', () => {
    renderGrid({ products: [] });
    expect(screen.getByText('No se encontraron productos')).toBeInTheDocument();
  });

  it('renders filtered subset correctly', () => {
    const bags = products.filter((p) => p.category === 'bags');
    renderGrid({ products: bags });
    bags.forEach((bag) => {
      expect(screen.getByText(bag.name)).toBeInTheDocument();
    });
    const bolsos = products.filter((p) => p.category === 'bolsos');
    bolsos.forEach((bolso) => {
      expect(screen.queryByText(bolso.name)).not.toBeInTheDocument();
    });
  });

  it('does not show stock badges', () => {
    renderGrid({ products });
    expect(screen.queryByText(/En stock/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Quedan/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Queda /)).not.toBeInTheDocument();
  });
});
