import { useEffect, useState } from 'react';
import { fetchProductsAdmin, updateProduct } from '../../services/admin';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drafts, setDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);

  const load = () =>
    fetchProductsAdmin()
      .then((data) => {
        setProducts(data);
        setError('');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const setDraft = (id, patch) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const hasDraft = (id) => drafts[id] && Object.keys(drafts[id]).length > 0;

  const saveRow = async (id) => {
    const draft = drafts[id];
    if (!draft) return;
    setSavingId(id);
    setError('');
    try {
      const patch = {};
      if (draft.stock !== undefined) patch.stock = Math.max(0, parseInt(draft.stock, 10) || 0);
      if (draft.precio !== undefined) patch.precio = Math.max(0, Number(draft.precio) || 0);
      await updateProduct(id, patch);
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  };

  const toggle = async (id, field, value) => {
    setSavingId(id);
    setError('');
    try {
      await updateProduct(id, { [field]: value });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <p className="font-body text-muted">Cargando productos…</p>;

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-sm">
        <p className="font-body text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-text mb-6">Productos</h1>

      <div className="bg-white border border-border rounded-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left font-body text-xs text-muted uppercase tracking-wider px-4 py-3">
                Producto
              </th>
              <th className="text-left font-body text-xs text-muted uppercase tracking-wider px-4 py-3">
                Precio
              </th>
              <th className="text-left font-body text-xs text-muted uppercase tracking-wider px-4 py-3">
                Stock
              </th>
              <th className="text-center font-body text-xs text-muted uppercase tracking-wider px-4 py-3">
                Visible
              </th>
              <th className="text-center font-body text-xs text-muted uppercase tracking-wider px-4 py-3">
                Destacado
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const draft = drafts[p.id] || {};
              const dirty = hasDraft(p.id);
              return (
                <tr key={p.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3">
                    <span className="font-body text-sm text-text">{p.nombre}</span>
                    <span className="font-body text-xs text-muted ml-2">{p.categoria_id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      value={draft.precio !== undefined ? draft.precio : p.precio}
                      onChange={(e) => setDraft(p.id, { precio: e.target.value })}
                      aria-label={`Precio de ${p.nombre}`}
                      className="w-28 px-2 py-1.5 border border-border rounded-sm font-body text-sm text-text bg-white focus:outline-none focus:border-accent"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      value={draft.stock !== undefined ? draft.stock : p.stock}
                      onChange={(e) => setDraft(p.id, { stock: e.target.value })}
                      aria-label={`Stock de ${p.nombre}`}
                      className="w-20 px-2 py-1.5 border border-border rounded-sm font-body text-sm text-text bg-white focus:outline-none focus:border-accent"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={p.activo}
                      disabled={savingId === p.id}
                      onChange={(e) => toggle(p.id, 'activo', e.target.checked)}
                      aria-label={`Visible ${p.nombre}`}
                      className="accent-accent w-4 h-4"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={p.destacado}
                      disabled={savingId === p.id}
                      onChange={(e) => toggle(p.id, 'destacado', e.target.checked)}
                      aria-label={`Destacado ${p.nombre}`}
                      className="accent-accent w-4 h-4"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => saveRow(p.id)}
                      disabled={!dirty || savingId === p.id}
                      className="font-body text-xs px-3 py-1.5 rounded-sm border border-accent text-accent hover:bg-accent hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-accent"
                    >
                      {savingId === p.id ? 'Guardando…' : 'Guardar'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="font-accent text-sm text-muted italic mt-4">
        Los cambios se aplican al instante en la tienda. Para agregar productos nuevos o cambiar
        fotos, se hace desde el código.
      </p>
    </div>
  );
}
