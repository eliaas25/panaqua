import { formatPrice } from '../utils/format';
import { getStockStatus } from '../utils/stock';
import { useCart } from '../hooks/useCart';

export default function ProductCard({ product, onProductClick }) {
  const { addItem } = useCart();
  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="card cursor-pointer group" onClick={() => onProductClick(product)}>
      {/* Image */}
      <div className="aspect-square overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-sm">
          <span className="font-body text-xs text-text uppercase tracking-wider">
            {product.category}
          </span>
        </div>
        {/* Stock badge */}
        <div className="absolute bottom-3 right-3">
          <span
            className={`font-body text-xs px-2 py-1 rounded-sm bg-white/90 backdrop-blur-sm ${stockStatus.textColor}`}
          >
            {stockStatus.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        <h3 className="font-display text-lg md:text-xl text-text mb-2">{product.name}</h3>
        <p className="font-accent text-sm text-muted italic mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <p className="font-body text-xl font-semibold text-accent">
            {formatPrice(product.price)}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addItem(product);
            }}
            disabled={!stockStatus.canBuy}
            className={`font-body text-sm px-4 py-2 rounded-sm transition-colors ${
              stockStatus.canBuy
                ? 'bg-accent text-white hover:bg-accent-dark'
                : 'bg-border text-muted cursor-not-allowed'
            }`}
          >
            {stockStatus.canBuy ? 'Agregar' : 'Agotado'}
          </button>
        </div>
      </div>
    </div>
  );
}
