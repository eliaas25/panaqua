import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { formatPrice, formatShippingCost } from '../utils/format';
import { whatsappLink } from '../config/site';
import { fetchSettings } from '../services/shop';

function loadStoredOrder(numero) {
  try {
    const raw = sessionStorage.getItem('panaqua-last-order');
    if (!raw) return null;
    const order = JSON.parse(raw);
    return String(order.order_number) === String(numero) ? order : null;
  } catch {
    return null;
  }
}

export default function OrderConfirmation() {
  const { numero } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order] = useState(() => location.state || loadStoredOrder(numero));
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchSettings().then(setSettings);
  }, []);

  const buildWhatsAppMessage = () => {
    if (!order) return `Hola Panaqua! Hice el pedido #${numero}.`;
    const lines = [
      `Hola Panaqua! Ya hice el pedido #${order.order_number}.`,
      '',
      ...order.items.map(
        (item) => `• ${item.quantity}× ${item.name} — ${formatPrice(item.price * item.quantity)}`
      ),
      '',
      `Total: ${formatPrice(order.total)}`,
      `Nombre: ${order.nombre}`,
      order.tipo_entrega === 'envio'
        ? `Entrega: Envío a ${order.zona_nombre} (${formatShippingCost(order.costo_envio)})`
        : 'Entrega: Retiro en el local',
      order.metodo_nombre ? `Pago: ${order.metodo_nombre}` : '',
      '',
      '¡Gracias!',
    ];
    return lines.filter((l) => l !== undefined).join('\n');
  };

  if (!order) {
    return (
      <section className="py-32">
        <div className="container-custom text-center max-w-xl">
          <h1 className="font-display text-3xl text-text mb-4">Pedido #{numero}</h1>
          <p className="font-accent text-lg text-muted italic mb-8">
            Si necesitás el detalle de tu pedido, escribinos por WhatsApp con tu número de pedido.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={whatsappLink(`Hola Panaqua! Quiero consultar por mi pedido #${numero}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-center"
            >
              Consultar por WhatsApp
            </a>
            <Link to="/" className="btn-secondary text-center">
              Volver al catálogo
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const isTransfer = order.metodo_nombre?.toLowerCase().includes('transferencia');

  return (
    <section className="py-24">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/15 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-text mb-2">
            ¡Tu pedido fue registrado!
          </h1>
          <p className="font-accent text-lg text-muted italic">
            Número de pedido:{' '}
            <strong className="not-italic text-accent">#{order.order_number}</strong>
          </p>
        </div>

        <div className="bg-white border border-border rounded-sm p-6 mb-6">
          <h2 className="font-body text-sm font-semibold text-text uppercase tracking-wider mb-4">
            Resumen
          </h2>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between gap-3">
                <span className="font-body text-sm text-text">
                  {item.quantity}× {item.name}
                </span>
                <span className="font-body text-sm text-text">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-4 pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-body text-sm text-muted">Subtotal</span>
              <span className="font-body text-sm text-text">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-body text-sm text-muted">
                {order.tipo_entrega === 'envio'
                  ? `Envío — ${order.zona_nombre}`
                  : 'Retiro en el local'}
              </span>
              <span className="font-body text-sm text-text">
                {order.tipo_entrega === 'envio'
                  ? formatShippingCost(order.costo_envio)
                  : 'Sin costo'}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="font-body font-semibold text-text">Total</span>
              <span className="font-display text-xl text-accent font-semibold">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        {isTransfer && settings && (
          <div className="bg-white border border-border rounded-sm p-6 mb-6">
            <h2 className="font-body text-sm font-semibold text-text uppercase tracking-wider mb-4">
              Datos para la transferencia
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between gap-3">
                <span className="font-body text-sm text-muted">Alias</span>
                <span className="font-body text-sm text-text font-medium">{settings.alias}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="font-body text-sm text-muted">CBU</span>
                <span className="font-body text-sm text-text font-medium">{settings.cbu}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="font-body text-sm text-muted">Importe</span>
                <span className="font-body text-sm text-accent font-semibold">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
            {settings.qrUrl && (
              <img
                src={settings.qrUrl}
                alt="QR de pago"
                className="w-48 h-48 mx-auto mt-4 rounded-sm"
              />
            )}
            <p className="font-accent text-sm text-muted italic mt-4 text-center">
              Enviá el comprobante por WhatsApp junto con tu número de pedido
            </p>
          </div>
        )}

        {!isTransfer && (
          <div className="bg-white border border-border rounded-sm p-6 mb-6 text-center">
            <p className="font-body text-sm text-text">
              Pagás <strong>{formatPrice(order.total)}</strong> en efectivo al retirar tu pedido.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={whatsappLink(buildWhatsAppMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex-1 text-center"
          >
            Enviar por WhatsApp
          </a>
          <button onClick={() => navigate('/')} className="btn-secondary flex-1 text-center">
            Volver al catálogo
          </button>
        </div>
      </div>
    </section>
  );
}
