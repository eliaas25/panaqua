export default function About() {
  return (
    <section id="sobre-nosotros" className="py-20 bg-bg">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80"
                alt="Sobre Panaqua"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 -z-10 rounded-sm"></div>
          </div>

          {/* Content */}
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-text mb-4">Sobre Panaqua</h2>
            <p className="font-accent text-lg text-muted italic mb-6">
              Nuestra historia, nuestra pasión
            </p>
            <div className="space-y-4 font-body text-text leading-relaxed">
              <p>
                Panaqua nació de la pasión por las carteras y los accesorios que combinan estilo,
                calidad y funcionalidad. Creemos que cada mujer merece tener acceso a productos
                elegantes sin comprometer el presupuesto.
              </p>
              <p>
                Trabajamos con proveedores selectos para ofrecerte carteras y bolsos que no solo son
                hermosos, sino también duraderos y prácticos para el día a día.
              </p>
              <p>
                Nuestra misión es simple: ayudarte a encontrar la cartera perfecta para cada
                ocasión, ya sea una salida casual, un evento especial o el uso diario.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-white rounded-sm border border-border">
                <p className="font-display text-2xl text-accent mb-1">100%</p>
                <p className="font-body text-xs text-muted uppercase tracking-wider">Online</p>
              </div>
              <div className="text-center p-4 bg-white rounded-sm border border-border">
                <p className="font-display text-2xl text-accent mb-1">24/7</p>
                <p className="font-body text-xs text-muted uppercase tracking-wider">Atención</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
