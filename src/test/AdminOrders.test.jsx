import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminOrders from '../pages/admin/AdminOrders';

const fetchOrdersAdmin = vi.fn();
const cambiarEstadoPedido = vi.fn();

vi.mock('../services/admin', () => ({
  fetchOrdersAdmin: (...args) => fetchOrdersAdmin(...args),
  cambiarEstadoPedido: (...args) => cambiarEstadoPedido(...args),
}));

const pendiente = {
  id: 1,
  order_number: 1001,
  estado: 'pendiente_pago',
  total: 70000,
  subtotal: 70000,
  costo_envio: 0,
  tipo_entrega: 'retiro',
  created_at: '2026-11-04T10:00:00Z',
  cliente: { nombre: 'Juan Pérez', telefono: '3415551111' },
  metodo: { nombre: 'Transferencia' },
  items: [{ id: 11, nombre: 'Bag Tini', cantidad: 2, precio: 35000, subtotal: 70000 }],
};

const entregado = {
  ...pendiente,
  id: 2,
  order_number: 1002,
  estado: 'entregado',
  cliente: { nombre: 'María López', telefono: '3415552222' },
};

describe('AdminOrders', () => {
  beforeEach(() => {
    fetchOrdersAdmin.mockReset();
    cambiarEstadoPedido.mockReset();
    fetchOrdersAdmin.mockResolvedValue([pendiente, entregado]);
  });

  it('lista los pedidos con número, cliente, estado y total', async () => {
    render(<AdminOrders />);
    expect(await screen.findByText('#1001')).toBeInTheDocument();
    expect(screen.getByText('#1002')).toBeInTheDocument();
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('María López')).toBeInTheDocument();
    expect(screen.getByText('Pendiente de pago')).toBeInTheDocument();
    expect(screen.getByText('Entregado')).toBeInTheDocument();
    expect(screen.getAllByText('$ 70.000,00')).toHaveLength(2);
  });

  it('filtra por estado', async () => {
    render(<AdminOrders />);
    await screen.findByText('#1001');
    fireEvent.click(screen.getByRole('button', { name: 'Entregado (1)' }));
    expect(screen.queryByText('#1001')).not.toBeInTheDocument();
    expect(screen.getByText('#1002')).toBeInTheDocument();
  });

  it('muestra las acciones disponibles al expandir un pedido', async () => {
    render(<AdminOrders />);
    await screen.findByText('#1001');
    fireEvent.click(screen.getByText('#1001'));
    expect(screen.getByText(/2× Bag Tini/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Marcar pagado' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar pedido' })).toBeInTheDocument();
  });

  it('no muestra acciones en un pedido entregado (estado terminal)', async () => {
    render(<AdminOrders />);
    await screen.findByText('#1002');
    fireEvent.click(screen.getByText('#1002'));
    expect(screen.getByText(/2× Bag Tini/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Marcar pagado' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Marcar entregado' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancelar pedido' })).not.toBeInTheDocument();
  });

  it('muestra error si la carga falla', async () => {
    fetchOrdersAdmin.mockRejectedValue(new Error('Supabase no está configurado.'));
    render(<AdminOrders />);
    expect(await screen.findByText('Supabase no está configurado.')).toBeInTheDocument();
  });
});
