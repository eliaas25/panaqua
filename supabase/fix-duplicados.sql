-- ============================================================
-- Panaqua - Limpieza de duplicados
-- Ejecutar en Supabase > SQL Editor si los productos aparecen repetidos
-- (borra los pedidos de prueba y reinserta los 6 productos originales)
-- ============================================================

delete from order_items;
delete from orders;
delete from clientes;
delete from products;

insert into products (id, nombre, descripcion, precio, stock, categoria_id, image_key, materiales, dimensiones, activo, destacado)
overriding system value
values
  (1, 'Bag Isadora', 'Bag color suela con monedero accesorio. Diseño elegante y versátil para cualquier ocasión.', 32500, 8, 'bags', 'bag-isadora', '[]'::jsonb, '', true, true),
  (2, 'Bag Tini', 'Bag color beige con pañuelo accesorio. Estilo chic y moderno.', 35000, 3, 'bags', 'bag-tini', '[]'::jsonb, '', true, true),
  (3, 'Bolso Karen', 'Bolso negro clásico. Elegancia y funcionalidad en un solo diseño.', 35900, 12, 'bolsos', 'bolso-karen', '[]'::jsonb, '', true, true),
  (4, 'Bag Flower', 'Bag color verde con toque floral. Perfecta para sumar color a tu look.', 37500, 0, 'bags', 'bag-flower', '[]'::jsonb, '', true, false),
  (5, 'Bolso Mindy', 'Bolso negro sofisticado. Ideal para el día a día con estilo.', 36900, 2, 'bolsos', 'bolso-mindy', '[]'::jsonb, '', true, false),
  (6, 'Bag Virgin', 'Bag color negro con pañuelo accesorio. Diseño refinado y moderno.', 35000, 10, 'bags', 'bag-virkin', '[]'::jsonb, '', true, false)
on conflict (id) do nothing;

select setval('order_number_seq', 1001, false);
