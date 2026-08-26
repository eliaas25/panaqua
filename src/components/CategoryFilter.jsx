export default function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-4">
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-4 py-2 rounded-sm font-body text-sm transition-all duration-300 ${
          activeCategory === null
            ? 'bg-accent text-white'
            : 'bg-white border border-border text-text hover:border-accent hover:text-accent'
        }`}
      >
        Todos
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-sm font-body text-sm transition-all duration-300 ${
            activeCategory === category.id
              ? 'bg-accent text-white'
              : 'bg-white border border-border text-text hover:border-accent hover:text-accent'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
