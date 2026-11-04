import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Box,
  Image,
  FileText,
  ChevronRight,
  Info,
} from 'lucide-react';
import { products } from '../data/products';
import { categoryName } from '../data/categories';
import { ProductViewer } from '../components/viewer/ProductViewer';
import { ProductGallery } from '../components/gallery/ProductGallery';
import { Specifications } from '../components/specifications/Specifications';
import { ProductCard } from '../components/catalog/ProductCard';
import NotFoundPage from './NotFoundPage';

export default function ProductPage() {
  const { id } = useParams();
  const product = products.find((item) => item.id === id);
  if (!product) return <NotFoundPage />;
  return <ProductDetail key={product.id} product={product} />;
}
function ProductDetail({ product }: { product: (typeof products)[number] }) {
  const [view, setView] = useState<'3d' | 'images'>('3d');
  const [tab, setTab] = useState<'specs' | 'components' | 'docs'>('specs');
  const index = products.findIndex((item) => item.id === product.id);
  return (
    <div className="page-width product-page">
      <nav className="breadcrumbs" aria-label="Ruta de navegación">
        <Link to="/catalogo">Catálogo</Link>
        <ChevronRight size={12} />
        <Link to={`/catalogo?categoria=${product.category}`}>{categoryName(product.category)}</Link>
        <ChevronRight size={12} />
        <span>{product.name}</span>
      </nav>
      <div className="product-detail-grid">
        <section className="product-media" aria-label="Exploración del producto">
          <div className="media-tabs">
            <button aria-pressed={view === '3d'} onClick={() => setView('3d')}>
              <Box size={16} /> Exploración 3D
            </button>
            <button aria-pressed={view === 'images'} onClick={() => setView('images')}>
              <Image size={16} /> Galería <span>{product.images.length}</span>
            </button>
            <span className="mono">360° / PRODUCT VIEW</span>
          </div>
          <div hidden={view !== '3d'}>
            <ProductViewer product={product} onGallery={() => setView('images')} />
          </div>
          <div hidden={view !== 'images'}>
            <ProductGallery product={product} />
          </div>
          <div className="media-description">
            <span>
              <span className="status-dot" />{' '}
              {product.illustrative ? 'MODELO DE DEMOSTRACIÓN' : 'EXPLORACIÓN DEL PRODUCTO'}
            </span>
            <span>Gira. Acércate. Descubre.</span>
          </div>
        </section>
        <aside className="product-info">
          <div className="product-category eyebrow">
            {categoryName(product.category)}{' '}
            {product.illustrative && <span>/ DISEÑO CONCEPTUAL</span>}
          </div>
          <h1>
            {product.name.split(' / ')[0]}
            <span>{product.name.split(' / ')[1]}</span>
          </h1>
          <p className="product-subtitle">{product.shortDescription}</p>
          <div className="product-reference mono">
            REF. {product.reference}
            <span>{product.manufacturer}</span>
          </div>
          <p className="product-description">{product.description}</p>
          <div className="finish-row">
            <div>
              <span className="eyebrow">ACABADO VISUAL</span>
              <strong>{product.color.name}</strong>
            </div>
            <div className="color-options">
              {(product.category === 'helmets'
                ? products.filter((item) => item.category === 'helmets')
                : [product]
              ).map((item) => (
                <Link
                  key={item.id}
                  to={`/producto/${item.id}`}
                  title={item.color.name}
                  aria-label={`Ver acabado ${item.color.name}`}
                  aria-current={item.id === product.id ? 'true' : undefined}
                  style={{ '--swatch': item.color.hex } as React.CSSProperties}
                >
                  <span />
                </Link>
              ))}
            </div>
          </div>
          <details open className="product-technical">
            <summary className="technical-toggle">
              Información técnica <ChevronRight size={16} />
            </summary>
            <div className="info-tabs" aria-label="Información del producto">
              {(
                [
                  ['specs', 'Ficha técnica'],
                  ['components', 'Componentes'],
                  ['docs', 'Documentos'],
                ] as const
              ).map(([value, label]) => (
                <button key={value} aria-pressed={tab === value} onClick={() => setTab(value)}>
                  {label}
                </button>
              ))}
            </div>
            <div className="info-tab-content">
              {tab === 'specs' && <Specifications product={product} />}{' '}
              {tab === 'components' && (
                <div className="component-list">
                  {product.components.map((component, i) => (
                    <details key={component.id}>
                      <summary>
                        <span className="mono">0{i + 1}</span>
                        {component.name}
                        <ChevronRight size={15} />
                      </summary>
                      <p>{component.description}</p>
                    </details>
                  ))}
                </div>
              )}
              {tab === 'docs' && (
                <div className="documentation-list">
                  {product.documentation?.map((document) => (
                    <a key={document.url} href={document.url} target="_blank" rel="noreferrer">
                      <FileText size={20} />
                      <span>
                        {document.title}
                        <small>{document.type} · Abrir en otra pestaña</small>
                      </span>
                      <ArrowUpRight size={16} />
                    </a>
                  ))}
                  <p className="specification-note">
                    Documentación del ejemplo. No constituye una ficha técnica de fabricante.
                  </p>
                </div>
              )}
            </div>
          </details>
          {product.illustrative && (
            <div className="product-disclaimer">
              <Info size={16} />
              <p>Información ilustrativa. Este modelo no acredita prestaciones de protección.</p>
            </div>
          )}
        </aside>
      </div>
      <div className="product-pagination">
        <Link to={`/producto/${products[(index - 1 + products.length) % products.length].id}`}>
          <ArrowLeft size={17} />
          <span>
            <small>PRODUCTO ANTERIOR</small>
            {products[(index - 1 + products.length) % products.length].name}
          </span>
        </Link>
        <Link to="/catalogo" className="all-products-link">
          Volver al catálogo
        </Link>
        <Link to={`/producto/${products[(index + 1) % products.length].id}`}>
          <span>
            <small>SIGUIENTE PRODUCTO</small>
            {products[(index + 1) % products.length].name}
          </span>
          <ArrowRight size={17} />
        </Link>
      </div>
      <section className="related-products">
        <div className="section-heading">
          <div>
            <span className="eyebrow">SIGUE EXPLORANDO</span>
            <h2>Otras perspectivas.</h2>
          </div>
          <Link to="/catalogo" className="text-link">
            Ver catálogo <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="product-grid">
          {products
            .filter((item) => item.id !== product.id)
            .slice(0, 3)
            .map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
        </div>
      </section>
    </div>
  );
}
