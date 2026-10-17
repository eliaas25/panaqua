import { supabase } from '../lib/supabase';
import { products as localProducts, categories as localCategories } from '../data/products';
import { resolveProductImage } from '../data/productImages';
import { payments } from '../config/payments';

export const localPaymentMethods = [
  { id: 1, name: 'Transferencia' },
  { id: 2, name: 'Efectivo' },
];

function mapProduct(row) {
  return {
    id: row.id,
    name: row.nombre,
    description: row.descripcion || '',
    price: Number(row.precio),
    category: row.categoria_id,
    color: row.color || '',
    materials: row.materiales || [],
    dimensions: row.dimensiones || '',
    stock: row.stock,
    image: resolveProductImage(row.image_key),
    featured: row.destacado,
  };
}

export async function fetchProducts() {
  if (!supabase) return localProducts;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('activo', true)
      .order('id');
    if (error) throw error;
    return data.map(mapProduct);
  } catch (err) {
    console.warn('Supabase no disponible, usando productos locales:', err.message);
    return localProducts;
  }
}

export async function fetchCategories() {
  if (!supabase) return localCategories;
  try {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('activa', true)
      .order('id');
    if (error) throw error;
    return data.map((c) => ({ id: c.id, name: c.nombre }));
  } catch {
    return localCategories;
  }
}

export async function fetchPaymentMethods() {
  if (!supabase) return localPaymentMethods;
  try {
    const { data, error } = await supabase
      .from('metodos_pago')
      .select('*')
      .eq('activo', true)
      .order('orden');
    if (error) throw error;
    return data.map((m) => ({ id: m.id, name: m.nombre }));
  } catch {
    return localPaymentMethods;
  }
}

export async function fetchSettings() {
  const local = {
    alias: payments.alias,
    cbu: payments.cbu,
    qrUrl: payments.qrUrl,
  };
  if (!supabase) return local;
  try {
    const { data, error } = await supabase.from('settings').select('key, value');
    if (error) throw error;
    const map = Object.fromEntries(data.map((s) => [s.key, s.value]));
    return {
      alias: map.alias || local.alias,
      cbu: map.cbu || local.cbu,
      qrUrl: map.qr_url || local.qrUrl,
    };
  } catch {
    return local;
  }
}

export async function crearPedido(payload) {
  if (!supabase) {
    throw new Error('Supabase no está configurado (faltan VITE_SUPABASE_URL / ANON_KEY).');
  }
  const { data, error } = await supabase.rpc('crear_pedido', { payload });
  if (error) throw new Error(error.message);
  return data;
}
