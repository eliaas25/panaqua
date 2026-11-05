import { useEffect, useState } from 'react';
import { fetchOrdersAdmin, cambiarEstadoPedido } from '../../services/admin';
import { getStatusInfo, NEXT_STATES, ACTION_LABELS } from '../../utils/orderStatus';
import { formatPrice, formatShippingCost } from '../../utils/format';

const FILTERS = ['todos', 'pendiente_pago', 'pagado', 'enviado', 'entregado', 'cancelado'];

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [filter, setFilter] = useState('todos');
  const [expandedId, setExpandedId] = useState(null);
  const [busyNumber, setBusyNumber] = useState(null);

  const load = () =>
    fetchOrdersAdmin()
      .then((data) => {
        setOrders(data);
        setError('');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const counts = orders.reduce((acc, o) => ({ ...acc, [o.estado]: (acc[o.estado] || 0) + 1 }), {});

  const visible = filter === 'todos' ? orders : orders.filter((o) => o.estado === filter);

  const handleChangeState = async (order, nuevo) => {
    setActionError('');
    let msg = `¿Pasar el pedido #${order.order_number} a "${ACTION_LABELS[nuevo]}"?`;
    if (nuevo === 'pagado') msg += '\n\nSe descontará el stock de los productos.';
    if (order.estado === 'pagado' && (nuevo === 'cancelado' || nuevo === 'pendiente_pago')) {
      msg += '\n\nSe devolverá el stock de los productos.';
    }
    if (!window.confirm(msg)) return;

    setBusyNumber(order.order_number);
    try {
      await cambiarEstadoPedido(order.order_number, nuevo);
      await load();
    } catch (err) {
      setActionError(`Pedido #${order.order_number}: ${err.message}`);
    } finally {
      setBusyNumber(null);
    }
  };

  if (loading) {
    return <p className="font-body text-muted">Cargando pedidos…</p>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-sm">
        <p className="font-body text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl text-text">Pedidos</h1>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const label = f === 'todos' ? 'Todos' : getStatusInfo(f).label;
            const count = f === 'todos' ? orders.length : counts[f] || 0;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`font-body text-xs px-3 py-1.5 rounded-sm border transition-colors ${
                  filter === f
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white border-border text-text hover:border-accent'
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {actionError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm">
          <p className="font-body text-sm text-red-700">{actionError}</p>
        </div>
      )}

      {visible.length === 0 ? (
        <p className="font-body text-muted">No hay pedidos en este estado.</p>
      ) : (
        <div className="space-y-3">
          {visible.map((order) => {
            const info = getStatusInfo(order.estado);
            const nextStates = NEXT_STATES[order.estado] || [];
            const isExpanded = expandedId === order.id;
            const isBusy = busyNumber === order.order_number;

            return (
              <div key={order.id} className="bg-white border border-border rounded-sm">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="w-full flex flex-wrap items-center gap-4 px-4 py-3 text-left hover:bg-bg transition-colors"
                >
                  <span className="font-body text-sm font-semibold text-text">
                    #{order.order_number}
                  </span>
                  <span className={`font-body text-xs px-2 py-0.5 rounded-sm ${info.badge}`}>
                    {info.label}
                  </span>
                  <span className="font-body text-sm text-text">{order.cliente?.nombre}</span>
                  <span className="font-body text-sm text-muted">{order.cliente?.telefono}</span>
                  <span className="font-body text-xs text-muted">
                    {formatDate(order.created_at)}
                  </span>
                  <span className="ml-auto font-body text-sm font-semibold text-accent">
                    {formatPrice(order.total)}
                  </span>
                  <span className="font-body text-xs text-muted">{isExpanded ? '▲' : '▼'}</span>
                </button>

                {isExpanded && (
                  <div className="border-t border-border px-4 py-4 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-body text-xs text-muted uppercase tracking-wider mb-2">
                          Productos
                        </h3>
                        <ul className="space-y-1">
                          {order.items?.map((item) => (
                            <li key={item.id} className="font-body text-sm text-text">
                              {item.cantidad}× {item.nombre} —{' '}
                              {formatPrice(item.precio * item.cantidad)}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-body text-xs text-muted uppercase tracking-wider mb-2">
                          Detalle
                        </h3>
                        <p className="font-body text-sm text-text">
                          {order.tipo_entrega === 'envio'
                            ? `Envío — ${order.zona_envio || ''} (${
                                order.costo_envio ? formatShippingCost(order.costo_envio) : 'Gratis'
                              })`
                            : 'Retiro en el local'}
                        </p>
                        {order.tipo_entrega === 'envio' && order.direccion_envio && (
                          <p className="font-body text-sm text-muted">{order.direccion_envio}</p>
                        )}
                        <p className="font-body text-sm text-muted">
                          Pago: {order.metodo?.nombre || '—'}
                        </p>
                        {order.notas && (
                          <p className="font-body text-sm text-muted italic">
                            Notas: {order.notas}
                          </p>
                        )}
                      </div>
                    </div>

                    {nextStates.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                        {nextStates.map((nuevo) => {
                          const isDanger = nuevo === 'cancelado';
                          return (
                            <button
                              key={nuevo}
                              disabled={isBusy}
                              onClick={() => handleChangeState(order, nuevo)}
                              className={`font-body text-xs px-3 py-1.5 rounded-sm border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                isDanger
                                  ? 'border-red-300 text-red-700 hover:bg-red-50'
                                  : 'border-accent text-accent hover:bg-accent hover:text-white'
                              }`}
                            >
                              {ACTION_LABELS[nuevo]}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
