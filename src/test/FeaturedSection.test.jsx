import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FeaturedSection from '../components/FeaturedSection';
import { CartProvider } from '../context/CartContext';
import { products } from '../data/products';

const renderSection = (list, onProductClick = () => {}) =>
  render(
    <CartProvider>
      <FeaturedSection products={list} onProductClick={onProductClick} />
    </CartProvider>
  );

describe('FeaturedSection', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('muestra solo los productos destacados', () => {
    renderSection(products);
    expect(screen.getByText('Destacados')).toBeInTheDocument();
    expect(screen.getByText('Bag Isadora')).toBeInTheDocument();
    expect(screen.getByText('Bag Tini')).toBeInTheDocument();
    expect(screen.getByText('Bolso Karen')).toBeInTheDocument();
    expect(screen.queryByText('Bag Flower')).not.toBeInTheDocument();
    expect(screen.queryByText('Bolso Mindy')).not.toBeInTheDocument();
    expect(screen.queryByText('Bag Virgin')).not.toBeInTheDocument();
  });

  it('oculta la sección si no hay destacados', () => {
    const noneFeatured = products.map((p) => ({ ...p, featured: false }));
    renderSection(noneFeatured);
    expect(screen.queryByText('Destacados')).not.toBeInTheDocument();
    expect(screen.queryByText('Bag Isadora')).not.toBeInTheDocument();
  });

  it('abre el modal al hacer click en un destacado', () => {
    const onProductClick = vi.fn();
    renderSection(products, onProductClick);
    fireEvent.click(screen.getByText('Bag Tini'));
    expect(onProductClick).toHaveBeenCalledTimes(1);
    expect(onProductClick).toHaveBeenCalledWith(expect.objectContaining({ name: 'Bag Tini' }));
  });
});
