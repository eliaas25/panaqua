import { useState } from 'react';
import logo from '../assets/logo.svg';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Inicio', href: '#' },
    { name: 'Catálogo', href: '#catalogo' },
    { name: 'Sobre Nosotros', href: '#sobre-nosotros' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-bg/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#" className="flex items-center gap-3">
              <img
                src={logo}
                alt="Panaqua"
                className="h-10 md:h-12"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="hidden font-display text-xl md:text-2xl text-text tracking-wide">
                PANAQUA
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="font-body text-sm text-muted hover:text-accent transition-colors duration-300 uppercase tracking-wider"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
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

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block py-3 font-body text-muted hover:text-accent transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
