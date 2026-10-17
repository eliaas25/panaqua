import { SORT_OPTIONS } from '../utils/sort';

export default function CatalogControls({ searchQuery, onSearchChange, sortBy, onSortChange }) {
  return (
    <>
      {/* Search */}
      <div className="relative w-full sm:w-72">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar productos..."
          className="w-full pl-10 pr-4 py-2.5 border border-border rounded-sm font-body text-sm text-text placeholder-muted focus:outline-none focus:border-accent transition-colors bg-white"
        />
      </div>

      {/* Sort */}
      <div className="w-full sm:w-56">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-4 py-2.5 border border-border rounded-sm font-body text-sm text-text bg-white focus:outline-none focus:border-accent transition-colors cursor-pointer"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
