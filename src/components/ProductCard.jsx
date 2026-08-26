export default function ProductCard({ product, onProductClick }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'En stock':
        return 'text-green-600';
      case 'Pocas unidades':
        return 'text-yellow-600';
      case 'Agotado':
        return 'text-red-600';
      default:
        return 'text-muted';
    }
  };

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
        {/* Availability */}
        <div className="absolute bottom-3 right-3">
          <span className={`font-body text-xs ${getAvailabilityColor(product.availability)}`}>
            {product.availability}
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
          <button className="text-text hover:text-accent transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
