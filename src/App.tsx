import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import HomePage from './app/HomePage';
import CatalogPage from './app/CatalogPage';
import ProductPage from './app/ProductPage';
import ExperiencePage from './app/ExperiencePage';
import NotFoundPage from './app/NotFoundPage';
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="catalogo" element={<CatalogPage />} />
        <Route path="producto/:id" element={<ProductPage />} />
        <Route path="experiencia" element={<ExperiencePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
