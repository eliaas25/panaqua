import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { useCart } from '../hooks/useCart';
import { useScrollToSection } from '../hooks/useScrollToSection';

export default function Navbar({ onCartOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const scrollTo = useScrollToSection();

  const navItems = [
    { name: 'Inicio', id: null },
    { name: 'Catálogo', id: 'catalogo' },
    { name: 'Sobre Nosotros', id: 'sobre-nosotros' },
    { name: 'Contacto', id: 'contacto' },
  ];

  const handleNav = (id) => {
    setIsOpen(false);
    scrollTo(id);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-bg/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="Panaqua"
                className="h-10 md:h-18"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="hidden font-display text-xl md:text-2xl text-text tracking-wide">
                PANAQUA
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNav(item.id)}
                className="font-body text-sm text-muted hover:text-accent transition-colors duration-300 uppercase tracking-wider"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Cart + Mobile menu */}
          <div className="flex items-center gap-1">
            <button
              onClick={onCartOpen}
              className="relative p-2 text-text hover:text-accent transition-colors"
              aria-label="Abrir carrito"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white font-body text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-text hover:text-accent transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNav(item.id)}
                className="block w-full text-left py-3 font-body text-muted hover:text-accent transition-colors"
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
