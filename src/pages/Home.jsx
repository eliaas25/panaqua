import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import CategoryFilter from '../components/CategoryFilter';
import CatalogControls from '../components/CatalogControls';
import ProductModal from '../components/ProductModal';
import About from '../components/About';
import Contact from '../components/Contact';
import { sortProducts } from '../utils/sort';
import { fetchProducts, fetchCategories } from '../services/shop';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    fetchProducts().then(setProducts);
    fetchCategories().then(setCategories);
  }, []);

  const filteredProducts = sortProducts(
    products.filter((product) => {
      const matchesCategory = activeCategory ? product.category === activeCategory : true;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    }),
    sortBy
  );

  return (
    <>
      <Hero />

      {/* Catalog Section */}
      <section id="catalogo" className="py-20 scroll-mt-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-text mb-4">Nuestros Productos</h2>
            <p className="font-accent text-lg text-muted italic">
              Descubrí la perfección en cada detalle
            </p>
          </div>

          {/* Filters + Search + Sort in one line */}
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 mb-10">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            <CatalogControls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>

          {/* Product Grid */}
          <ProductGrid products={filteredProducts} onProductClick={setSelectedProduct} />
        </div>
      </section>

      <About />
      <Contact />

      {/* Product Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  );
}
