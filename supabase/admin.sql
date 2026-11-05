-- ============================================================
-- Panaqua - M3: Panel de administración
-- Pegar en Supabase > SQL Editor > New query > Run
-- ============================================================

-- ------------------------------------------------------------
-- 0) Settings: solo datos de transferencia (alias, cbu, razón social)
-- ------------------------------------------------------------
delete from settings where key in ('qr_url', 'precio_envio');
insert into settings (key, value) values ('razon_social', '')
on conflict (key) do update set value = settings.value;

-- ------------------------------------------------------------
-- 1) RLS: el usuario logueado (authenticated) administra todo.
--    El rol anónimo mantiene solo sus políticas de lectura/creación.
-- ------------------------------------------------------------
drop policy if exists "admin categorias" on categorias;
create policy "admin categorias" on categorias for all to authenticated using (true) with check (true);

drop policy if exists "admin proveedores" on proveedores;
create policy "admin proveedores" on proveedores for all to authenticated using (true) with check (true);

drop policy if exists "admin metodos de pago" on metodos_pago;
create policy "admin metodos de pago" on metodos_pago for all to authenticated using (true) with check (true);

drop policy if exists "admin clientes" on clientes;
create policy "admin clientes" on clientes for all to authenticated using (true) with check (true);

drop policy if exists "admin productos" on products;
create policy "admin productos" on products for all to authenticated using (true) with check (true);

drop policy if exists "admin pedidos" on orders;
create policy "admin pedidos" on orders for all to authenticated using (true) with check (true);

drop policy if exists "admin items de pedido" on order_items;
create policy "admin items de pedido" on order_items for all to authenticated using (true) with check (true);

drop policy if exists "admin settings" on settings;
create policy "admin settings" on settings for all to authenticated using (true) with check (true);

-- ------------------------------------------------------------
-- 2) RPC: cambiar estado de un pedido (solo logueados).
--    Al pasar a 'pagado' descuenta stock de cada ítem.
--    Al salir de 'pagado' (cancelar o volver a pendiente) lo devuelve.
--    Transiciones válidas:
--      pendiente_pago -> pagado | cancelado
--      pagado         -> enviado | pendiente_pago | cancelado
--      enviado        -> entregado | cancelado
--      entregado      -> (terminal)
--      cancelado      -> (terminal)
-- ------------------------------------------------------------
drop function if exists cambiar_estado_pedido(int, text);
create or replace function cambiar_estado_pedido(p_order_number int, p_nuevo_estado text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order orders%rowtype;
  v_item record;
begin
  if p_nuevo_estado not in ('pendiente_pago', 'pagado', 'enviado', 'entregado', 'cancelado') then
    raise exception 'Estado inválido: %', p_nuevo_estado;
  end if;

  select * into v_order
  from orders
  where order_number = p_order_number
  for update;

  if not found then
    raise exception 'Pedido % no encontrado', p_order_number;
  end if;

  if v_order.estado = p_nuevo_estado then
    return jsonb_build_object('order_number', p_order_number, 'estado', v_order.estado, 'changed', false);
  end if;

  if not (
    (v_order.estado = 'pendiente_pago' and p_nuevo_estado in ('pagado', 'cancelado'))
    or (v_order.estado = 'pagado' and p_nuevo_estado in ('enviado', 'pendiente_pago', 'cancelado'))
    or (v_order.estado = 'enviado' and p_nuevo_estado in ('entregado', 'cancelado'))
  ) then
    raise exception 'No se puede pasar de "%" a "%"', v_order.estado, p_nuevo_estado;
  end if;

  -- Entrar a 'pagado': descontar stock (con guarda de stock insuficiente)
  if p_nuevo_estado = 'pagado' then
    for v_item in
      select product_id, cantidad from order_items where order_id = v_order.id and product_id is not null
    loop
      update products
      set stock = stock - v_item.cantidad
      where id = v_item.product_id and stock >= v_item.cantidad;
      if not found then
        raise exception 'Stock insuficiente para descontar (pedido %, producto %)', p_order_number, v_item.product_id;
      end if;
    end loop;
  end if;

  -- Salir de 'pagado' (cancelar o volver a pendiente): devolver stock
  if v_order.estado = 'pagado' then
    for v_item in
      select product_id, cantidad from order_items where order_id = v_order.id and product_id is not null
    loop
      update products set stock = stock + v_item.cantidad where id = v_item.product_id;
    end loop;
  end if;

  update orders
  set estado = p_nuevo_estado, updated_at = now()
  where id = v_order.id;

  return jsonb_build_object('order_number', p_order_number, 'estado', p_nuevo_estado, 'changed', true);
end;
$$;

revoke all on function cambiar_estado_pedido(int, text) from public;
revoke all on function cambiar_estado_pedido(int, text) from anon;
grant execute on function cambiar_estado_pedido(int, text) to authenticated;

-- ============================================================
-- 3) Usuario admin: crear en Authentication > Users > Add user
--    (email + contraseña, con "Auto Confirm User" marcado).
--    Entrada al panel: #/admin
-- ============================================================
