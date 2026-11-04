import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight, Box, Scan, Rotate3D, Layers3 } from 'lucide-react';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { ProductViewer } from '../components/viewer/ProductViewer';
import { ProductCard } from '../components/catalog/ProductCard';
import { assetUrl } from '../utils/assets';

export default function HomePage() {
  return (
    <>
      <section className="home-hero page-width">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="eyebrow hero-eyebrow">
            <span className="short-rule" /> INGENIERÍA EN CADA ÁNGULO
          </div>
          <h1>
            Una nueva
            <br />
            forma de
            <br />
            <span>ver el detalle.</span>
          </h1>
          <p>
            Explora el equipamiento desde todas las perspectivas. Acércate, gira y descubre lo que
            hace a cada componente único.
          </p>
          <Link to="/catalogo" className="button primary">
            Explorar catálogo <ArrowUpRight size={19} />
          </Link>
          <div className="hero-footnote">
            <Box size={15} />
            <span>
              EXPLORACIÓN EN 3 DIMENSIONES
              <span className="demo-label">Experiencia con modelos de demostración</span>
            </span>
          </div>
        </motion.div>
        <motion.div
          className="hero-product"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <ProductViewer product={products[0]} compact />
          <Link to={`/producto/${products[0].id}`} className="hero-product-caption">
            <div>
              <span className="eyebrow">EN EXHIBICIÓN / 01</span>
              <h2>{products[0].name}</h2>
              <span>{products[0].shortDescription}</span>
            </div>
            <span className="circle-arrow">
              <ArrowUpRight size={21} />
            </span>
          </Link>
        </motion.div>
      </section>
      <div className="capability-strip">
        <div className="page-width capability-inner">
          <span>
            <Rotate3D size={20} /> Inspección 360°
          </span>
          <span>
            <Scan size={20} /> Cada componente, al detalle
          </span>
          <span>
            <Layers3 size={20} /> Información en contexto
          </span>
          <a
            href="#colecciones"
            onClick={(event) => {
              event.preventDefault();
              document
                .getElementById('colecciones')
                ?.scrollIntoView({
                  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    ? 'instant'
                    : 'smooth',
                });
            }}
          >
            SIGUE EXPLORANDO <ArrowDown size={15} />
          </a>
        </div>
      </div>
      <section className="collections-section page-width" id="colecciones">
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 / EL CATÁLOGO</span>
            <h2>Encuentra tu perspectiva.</h2>
          </div>
          <Link className="text-link" to="/catalogo">
            Ver todo el catálogo <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/catalogo?categoria=${category.id}`}
              className="category-card"
            >
              <span className="mono category-number">{category.number}</span>
              <div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
              <ArrowUpRight size={23} />
            </Link>
          ))}
        </div>
        <div className="selected-heading">
          <span className="eyebrow">UNA SELECCIÓN PARA EMPEZAR</span>
          <span className="mono">03 / PRODUCTOS DESTACADOS</span>
        </div>
        <div className="product-grid">
          {[products[0], products[1], products[4]].map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <section className="experience-section page-width">
        <div className="experience-visual">
          <img
            src={assetUrl('/images/atlas-carbon-side.webp')}
            alt="Render lateral del casco conceptual ATLAS Carbon"
            loading="lazy"
          />
          <span className="drawing-cross one">+</span>
          <span className="drawing-cross two">+</span>
          <span className="eyebrow drawing-label">ATLAS / ESTUDIO DE FORMA</span>
          <div className="drawing-caption">
            <span>360°</span>
            <span>
              EL DISEÑO, DESDE
              <br />
              TODOS SUS ÁNGULOS.
            </span>
          </div>
        </div>
        <div className="experience-copy">
          <span className="eyebrow">02 / MÁS ALLÁ DE LA IMAGEN</span>
          <h2>
            El detalle cambia
            <br />
            la perspectiva.
          </h2>
          <p>
            Una fotografía muestra un lado. Una experiencia 360 te permite descubrir el conjunto.
            Explora la forma, las conexiones y el interior a tu propio ritmo.
          </p>
          <ul>
            <li>
              <span>01</span>Gira el modelo con total libertad.
            </li>
            <li>
              <span>02</span>Acércate a los puntos que te interesan.
            </li>
            <li>
              <span>03</span>Conoce cada componente en su contexto.
            </li>
          </ul>
          <Link to="/experiencia" className="text-link">
            Conoce la experiencia <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <div className="demo-notice page-width">
        <span className="status-dot" />
        <p>
          Este es un catálogo de demostración. Los diseños y datos son ilustrativos; no se atribuyen
          prestaciones ni certificaciones de fabricante.
        </p>
        <a href={assetUrl('/documents/catalogo-demo.html')} target="_blank" rel="noreferrer">
          Leer alcance <ArrowUpRight size={14} />
        </a>
      </div>
    </>
  );
}
