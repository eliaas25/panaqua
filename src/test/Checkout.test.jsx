import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Checkout from '../pages/Checkout';
import { CartProvider } from '../context/CartContext';
import { crearPedido } from '../services/shop';

vi.mock('../services/shop', () => ({
  fetchProducts: vi.fn(async () => []),
  fetchCategories: vi.fn(async () => []),
  fetchSettings: vi.fn(async () => ({ alias: 'mi.alias', cbu: '111', qrUrl: null })),
  fetchPaymentMethods: vi.fn(async () => [
    { id: 1, name: 'Transferencia' },
    { id: 2, name: 'Efectivo' },
  ]),
  crearPedido: vi.fn(async () => ({ order_number: 1001, total: 70000 })),
}));

const cartItem = {
  productId: 2,
  name: 'Bag Tini',
  price: 35000,
  image: 'bag-tini.webp',
  stock: 3,
  quantity: 2,
};

function renderCheckout() {
  return render(
    <MemoryRouter initialEntries={['/checkout']}>
      <Routes>
        <Route
          path="/checkout"
          element={
            <CartProvider>
              <Checkout />
            </CartProvider>
          }
        />
        <Route path="/pedido/:numero" element={<div>Pedido confirmado 1001</div>} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.clearAllMocks();
});

describe('Checkout', () => {
  it('muestra estado vacío si el carrito no tiene productos', () => {
    renderCheckout();
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
  });

  it('muestra el resumen con el total y el costo de retiro sin costo', async () => {
    localStorage.setItem('panaqua-cart', JSON.stringify([cartItem]));
    renderCheckout();
    await screen.findByText('Transferencia');
    expect(screen.getByText(/2× Bag Tini/)).toBeInTheDocument();
    expect(screen.getAllByText('$ 70.000,00').length).toBeGreaterThan(0);
    expect(screen.getByText('Retiro')).toBeInTheDocument();
    expect(screen.getByText('Sin costo')).toBeInTheDocument();
  });

  it('valida nombre y teléfono vacíos al confirmar', async () => {
    localStorage.setItem('panaqua-cart', JSON.stringify([cartItem]));
    const user = userEvent.setup();
    renderCheckout();
    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }));
    expect(screen.getByText('Ingresá tu nombre')).toBeInTheDocument();
    expect(screen.getByText('Ingresá un teléfono válido')).toBeInTheDocument();
    expect(crearPedido).not.toHaveBeenCalled();
  });

  it('pide la dirección cuando la entrega es envío', async () => {
    localStorage.setItem('panaqua-cart', JSON.stringify([cartItem]));
    const user = userEvent.setup();
    renderCheckout();
    await user.click(screen.getByRole('button', { name: /Envío a domicilio/ }));
    await user.type(screen.getByPlaceholderText('Nombre y apellido *'), 'Juan Pérez');
    await user.type(screen.getByPlaceholderText('Teléfono / WhatsApp *'), '3411234567');
    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }));
    expect(screen.getByText('Ingresá tu dirección')).toBeInTheDocument();
    expect(crearPedido).not.toHaveBeenCalled();
  });

  it('crea el pedido y navega a la confirmación', async () => {
    localStorage.setItem('panaqua-cart', JSON.stringify([cartItem]));
    const user = userEvent.setup();
    renderCheckout();

    await user.type(screen.getByPlaceholderText('Nombre y apellido *'), 'Juan Pérez');
    await user.type(screen.getByPlaceholderText('Teléfono / WhatsApp *'), '3411234567');
    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    expect(await screen.findByText('Pedido confirmado 1001')).toBeInTheDocument();
    expect(crearPedido).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: 'Juan Pérez',
        telefono: '3411234567',
        tipo_entrega: 'retiro',
        costo_envio: 0,
        metodo_pago_id: 1,
        items: [{ product_id: 2, cantidad: 2 }],
      })
    );
    expect(JSON.parse(localStorage.getItem('panaqua-cart'))).toEqual([]);
    expect(JSON.parse(sessionStorage.getItem('panaqua-last-order'))).toMatchObject({
      order_number: 1001,
      total: 70000,
    });
  });
});
