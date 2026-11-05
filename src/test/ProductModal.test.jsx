import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductModal from '../components/ProductModal';
import { CartProvider } from '../context/CartContext';
import { products } from '../data/products';

const product = { ...products[0], stock: 5 };

const renderModal = (onClose = () => {}) =>
  render(
    <CartProvider>
      <ProductModal product={product} onClose={onClose} />
    </CartProvider>
  );

describe('ProductModal', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts the stepper at 1 and increments up to stock', () => {
    renderModal();
    expect(screen.getByText('1')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Sumar cantidad'));
    expect(screen.getByText('2')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Sumar cantidad'));
    fireEvent.click(screen.getByLabelText('Sumar cantidad'));
    fireEvent.click(screen.getByLabelText('Sumar cantidad'));
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByLabelText('Sumar cantidad')).toBeDisabled();
    expect(screen.getByLabelText('Restar cantidad')).not.toBeDisabled();
  });

  it('does not go below 1', () => {
    renderModal();
    expect(screen.getByLabelText('Restar cantidad')).toBeDisabled();
  });

  it('hides the stepper when stock is 1', () => {
    render(
      <CartProvider>
        <ProductModal product={products[0]} onClose={() => {}} />
      </CartProvider>
    );
    expect(screen.queryByLabelText('Sumar cantidad')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Restar cantidad')).not.toBeInTheDocument();
    expect(screen.getByText('Agregar al carrito')).toBeInTheDocument();
  });

  it('removes the item when decreasing from 1', () => {
    localStorage.setItem(
      'panaqua-cart',
      JSON.stringify([
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: 5,
          quantity: 1,
        },
      ])
    );
    renderModal();
    expect(screen.getByText('✓ En el carrito')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Restar cantidad'));
    expect(JSON.parse(localStorage.getItem('panaqua-cart'))).toHaveLength(0);
    expect(screen.getByText('Agregar al carrito')).toBeInTheDocument();
    expect(screen.queryByText('✓ En el carrito')).not.toBeInTheDocument();
  });

  it('shows the stepper when the item is in the cart even with stock 1', () => {
    localStorage.setItem(
      'panaqua-cart',
      JSON.stringify([
        {
          productId: products[0].id,
          name: products[0].name,
          price: products[0].price,
          image: products[0].image,
          stock: 1,
          quantity: 1,
        },
      ])
    );
    render(
      <CartProvider>
        <ProductModal product={products[0]} onClose={() => {}} />
      </CartProvider>
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Restar cantidad'));
    expect(JSON.parse(localStorage.getItem('panaqua-cart'))).toHaveLength(0);
    expect(screen.getByText('Agregar al carrito')).toBeInTheDocument();
  });

  it('adds the selected quantity to the cart', () => {
    const onClose = vi.fn();
    renderModal(onClose);
    fireEvent.click(screen.getByLabelText('Sumar cantidad'));
    fireEvent.click(screen.getByText('Agregar al carrito'));
    const saved = JSON.parse(localStorage.getItem('panaqua-cart'));
    expect(saved).toHaveLength(1);
    expect(saved[0].quantity).toBe(2);
    expect(onClose).toHaveBeenCalled();
  });

  it('shows in-cart quantity and updates it live', () => {
    localStorage.setItem(
      'panaqua-cart',
      JSON.stringify([
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: 5,
          quantity: 3,
        },
      ])
    );
    renderModal();
    expect(screen.getByText('✓ En el carrito')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.queryByText('Agregar al carrito')).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Sumar cantidad'));
    expect(screen.getByText('4')).toBeInTheDocument();
    const saved = JSON.parse(localStorage.getItem('panaqua-cart'));
    expect(saved[0].quantity).toBe(4);
    fireEvent.click(screen.getByLabelText('Restar cantidad'));
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('panaqua-cart'))[0].quantity).toBe(3);
  });
});
