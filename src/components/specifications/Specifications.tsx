import type { TacticalProduct } from '../../types/product';
export function Specifications({ product }: { product: TacticalProduct }) {
  const rows = [
    [product.illustrative ? 'Diseño' : 'Fabricante', product.manufacturer],
    ['Referencia', product.reference],
    ['Material', product.specifications.material],
    ['Peso', product.specifications.weight],
    ['Dimensiones', product.specifications.dimensions],
    ['Tallas', product.specifications.sizes?.join(' / ')],
    ['Acabado', product.specifications.finish],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));
  return (
    <div>
      <dl className="specification-list">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      {product.specifications.certifications?.length ? (
        <ul>
          {product.specifications.certifications.map((certification) => (
            <li key={certification.name}>
              <a href={certification.sourceUrl} target="_blank" rel="noreferrer">
                {certification.name}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="specification-note">
          {product.illustrative
            ? 'No se han aportado certificaciones, materiales, peso ni tallas de fabricante para este diseño ilustrativo.'
            : 'No se han aportado certificaciones documentadas para este producto. Solo se muestran las especificaciones disponibles.'}
        </p>
      )}
    </div>
  );
}
