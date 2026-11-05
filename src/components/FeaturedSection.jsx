import ProductGrid from './ProductGrid';

export default function FeaturedSection({ products, onProductClick }) {
  const featured = products.filter((product) => product.featured);

  if (featured.length === 0) return null;

  return (
    <section className="pt-20 pb-4">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl text-text mb-4">Destacados</h2>
          <p className="font-accent text-lg text-muted italic">Nuestra selección especial</p>
        </div>
        <ProductGrid products={featured} onProductClick={onProductClick} />
      </div>
    </section>
  );
}
