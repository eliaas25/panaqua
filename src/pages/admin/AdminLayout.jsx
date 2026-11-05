import { NavLink, Outlet, useNavigate, Link, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';

const navClass = ({ isActive }) =>
  `font-body text-sm transition-colors ${isActive ? 'text-accent font-medium' : 'text-text hover:text-accent'}`;

export default function AdminLayout() {
  const { session, loading, signOut } = useAdminAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="font-body text-muted">Cargando…</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-white border-b border-border">
        <div className="container-custom flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex flex-wrap items-center gap-6">
            <span className="font-display text-lg text-text">
              Panaqua <span className="text-accent">Admin</span>
            </span>
            <nav className="flex gap-5">
              <NavLink to="/admin" end className={navClass}>
                Pedidos
              </NavLink>
              <NavLink to="/admin/productos" className={navClass}>
                Productos
              </NavLink>
              <NavLink to="/admin/reportes" className={navClass}>
                Reportes
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="font-body text-sm text-muted hover:text-accent">
              Ver tienda
            </Link>
            <button
              onClick={handleSignOut}
              className="font-body text-sm border border-border px-3 py-1.5 rounded-sm hover:border-accent hover:text-accent transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </header>
      <main className="container-custom py-8">
        <Outlet />
      </main>
    </div>
  );
}
