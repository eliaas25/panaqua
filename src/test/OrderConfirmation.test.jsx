import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import OrderConfirmation from '../pages/OrderConfirmation';

vi.mock('../services/shop', () => ({
  fetchProducts: vi.fn(async () => []),
  fetchCategories: vi.fn(async () => []),
  fetchPaymentMethods: vi.fn(async () => []),
  crearPedido: vi.fn(),
  fetchSettings: vi.fn(async () => ({ alias: 'cm.camila.mercado', cbu: '00000031', qrUrl: null })),
}));

const order = {
  order_number: 1001,
  nombre: 'Juan Pérez',
  tipo_entrega: 'retiro',
  zona_nombre: '',
  costo_envio: 0,
  subtotal: 70000,
  total: 70000,
  metodo_nombre: 'Transferencia',
  items: [{ name: 'Bag Tini', quantity: 2, price: 35000, image: 'x.webp' }],
};

function renderConfirmation(pathname, state = null) {
  return render(
    <MemoryRouter initialEntries={[{ pathname, state }]}>
      <Routes>
        <Route path="/pedido/:numero" element={<OrderConfirmation />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  sessionStorage.clear();
  vi.clearAllMocks();
});

describe('OrderConfirmation', () => {
  it('muestra resumen, datos de transferencia y link de WhatsApp con el número de pedido', async () => {
    renderConfirmation('/pedido/1001', order);

    expect(screen.getByText('¡Tu pedido fue registrado!')).toBeInTheDocument();
    expect(screen.getByText(/#1001/)).toBeInTheDocument();
    expect(screen.getByText(/2× Bag Tini/)).toBeInTheDocument();
    expect(await screen.findByText('cm.camila.mercado')).toBeInTheDocument();
    expect(screen.getByText('00000031')).toBeInTheDocument();

    const waLink = await screen.findByRole('link', { name: 'Enviar por WhatsApp' });
    expect(waLink.href).toContain('wa.me');
    expect(decodeURIComponent(waLink.href)).toContain('#1001');
  });

  it('muestra pago en efectivo sin datos bancarios si el método es Efectivo', async () => {
    renderConfirmation('/pedido/1002', { ...order, order_number: 1002, metodo_nombre: 'Efectivo' });

    expect(await screen.findByText(/en efectivo al retirar/)).toBeInTheDocument();
    expect(screen.queryByText('cm.camila.mercado')).not.toBeInTheDocument();
  });

  it('muestra el costo de envío como "A coordinar" si no tiene precio fijo', async () => {
    renderConfirmation('/pedido/1003', {
      ...order,
      order_number: 1003,
      tipo_entrega: 'envio',
      zona_nombre: 'Gran Rosario',
      costo_envio: null,
      total: 70000,
    });

    expect(await screen.findByText(/Envío — Gran Rosario/)).toBeInTheDocument();
    expect(screen.getByText('A coordinar')).toBeInTheDocument();
  });

  it('muestra "Gratis" cuando el envío es sin costo', async () => {
    renderConfirmation('/pedido/1004', {
      ...order,
      order_number: 1004,
      tipo_entrega: 'envio',
      zona_nombre: 'Rosario ciudad',
      costo_envio: 0,
      total: 70000,
    });

    expect(await screen.findByText(/Envío — Rosario ciudad/)).toBeInTheDocument();
    expect(screen.getByText('Gratis')).toBeInTheDocument();
  });

  it('usa sessionStorage como respaldo si se refresca la página', async () => {
    sessionStorage.setItem('panaqua-last-order', JSON.stringify(order));
    renderConfirmation('/pedido/1001');

    expect(await screen.findByText('¡Tu pedido fue registrado!')).toBeInTheDocument();
    expect(screen.getByText(/#1001/)).toBeInTheDocument();
  });

  it('muestra vista de consulta si no hay datos del pedido', () => {
    renderConfirmation('/pedido/5555');

    expect(screen.getByText('Pedido #5555')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Consultar por WhatsApp/ })).toBeInTheDocument();
  });
});
