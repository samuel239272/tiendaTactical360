import { useSearchParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, X, ArrowUpRight } from 'lucide-react';
import { categories } from '../data/categories';
import { products } from '../data/products';
import { useProducts, type ProductSort } from '../hooks/useProducts';
import { ProductCard } from '../components/catalog/ProductCard';
export default function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const latestParams = useRef(params);
  useEffect(() => {
    latestParams.current = params;
  }, [params]);
  const query = params.get('q') ?? '';
  const category = categories.some((item) => item.id === params.get('categoria'))
    ? params.get('categoria')!
    : 'all';
  const rawSort = params.get('orden');
  const sort: ProductSort =
    rawSort === 'name-asc' || rawSort === 'name-desc' || rawSort === 'manufacturer'
      ? rawSort
      : 'featured';
  const filtered = useProducts(query, category, sort);
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(latestParams.current);
    if (value && value !== 'all' && value !== 'featured') next.set(key, value);
    else next.delete(key);
    latestParams.current = next;
    setParams(next, { replace: true });
  };
  return (
    <div className="page-width catalog-page">
      <div className="page-intro">
        <span className="eyebrow">EL CATÁLOGO / EXPLORACIÓN SIN LÍMITES</span>
        <h1>Diseño. Desde cada ángulo.</h1>
        <p>Encuentra un producto. Descubre cada detalle.</p>
      </div>
      <div className="catalog-toolbar">
        <label className="search-field">
          <Search size={19} />
          <input
            value={query}
            onChange={(event) => update('q', event.target.value)}
            placeholder="Buscar por nombre o referencia"
            aria-label="Buscar por nombre o referencia"
          />
          {query && (
            <button aria-label="Borrar búsqueda" onClick={() => update('q', '')}>
              <X size={17} />
            </button>
          )}
        </label>
        <label className="sort-field">
          <SlidersHorizontal size={17} />
          <span className="sr-only">Ordenar productos</span>
          <select value={sort} onChange={(event) => update('orden', event.target.value)}>
            <option value="featured">Destacados</option>
            <option value="name-asc">Nombre: A–Z</option>
            <option value="name-desc">Nombre: Z–A</option>
            <option value="manufacturer">Fabricante</option>
          </select>
        </label>
      </div>
      <div className="catalog-categories" aria-label="Filtrar por categoría">
        {[{ id: 'all', name: 'Todos' }, ...categories].map((item) => (
          <button
            key={item.id}
            aria-pressed={category === item.id}
            onClick={() => update('categoria', item.id)}
          >
            {item.name}
            <span>
              {item.id === 'all'
                ? products.length
                : products.filter((product) => product.category === item.id).length}
            </span>
          </button>
        ))}
      </div>
      <div className="catalog-results-heading">
        <span className="mono" aria-live="polite">
          {String(filtered.length).padStart(2, '0')} PRODUCTOS
          {category !== 'all'
            ? ' / ' + categories.find((item) => item.id === category)?.name.toUpperCase()
            : ''}
        </span>
        {(query || category !== 'all' || sort !== 'featured') && (
          <button className="text-link" onClick={() => setParams({})}>
            Limpiar filtros <X size={14} />
          </button>
        )}
        <span className="eyebrow results-demo">COLECCIÓN DEMOSTRATIVA</span>
      </div>
      {filtered.length ? (
        <div className="product-grid catalog-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={36} />
          <h2>No encontramos ese producto.</h2>
          <p>Prueba con otro nombre, referencia o categoría.</p>
          <button className="button primary" onClick={() => setParams({})}>
            Ver todos los productos <ArrowUpRight size={18} />
          </button>
        </div>
      )}
      <p className="catalog-disclaimer">
        Modelos originales ilustrativos. Consulta el alcance y los datos disponibles en cada ficha.
      </p>
    </div>
  );
}
