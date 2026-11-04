import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { IconButton } from '../ui/Button';
import { assetUrl } from '../../utils/assets';

export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="Tactical 360, inicio">
      <img src={assetUrl('/icons/mark.svg')} width="36" height="36" alt="" />
      <span>
        TACTICAL<span className="brand-360">360</span>
      </span>
    </Link>
  );
}
export function Layout() {
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setMenu(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [location.pathname]);
  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
      >
        Saltar al contenido
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Brand />
          <nav className={menu ? 'main-nav open' : 'main-nav'} aria-label="Navegación principal">
            <NavLink to="/" end>
              Inicio
            </NavLink>
            <NavLink to="/catalogo">Catálogo</NavLink>
            <NavLink to="/experiencia">La experiencia 360</NavLink>
          </nav>
          <Link to="/catalogo" className="header-cta">
            Explorar catálogo <ArrowUpRight size={16} />
          </Link>
          <IconButton
            label={menu ? 'Cerrar menú' : 'Abrir menú'}
            className="mobile-menu"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={22} /> : <Menu size={22} />}
          </IconButton>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <div>
            <Brand />
            <p>Ingeniería en cada ángulo.</p>
          </div>
          <div className="footer-links">
            <Link to="/catalogo">
              Catálogo <ArrowUpRight size={14} />
            </Link>
            <Link to="/experiencia">
              La experiencia <ArrowUpRight size={14} />
            </Link>
            <a href={assetUrl('/documents/catalogo-demo.html')} target="_blank" rel="noreferrer">
              Documentación <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} TACTICAL 360</span>
          <span>CATÁLOGO DEMOSTRATIVO · SIN VENTA COMERCIAL</span>
          <span className="footer-status">
            <i className="status-dot" /> UNA NUEVA PERSPECTIVA
          </span>
        </div>
      </footer>
    </>
  );
}
