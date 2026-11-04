import type { CategoryId } from '../types/product';
export const categories: { id: CategoryId; name: string; description: string; number: string }[] = [
  { id: 'helmets', name: 'Cascos', description: 'Forma, estructura y cada detalle.', number: '01' },
  {
    id: 'accessories',
    name: 'Accesorios',
    description: 'Una perspectiva de cada componente.',
    number: '02',
  },
  {
    id: 'interiors',
    name: 'Sistemas interiores',
    description: 'Explora el diseño desde adentro.',
    number: '03',
  },
];
export const categoryName = (id: CategoryId) =>
  categories.find((category) => category.id === id)?.name ?? id;
