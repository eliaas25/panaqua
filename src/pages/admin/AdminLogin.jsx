import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!supabase) {
    return (
      <section className="py-32">
        <div className="container-custom text-center max-w-md">
          <h1 className="font-display text-3xl text-text mb-4">Panel de administración</h1>
          <p className="font-body text-sm text-muted mb-6">
            Supabase no está configurado (faltan las variables de entorno).
          </p>
          <Link to="/" className="btn-secondary inline-block">
            Volver a la tienda
          </Link>
        </div>
      </section>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError('Email o contraseña incorrectos');
      return;
    }
    navigate('/admin', { replace: true });
  };

  const inputClass =
    'w-full px-4 py-2.5 border border-border rounded-sm font-body text-sm text-text placeholder-muted bg-white focus:outline-none focus:border-accent transition-colors';

  return (
    <section className="py-32">
      <div className="container-custom max-w-sm">
        <div className="bg-white border border-border rounded-sm p-8">
          <h1 className="font-display text-2xl text-text mb-1">Panaqua Admin</h1>
          <p className="font-accent text-sm text-muted italic mb-6">
            Iniciá sesión para gestionar pedidos y productos
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block font-body text-xs text-muted uppercase tracking-wider mb-1"
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="admin-password"
                className="block font-body text-xs text-muted uppercase tracking-wider mb-1"
              >
                Contraseña
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className={inputClass}
              />
            </div>

            {error && (
              <p className="font-body text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <p className="mt-6 text-center">
            <Link to="/" className="font-body text-sm text-muted hover:text-accent">
              Volver a la tienda
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
