import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import { CartProvider } from './context/CartContext';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen bg-bg">
        <Navbar onCartOpen={() => setIsCartOpen(true)} />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pedido/:numero" element={<OrderConfirmation />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />

        {/* Cart Drawer */}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        {/* WhatsApp Button */}
        <WhatsAppButton />
      </div>
    </CartProvider>
  );
}

export default App;
