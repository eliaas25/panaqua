import { useEffect, useState } from 'react';
import { fetchOrdersAdmin } from '../../services/admin';
import { ORDER_STATUSES, getStatusInfo } from '../../utils/orderStatus';
import { formatPrice } from '../../utils/format';

const PAGO_ESTADOS = ['pagado', 'enviado', 'entregado'];

function isSameMonth(date) {
  const now = new Date();
  const d = new Date(date);
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export default function AdminReports() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrdersAdmin()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="font-body text-muted">Cargando reportes…</p>;
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-sm">
        <p className="font-body text-sm text-red-700">{error}</p>
      </div>
    );
  }

  const counts = orders.reduce((acc, o) => ({ ...acc, [o.estado]: (acc[o.estado] || 0) + 1 }), {});
  const ingresos = orders
    .filter((o) => PAGO_ESTADOS.includes(o.estado))
    .reduce((sum, o) => sum + Number(o.total), 0);
  const porCobrar = orders
    .filter((o) => o.estado === 'pendiente_pago')
    .reduce((sum, o) => sum + Number(o.total), 0);
  const mesOrders = orders.filter((o) => o.estado !== 'cancelado' && isSameMonth(o.created_at));
  const mesTotal = mesOrders.reduce((sum, o) => sum + Number(o.total), 0);

  const productTotals = {};
  for (const order of orders) {
    if (order.estado === 'cancelado') continue;
    for (const item of order.items || []) {
      const key = item.nombre;
      if (!productTotals[key]) productTotals[key] = { nombre: key, cantidad: 0, total: 0 };
      productTotals[key].cantidad += item.cantidad;
      productTotals[key].total += Number(item.subtotal);
    }
  }
  const topProducts = Object.values(productTotals)
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);

  const cards = [
    { label: 'Ingresos confirmados', value: formatPrice(ingresos), accent: true },
    { label: 'Por cobrar', value: formatPrice(porCobrar) },
    { label: 'Pedidos del mes', value: `${mesOrders.length} — ${formatPrice(mesTotal)}` },
    { label: 'Pedidos totales', value: String(orders.length) },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-text mb-6">Reportes</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white border border-border rounded-sm p-5">
            <p className="font-body text-xs text-muted uppercase tracking-wider mb-2">
              {card.label}
            </p>
            <p
              className={`font-display text-xl ${
                card.accent ? 'text-accent' : 'text-text'
              } font-semibold`}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-border rounded-sm p-5">
          <h2 className="font-body text-sm font-semibold text-text uppercase tracking-wider mb-4">
            Por estado
          </h2>
          <ul className="space-y-2">
            {Object.keys(ORDER_STATUSES).map((estado) => (
              <li key={estado} className="flex justify-between items-center">
                <span
                  className={`font-body text-xs px-2 py-0.5 rounded-sm ${getStatusInfo(estado).badge}`}
                >
                  {getStatusInfo(estado).label}
                </span>
                <span className="font-body text-sm text-text">{counts[estado] || 0}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-border rounded-sm p-5">
          <h2 className="font-body text-sm font-semibold text-text uppercase tracking-wider mb-4">
            Productos más vendidos
          </h2>
          {topProducts.length === 0 ? (
            <p className="font-body text-sm text-muted">Todavía no hay ventas.</p>
          ) : (
            <ul className="space-y-2">
              {topProducts.map((p) => (
                <li key={p.nombre} className="flex justify-between gap-3">
                  <span className="font-body text-sm text-text">{p.nombre}</span>
                  <span className="font-body text-sm text-muted">
                    {p.cantidad} u. — {formatPrice(p.total)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
