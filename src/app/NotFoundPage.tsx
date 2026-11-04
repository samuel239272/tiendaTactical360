import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
export default function NotFoundPage() {
  return (
    <div className="empty-state page-width">
      <span className="eyebrow">404 / FUERA DE CAMPO</span>
      <h1>Esta perspectiva no existe.</h1>
      <p>Encuentra el producto que buscas en el catálogo.</p>
      <Link to="/catalogo" className="button primary">
        Explorar catálogo <ArrowUpRight size={18} />
      </Link>
    </div>
  );
}
