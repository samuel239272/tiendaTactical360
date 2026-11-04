import { useMemo } from 'react';
import { products } from '../data/products';
export type ProductSort = 'featured' | 'name-asc' | 'name-desc' | 'manufacturer';
export function useProducts(query: string, category: string, sort: ProductSort) {
  return useMemo(() => {
    const search = query
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    const result = products.filter(
      (product) =>
        (category === 'all' || product.category === category) &&
        `${product.name} ${product.reference} ${product.manufacturer}`
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .includes(search),
    );
    if (sort === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    if (sort === 'name-desc') result.sort((a, b) => b.name.localeCompare(a.name, 'es'));
    if (sort === 'manufacturer')
      result.sort(
        (a, b) =>
          a.manufacturer.localeCompare(b.manufacturer, 'es') || a.name.localeCompare(b.name, 'es'),
      );
    return result;
  }, [query, category, sort]);
}
