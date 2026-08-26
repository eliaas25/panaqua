import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import CategoryFilter from './components/CategoryFilter';
import ProductModal from './components/ProductModal';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import { products, categories } from './data/products';

function App() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = activeCategory
    ? products.filter((product) => product.category === activeCategory)
    : products;

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main>
        {/* Hero Section */}
        <Hero />

        {/* Catalog Section */}
        <section id="catalogo" className="py-20">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl text-text mb-4">
                Nuestros Productos
              </h2>
              <p className="font-accent text-lg text-muted italic">
                Descubrí la perfección en cada detalle
              </p>
            </div>

            {/* Category Filter */}
            <div className="mb-12">
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>

            {/* Product Grid */}
            <ProductGrid products={filteredProducts} onProductClick={setSelectedProduct} />
          </div>
        </section>

        {/* About Section */}
        <About />

        {/* Contact Section */}
        <Contact />
      </main>

      <Footer />

      {/* Product Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}

export default App;
