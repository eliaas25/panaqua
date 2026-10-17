import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/format';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, totalPrice, totalItems, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <aside className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-display text-xl text-text">
            Tu carrito {totalItems > 0 && <span className="text-muted">({totalItems})</span>}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-text hover:text-accent transition-colors"
            aria-label="Cerrar carrito"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <svg
              className="w-16 h-16 text-border mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p className="font-body text-muted mb-2">Tu carrito está vacío</p>
            <p className="font-accent text-sm text-muted italic">
              Explorá el catálogo y agregá tus favoritos
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-4 border-b border-border pb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-sm flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-body text-sm font-medium text-text truncate">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-muted hover:text-red-600 transition-colors flex-shrink-0"
                      aria-label={`Quitar ${item.name}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="font-body text-sm text-accent font-semibold mt-1">
                    {formatPrice(item.price)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-border rounded-sm">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-2 py-1 text-text hover:text-accent disabled:text-border transition-colors"
                        aria-label="Restar una unidad"
                      >
                        −
                      </button>
                      <span className="px-3 font-body text-sm text-text">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="px-2 py-1 text-text hover:text-accent disabled:text-border transition-colors"
                        aria-label="Sumar una unidad"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-body text-sm font-semibold text-text">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-muted">Subtotal</span>
              <span className="font-display text-xl text-text font-semibold">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <p className="font-accent text-xs text-muted italic">
              El costo de envío se calcula en el siguiente paso
            </p>
            <button
              className="btn-primary w-full"
              onClick={() => {
                onClose();
                navigate('/checkout');
              }}
            >
              Finalizar compra
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
