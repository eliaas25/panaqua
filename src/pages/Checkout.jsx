import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { formatPrice, formatShippingCost } from '../utils/format';
import { shippingZones, getShippingCost } from '../data/shippingZones';
import { fetchPaymentMethods, crearPedido } from '../services/shop';

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();

  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    notas: '',
  });
  const [tipoEntrega, setTipoEntrega] = useState('retiro');
  const [zonaEnvio, setZonaEnvio] = useState(shippingZones[0].id);
  const [metodoPago, setMetodoPago] = useState(1);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPaymentMethods().then((methods) => {
      setPaymentMethods(methods);
      if (methods.length > 0) setMetodoPago(methods[0].id);
    });
  }, []);

  const costoEnvio = tipoEntrega === 'envio' ? getShippingCost(zonaEnvio) : 0;
  const total = totalPrice + (costoEnvio ?? 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (form.nombre.trim().length < 2) newErrors.nombre = 'Ingresá tu nombre';
    const digits = form.telefono.replace(/\D/g, '');
    if (digits.length < 6) newErrors.telefono = 'Ingresá un teléfono válido';
    if (form.email && !validateEmail(form.email)) newErrors.email = 'Email inválido';
    if (tipoEntrega === 'envio' && form.direccion.trim().length < 4) {
      newErrors.direccion = 'Ingresá tu dirección';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (items.length === 0) return;
    if (!validate()) return;

    const zona = shippingZones.find((z) => z.id === zonaEnvio);

    const payload = {
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim(),
      email: form.email.trim(),
      direccion: tipoEntrega === 'envio' ? form.direccion.trim() : '',
      localidad: tipoEntrega === 'envio' ? zona?.name || '' : '',
      tipo_entrega: tipoEntrega,
      zona_envio: tipoEntrega === 'envio' ? zonaEnvio : '',
      costo_envio: costoEnvio ?? 0,
      metodo_pago_id: metodoPago,
      notas: form.notas.trim(),
      items: items.map((item) => ({ product_id: item.productId, cantidad: item.quantity })),
    };

    setIsSubmitting(true);
    try {
      const result = await crearPedido(payload);

      const order = {
        order_number: result.order_number,
        nombre: payload.nombre,
        tipo_entrega: tipoEntrega,
        zona_nombre: tipoEntrega === 'envio' ? zona?.name || '' : '',
        costo_envio: costoEnvio,
        subtotal: totalPrice,
        total: Number(result.total),
        metodo_nombre: paymentMethods.find((m) => m.id === metodoPago)?.name || '',
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
      };
      sessionStorage.setItem('panaqua-last-order', JSON.stringify(order));

      clearCart();
      navigate(`/pedido/${result.order_number}`, { state: order });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !isSubmitting) {
    return (
      <section className="py-32">
        <div className="container-custom text-center">
          <h1 className="font-display text-3xl text-text mb-4">Tu carrito está vacío</h1>
          <p className="font-accent text-lg text-muted italic mb-8">
            Agregá productos antes de finalizar la compra
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Volver al catálogo
          </button>
        </div>
      </section>
    );
  }

  const inputClass = (field) =>
    `w-full px-4 py-2.5 border rounded-sm font-body text-sm text-text placeholder-muted bg-white focus:outline-none focus:border-accent transition-colors ${
      errors[field] ? 'border-red-500' : 'border-border'
    }`;

  return (
    <section className="py-24">
      <div className="container-custom max-w-5xl">
        <h1 className="font-display text-3xl md:text-4xl text-text mb-2">Finalizar compra</h1>
        <p className="font-accent text-lg text-muted italic mb-10">
          Completá tus datos y confirmá el pedido
        </p>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-10">
          {/* Datos + Entrega + Pago */}
          <div className="space-y-8">
            <div>
              <h2 className="font-body text-sm font-semibold text-text uppercase tracking-wider mb-4">
                Tus datos
              </h2>
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Nombre y apellido *"
                    className={inputClass('nombre')}
                  />
                  {errors.nombre && (
                    <p className="font-body text-xs text-red-600 mt-1">{errors.nombre}</p>
                  )}
                </div>
                <div>
                  <input
                    type="tel"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="Teléfono / WhatsApp *"
                    className={inputClass('telefono')}
                  />
                  {errors.telefono && (
                    <p className="font-body text-xs text-red-600 mt-1">{errors.telefono}</p>
                  )}
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email (opcional)"
                    className={inputClass('email')}
                  />
                  {errors.email && (
                    <p className="font-body text-xs text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-body text-sm font-semibold text-text uppercase tracking-wider mb-4">
                Entrega
              </h2>
              <div className="flex gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setTipoEntrega('retiro')}
                  className={`flex-1 px-4 py-2.5 rounded-sm font-body text-sm border transition-all ${
                    tipoEntrega === 'retiro'
                      ? 'bg-accent text-white border-accent'
                      : 'bg-white border-border text-text hover:border-accent hover:text-accent'
                  }`}
                >
                  Retiro en el local
                </button>
                <button
                  type="button"
                  onClick={() => setTipoEntrega('envio')}
                  className={`flex-1 px-4 py-2.5 rounded-sm font-body text-sm border transition-all ${
                    tipoEntrega === 'envio'
                      ? 'bg-accent text-white border-accent'
                      : 'bg-white border-border text-text hover:border-accent hover:text-accent'
                  }`}
                >
                  Envío a domicilio
                </button>
              </div>

              {tipoEntrega === 'envio' && (
                <div className="space-y-3">
                  <select
                    value={zonaEnvio}
                    onChange={(e) => setZonaEnvio(e.target.value)}
                    className="w-full px-4 py-2.5 border border-border rounded-sm font-body text-sm text-text bg-white focus:outline-none focus:border-accent transition-colors cursor-pointer"
                  >
                    {shippingZones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name} — {formatShippingCost(zone.price)}
                      </option>
                    ))}
                  </select>
                  <div>
                    <input
                      type="text"
                      name="direccion"
                      value={form.direccion}
                      onChange={handleChange}
                      placeholder="Dirección de envío *"
                      className={inputClass('direccion')}
                    />
                    {errors.direccion && (
                      <p className="font-body text-xs text-red-600 mt-1">{errors.direccion}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="font-body text-sm font-semibold text-text uppercase tracking-wider mb-4">
                Método de pago
              </h2>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className="flex items-center gap-3 px-4 py-3 border border-border rounded-sm bg-white cursor-pointer hover:border-accent transition-colors"
                  >
                    <input
                      type="radio"
                      name="metodo_pago"
                      value={method.id}
                      checked={metodoPago === method.id}
                      onChange={() => setMetodoPago(method.id)}
                      className="accent-accent"
                    />
                    <span className="font-body text-sm text-text">{method.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-body text-sm font-semibold text-text uppercase tracking-wider mb-4">
                Notas (opcional)
              </h2>
              <textarea
                name="notas"
                value={form.notas}
                onChange={handleChange}
                rows={3}
                placeholder="Indicaciones para la entrega, color, etc."
                className="w-full px-4 py-2.5 border border-border rounded-sm font-body text-sm text-text placeholder-muted bg-white focus:outline-none focus:border-accent transition-colors resize-none"
              />
            </div>
          </div>

          {/* Resumen */}
          <div>
            <div className="bg-white border border-border rounded-sm p-6 sticky top-24">
              <h2 className="font-body text-sm font-semibold text-text uppercase tracking-wider mb-4">
                Resumen del pedido
              </h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between gap-3">
                    <span className="font-body text-sm text-text">
                      {item.quantity}× {item.name}
                    </span>
                    <span className="font-body text-sm text-text">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-body text-sm text-muted">Subtotal</span>
                  <span className="font-body text-sm text-text">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-sm text-muted">
                    {tipoEntrega === 'envio' ? 'Envío' : 'Retiro'}
                  </span>
                  <span className="font-body text-sm text-text">
                    {tipoEntrega === 'envio' ? formatShippingCost(costoEnvio) : 'Sin costo'}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-body font-semibold text-text">Total</span>
                  <span className="font-display text-xl text-accent font-semibold">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {submitError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-sm">
                  <p className="font-body text-sm text-red-700">{submitError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando pedido…' : 'Confirmar pedido'}
              </button>

              <p className="font-accent text-xs text-muted italic mt-3 text-center">
                Te contactamos por WhatsApp para coordinar el pago y la entrega
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
