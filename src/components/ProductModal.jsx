import { whatsappLink } from '../config/site';
import { formatPrice } from '../utils/format';
import { getStockStatus } from '../utils/stock';
import { useCart } from '../hooks/useCart';

export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart();

  if (!product) return null;

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-sm max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="overflow-y-auto">
          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="aspect-square md:aspect-auto">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="mb-4">
                <span className="font-body text-xs text-muted uppercase tracking-wider bg-bg px-3 py-1 rounded-sm">
                  {product.category}
                </span>
              </div>

              <h2 className="font-display text-2xl md:text-3xl text-text mb-4">{product.name}</h2>

              <p className="font-accent text-lg text-muted italic mb-6">{product.description}</p>

              <div className="mb-6">
                <p className="font-body text-3xl font-semibold text-accent">
                  {formatPrice(product.price)}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {product.materials.length > 0 && (
                  <div>
                    <h4 className="font-body text-sm font-semibold text-text uppercase tracking-wider mb-2">
                      Materiales
                    </h4>
                    <ul className="font-body text-sm text-muted">
                      {product.materials.map((material, index) => (
                        <li key={index}>• {material}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.dimensions && (
                  <div>
                    <h4 className="font-body text-sm font-semibold text-text uppercase tracking-wider mb-2">
                      Dimensiones
                    </h4>
                    <p className="font-body text-sm text-muted">{product.dimensions}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-body text-sm font-semibold text-text uppercase tracking-wider mb-2">
                    Disponibilidad
                  </h4>
                  <p className={`font-body text-sm ${stockStatus.textColor}`}>
                    {stockStatus.label}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    addItem(product);
                    onClose();
                  }}
                  disabled={!stockStatus.canBuy}
                  className={`flex-1 text-center ${
                    stockStatus.canBuy ? 'btn-primary' : 'btn-primary opacity-50 cursor-not-allowed'
                  }`}
                >
                  {stockStatus.canBuy ? 'Agregar al carrito' : 'Agotado'}
                </button>
                <a
                  href={whatsappLink(`Hola! Me interesa ${product.name}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-center"
                >
                  Consultar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
