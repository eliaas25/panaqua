export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-20">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 md:order-1 text-center md:text-left">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-text leading-tight mb-6">
              Elegancia en cada detalle
            </h1>
            <p className="font-accent text-lg md:text-xl text-muted italic mb-8 max-w-lg">
              Descubrí nuestra colección de carteras y bolsos diseñados para mujeres que valoran el
              estilo y la calidad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href="#catalogo" className="btn-primary text-center">
                Ver Catálogo
              </a>
              <a href="#sobre-nosotros" className="btn-secondary text-center">
                Conocer Más
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="order-1 md:order-2 relative">
            <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80"
                alt="Cartera elegante Panaqua"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/10 -z-10 rounded-sm"></div>
            <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-accent/20 -z-10 rounded-sm"></div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="font-display text-3xl md:text-4xl text-accent">10+</p>
            <p className="font-body text-sm text-muted uppercase tracking-wider">Productos</p>
          </div>
          <div>
            <p className="font-display text-3xl md:text-4xl text-accent">4</p>
            <p className="font-body text-sm text-muted uppercase tracking-wider">Categorías</p>
          </div>
          <div>
            <p className="font-display text-3xl md:text-4xl text-accent">24/7</p>
            <p className="font-body text-sm text-muted uppercase tracking-wider">Atención</p>
          </div>
          <div>
            <p className="font-display text-3xl md:text-4xl text-accent">100%</p>
            <p className="font-body text-sm text-muted uppercase tracking-wider">Online</p>
          </div>
        </div>
      </div>
    </section>
  );
}
