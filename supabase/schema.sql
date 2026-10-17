-- ============================================================
-- Panaqua - Esquema completo (Fase 2)
-- Pegar en Supabase > SQL Editor > New query > Run
-- ============================================================

-- ------------------------------------------------------------
-- Secuencia de números de pedido (arranca en 1001)
-- ------------------------------------------------------------
create sequence if not exists order_number_seq start 1001;

-- ------------------------------------------------------------
-- Categorías
-- ------------------------------------------------------------
create table if not exists categorias (
  id text primary key,
  nombre text not null,
  activa boolean not null default true,
  created_at timestamptz not null default now()
);

insert into categorias (id, nombre) values
  ('bags', 'Bags'),
  ('bolsos', 'Bolsos')
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- Proveedores
-- ------------------------------------------------------------
create table if not exists proveedores (
  id bigint generated always as identity primary key,
  nombre text not null,
  telefono text,
  email text,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Métodos de pago
-- ------------------------------------------------------------
create table if not exists metodos_pago (
  id bigint primary key,
  nombre text not null,
  activo boolean not null default true,
  orden int not null default 0
);

insert into metodos_pago (id, nombre, orden) values
  (1, 'Transferencia', 0),
  (2, 'Efectivo', 1)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- Clientes
-- ------------------------------------------------------------
create table if not exists clientes (
  id bigint generated always as identity primary key,
  nombre text not null,
  telefono text not null,
  email text,
  direccion text,
  localidad text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Productos
-- ------------------------------------------------------------
create table if not exists products (
  id bigint generated always as identity primary key,
  nombre text not null,
  descripcion text,
  precio numeric(12,2) not null,
  stock int not null default 0,
  color text,
  categoria_id text references categorias(id),
  proveedor_id bigint references proveedores(id),
  image_key text,
  materiales jsonb not null default '[]'::jsonb,
  dimensiones text default '',
  activo boolean not null default true,
  destacado boolean not null default false,
  created_at timestamptz not null default now()
);

insert into products (id, nombre, descripcion, precio, stock, categoria_id, image_key, materiales, dimensiones, activo, destacado)
overriding system value
values
  (1, 'Bag Isadora', 'Bag color suela con monedero accesorio. Diseño elegante y versátil para cualquier ocasión.', 32500, 1, 'bags', 'bag-isadora', '[]'::jsonb, '', true, true),
  (2, 'Bag Tini', 'Bag color beige con pañuelo accesorio. Estilo chic y moderno.', 35000, 1, 'bags', 'bag-tini', '[]'::jsonb, '', true, true),
  (3, 'Bolso Karen', 'Bolso negro clásico. Elegancia y funcionalidad en un solo diseño.', 35900, 1, 'bolsos', 'bolso-karen', '[]'::jsonb, '', true, true),
  (4, 'Bag Flower', 'Bag color verde con toque floral. Perfecta para sumar color a tu look.', 37500, 1, 'bags', 'bag-flower', '[]'::jsonb, '', true, false),
  (5, 'Bolso Mindy', 'Bolso negro sofisticado. Ideal para el día a día con estilo.', 36900, 1, 'bolsos', 'bolso-mindy', '[]'::jsonb, '', true, false),
  (6, 'Bag Virgin', 'Bag color negro con pañuelo accesorio. Diseño refinado y moderno.', 35000, 1, 'bags', 'bag-virkin', '[]'::jsonb, '', true, false)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- Pedidos (estados: pendiente_pago | pagado | enviado | entregado | cancelado)
-- ------------------------------------------------------------
create table if not exists orders (
  id bigint generated always as identity primary key,
  order_number int not null unique default nextval('order_number_seq'),
  cliente_id bigint not null references clientes(id),
  metodo_pago_id bigint references metodos_pago(id),
  tipo_entrega text not null default 'retiro' check (tipo_entrega in ('retiro', 'envio')),
  zona_envio text,
  direccion_envio text,
  costo_envio numeric(12,2) not null default 0,
  subtotal numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  estado text not null default 'pendiente_pago'
    check (estado in ('pendiente_pago', 'pagado', 'enviado', 'entregado', 'cancelado')),
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Ítems del pedido (snapshots: nombre, precio, color, categoría, proveedor)
-- ------------------------------------------------------------
create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references orders(id) on delete cascade,
  product_id bigint references products(id),
  nombre text not null,
  precio numeric(12,2) not null,
  color text,
  categoria text,
  proveedor text,
  cantidad int not null check (cantidad > 0),
  subtotal numeric(12,2) not null
);

-- ------------------------------------------------------------
-- Configuración (datos bancarios)
-- ------------------------------------------------------------
create table if not exists settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

insert into settings (key, value) values
  ('alias', 'cm.camila.mercado'),
  ('cbu', '0000003100052648667954'),
  ('qr_url', null),
  ('precio_envio', null)
on conflict (key) do nothing;

-- ============================================================
-- RLS: anónimo solo lee catálogo/config y crea pedidos vía RPC
-- ============================================================
alter table categorias enable row level security;
alter table proveedores enable row level security;
alter table metodos_pago enable row level security;
alter table clientes enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table settings enable row level security;

drop policy if exists "anon lee categorias" on categorias;
create policy "anon lee categorias" on categorias for select using (true);
drop policy if exists "anon lee metodos de pago" on metodos_pago;
create policy "anon lee metodos de pago" on metodos_pago for select using (activo = true);
drop policy if exists "anon lee productos" on products;
create policy "anon lee productos" on products for select using (activo = true);
drop policy if exists "anon lee settings" on settings;
create policy "anon lee settings" on settings for select using (true);
-- proveedores, clientes, orders, order_items: sin acceso anónimo directo

-- ============================================================
-- RPC: crear pedido (cliente + pedido + items en una transacción)
-- Los precios y el stock se validan del lado servidor.
-- El stock se descuenta recién al marcar 'pagado' (M3).
-- ============================================================
drop function if exists crear_pedido(jsonb);
create or replace function crear_pedido(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cliente_id bigint;
  v_order_id bigint;
  v_order_number int;
  v_subtotal numeric(12,2) := 0;
  v_total numeric(12,2);
  v_item record;
  v_precio numeric(12,2);
  v_stock int;
  v_stored record;
begin
  if payload->>'nombre' is null or length(trim(payload->>'nombre')) = 0 then
    raise exception 'Falta el nombre del cliente';
  end if;
  if payload->>'telefono' is null or length(trim(payload->>'telefono')) = 0 then
    raise exception 'Falta el teléfono de contacto';
  end if;
  if coalesce(jsonb_array_length(payload->'items'), 0) = 0 then
    raise exception 'El pedido no tiene productos';
  end if;

  insert into clientes (nombre, telefono, email, direccion, localidad)
  values (
    trim(payload->>'nombre'),
    trim(payload->>'telefono'),
    nullif(trim(coalesce(payload->>'email', '')), ''),
    nullif(trim(coalesce(payload->>'direccion', '')), ''),
    nullif(trim(coalesce(payload->>'localidad', '')), '')
  )
  returning id into v_cliente_id;

  -- Validar stock y armar subtotal con precios vigentes de la BD
  for v_item in
    select (value->>'product_id')::bigint as pid, (value->>'cantidad')::int as cantidad
    from jsonb_array_elements(payload->'items')
  loop
    if v_item.pid is null or v_item.cantidad is null or v_item.cantidad < 1 then
      raise exception 'Ítem de pedido inválido';
    end if;

    select precio, stock into v_precio, v_stock
    from products where id = v_item.pid and activo = true;

    if v_precio is null then
      raise exception 'El producto % ya no está disponible', v_item.pid;
    end if;

    if v_stock < v_item.cantidad then
      select nombre into v_stored from products where id = v_item.pid;
      raise exception 'Stock insuficiente de %: quedan % unidades', v_stored.nombre, v_stock;
    end if;

    v_subtotal := v_subtotal + v_precio * v_item.cantidad;
  end loop;

  v_total := v_subtotal + coalesce((payload->>'costo_envio')::numeric, 0);

  v_order_number := nextval('order_number_seq');

  insert into orders (
    order_number, cliente_id, metodo_pago_id, tipo_entrega, zona_envio,
    direccion_envio, costo_envio, subtotal, total, notas
  ) values (
    v_order_number,
    v_cliente_id,
    nullif((payload->>'metodo_pago_id')::bigint, 0),
    coalesce(payload->>'tipo_entrega', 'retiro'),
    nullif(coalesce(payload->>'zona_envio', ''), ''),
    nullif(coalesce(payload->>'direccion_envio', ''), ''),
    coalesce((payload->>'costo_envio')::numeric, 0),
    v_subtotal,
    v_total,
    nullif(coalesce(payload->>'notas', ''), '')
  )
  returning id into v_order_id;

  insert into order_items (order_id, product_id, nombre, precio, color, categoria, proveedor, cantidad, subtotal)
  select
    v_order_id,
    p.id,
    p.nombre,
    p.precio,
    p.color,
    c.nombre,
    pr.nombre,
    (it->>'cantidad')::int,
    p.precio * (it->>'cantidad')::int
  from jsonb_array_elements(payload->'items') as it
  join products p on p.id = (it->>'product_id')::bigint
  left join categorias c on c.id = p.categoria_id
  left join proveedores pr on pr.id = p.proveedor_id
  where (it->>'cantidad')::int >= 1;

  return jsonb_build_object('order_number', v_order_number, 'order_id', v_order_id, 'total', v_total);
end;
$$;

revoke all on function crear_pedido(jsonb) from public;
grant execute on function crear_pedido(jsonb) to anon, authenticated;
