import { useReducer, useEffect } from 'react';
import { CartContext } from './cartContextInstance';

const STORAGE_KEY = 'panaqua-cart';

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { product } = action;
      const quantity = Math.max(1, action.quantity || 1);
      const existing = state.find((item) => item.productId === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return state.map((item) =>
          item.productId === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [
        ...state,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          quantity: Math.min(quantity, product.stock),
        },
      ];
    }
    case 'REMOVE':
      return state.filter((item) => item.productId !== action.productId);
    case 'UPDATE_QUANTITY':
      return state.map((item) =>
        item.productId === action.productId
          ? { ...item, quantity: Math.max(1, Math.min(action.quantity, item.stock)) }
          : item
      );
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addItem: (product, quantity = 1) => dispatch({ type: 'ADD', product, quantity }),
        removeItem: (productId) => dispatch({ type: 'REMOVE', productId }),
        updateQuantity: (productId, quantity) =>
          dispatch({ type: 'UPDATE_QUANTITY', productId, quantity }),
        clearCart: () => dispatch({ type: 'CLEAR' }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
