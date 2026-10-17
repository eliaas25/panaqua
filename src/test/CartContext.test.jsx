import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider } from '../context/CartContext';
import { useCart } from '../hooks/useCart';

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

const mockProduct = {
  id: 1,
  name: 'Bag Test',
  price: 1000,
  image: 'test.webp',
  stock: 3,
};

const otherProduct = {
  id: 2,
  name: 'Bolso Test',
  price: 2000,
  image: 'test2.webp',
  stock: 5,
};

function setup() {
  localStorage.clear();
  return renderHook(() => useCart(), { wrapper });
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts empty', () => {
    const { result } = setup();
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('adds a product with quantity 1', () => {
    const { result } = setup();
    act(() => result.current.addItem(mockProduct));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.totalItems).toBe(1);
  });

  it('increments quantity when adding the same product twice', () => {
    const { result } = setup();
    act(() => result.current.addItem(mockProduct));
    act(() => result.current.addItem(mockProduct));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('never exceeds stock when adding', () => {
    const { result } = setup();
    act(() => result.current.addItem(mockProduct));
    act(() => result.current.addItem(mockProduct));
    act(() => result.current.addItem(mockProduct));
    act(() => result.current.addItem(mockProduct));
    expect(result.current.items[0].quantity).toBe(3);
  });

  it('adds different products separately and computes total price', () => {
    const { result } = setup();
    act(() => result.current.addItem(mockProduct));
    act(() => result.current.addItem(otherProduct));
    expect(result.current.items).toHaveLength(2);
    expect(result.current.totalPrice).toBe(3000);
  });

  it('removes a product', () => {
    const { result } = setup();
    act(() => result.current.addItem(mockProduct));
    act(() => result.current.addItem(otherProduct));
    act(() => result.current.removeItem(mockProduct.id));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].productId).toBe(2);
  });

  it('updates quantity within stock limits', () => {
    const { result } = setup();
    act(() => result.current.addItem(mockProduct));
    act(() => result.current.updateQuantity(mockProduct.id, 3));
    expect(result.current.items[0].quantity).toBe(3);
  });

  it('does not update quantity above stock', () => {
    const { result } = setup();
    act(() => result.current.addItem(mockProduct));
    act(() => result.current.updateQuantity(mockProduct.id, 10));
    expect(result.current.items[0].quantity).toBe(3);
  });

  it('does not update quantity below 1', () => {
    const { result } = setup();
    act(() => result.current.addItem(mockProduct));
    act(() => result.current.updateQuantity(mockProduct.id, 0));
    expect(result.current.items[0].quantity).toBe(1);
  });

  it('clears the cart', () => {
    const { result } = setup();
    act(() => result.current.addItem(mockProduct));
    act(() => result.current.addItem(otherProduct));
    act(() => result.current.clearCart());
    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
  });

  it('persists cart to localStorage', () => {
    const { result } = setup();
    act(() => result.current.addItem(mockProduct));
    const saved = JSON.parse(localStorage.getItem('panaqua-cart'));
    expect(saved).toHaveLength(1);
    expect(saved[0].name).toBe('Bag Test');
  });

  it('restores cart from localStorage on mount', () => {
    localStorage.setItem(
      'panaqua-cart',
      JSON.stringify([
        { productId: 1, name: 'Bag Test', price: 1000, image: 'x.webp', stock: 3, quantity: 2 },
      ])
    );
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.totalItems).toBe(2);
  });
});
