import { ArrowUpRight, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TacticalProduct } from '../../types/product';
import { categoryName } from '../../data/categories';
export function ProductCard({ product }: { product: TacticalProduct }) {
  return (
    <Link
      to={`/producto/${product.id}`}
      className="product-card"
      aria-label={`Explorar ${product.name}`}
    >
      <div className="card-image">
        <span className="card-category">{categoryName(product.category)}</span>
        {product.model3D && (
          <span className="card-3d">
            <Box size={13} /> 3D
          </span>
        )}
        <img
          src={product.images[0].src}
          alt={product.images[0].alt}
          loading="lazy"
          width="640"
          height="520"
        />
        <span className="card-open">
          <ArrowUpRight size={20} />
        </span>
      </div>
      <div className="card-content">
        <span className="mono card-reference">{product.reference}</span>
        <h3>{product.name}</h3>
        <p>{product.shortDescription}</p>
        <div className="card-bottom">
          <span>
            <i style={{ background: product.color.hex }} />
            {product.color.name}
          </span>
          <span>
            EXPLORAR <ArrowUpRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
