import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
  beforeEach(() => {
    localStorage.clear();
  });

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

  it('shows the added badge with quantity after adding a product', async () => {
    renderGrid({ products });
    const addButton = screen.getAllByText('Agregar')[0];
    fireEvent.click(addButton);
    expect(await screen.findByText('✓ Agregado ×1')).toBeInTheDocument();
  });

  it('updates the badge quantity when adding another unit', async () => {
    const productsWithStock = products.map((p, i) => (i === 0 ? { ...p, stock: 5 } : p));
    renderGrid({ products: productsWithStock });
    const addButton = screen.getAllByText('Agregar')[0];
    fireEvent.click(addButton);
    expect(await screen.findByText('✓ Agregado ×1')).toBeInTheDocument();
    fireEvent.click(addButton);
    expect(await screen.findByText('✓ Agregado ×2')).toBeInTheDocument();
  });
});
