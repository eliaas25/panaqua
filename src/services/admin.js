import { supabase } from '../lib/supabase';

function requireSupabase() {
  if (!supabase) throw new Error('Supabase no está configurado.');
}

export async function fetchOrdersAdmin() {
  requireSupabase();
  const { data, error } = await supabase
    .from('orders')
    .select('*, cliente:clientes(*), metodo:metodos_pago(*), items:order_items(*)')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function cambiarEstadoPedido(orderNumber, nuevoEstado) {
  requireSupabase();
  const { data, error } = await supabase.rpc('cambiar_estado_pedido', {
    p_order_number: orderNumber,
    p_nuevo_estado: nuevoEstado,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchProductsAdmin() {
  requireSupabase();
  const { data, error } = await supabase.from('products').select('*').order('id');
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProduct(id, patch) {
  requireSupabase();
  const { error } = await supabase.from('products').update(patch).eq('id', id);
  if (error) throw new Error(error.message);
}
