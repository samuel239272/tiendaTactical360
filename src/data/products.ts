import type { TacticalProduct, ProductComponent } from '../types/product';
import { assetUrl } from '../utils/assets';

const helmetComponents: ProductComponent[] = [
  {
    id: 'shell',
    name: 'Carcasa exterior',
    description:
      'Superficie continua de corte alto. La geometría permite observar el contorno y la apertura lateral del modelo conceptual.',
    position: [0.58, 0.97, 0.45],
    technicalInfo: 'Geometría ilustrativa · sin certificación de protección',
  },
  {
    id: 'rail',
    name: 'Riel lateral',
    description:
      'Riel segmentado con puntos de fijación visibles. Selecciona una vista lateral para examinar su perfil.',
    position: [1.12, 0.22, 0.1],
    technicalInfo: 'Compatibilidad comercial no verificada',
  },
  {
    id: 'mount',
    name: 'Montura frontal',
    description:
      'Pieza de montaje frontal incluida en el modelo de demostración. No representa un estándar de conexión comercial.',
    position: [0, 0.4, 1.24],
  },
  {
    id: 'retention',
    name: 'Sistema de retención',
    description: 'Correas y mentonera modeladas para explorar la disposición del conjunto.',
    position: [0.4, -0.78, 0.5],
  },
  {
    id: 'padding',
    name: 'Almohadillas interiores',
    description:
      'Cinco almohadillas modeladas dentro de la carcasa. Usa la vista interior para inspeccionarlas.',
    position: [0, 0.72, 0.35],
    technicalInfo: 'Distribución conceptual; no es una ficha de fabricante',
  },
];
const images = (id: string, name: string) =>
  ['perspective', 'side', 'rear'].map((view, index) => ({
    src: assetUrl(`/images/${id}-${view}.webp`),
    alt: `${name}, render ilustrativo en vista ${['perspectiva', 'lateral', 'posterior'][index]}`,
  }));
const documentation = [
  {
    title: 'Guía del catálogo de demostración',
    url: assetUrl('/documents/catalogo-demo.html'),
    type: 'HTML',
  },
];
export const products: TacticalProduct[] = [
  ...[
    {
      id: 'atlas-olive',
      name: 'ATLAS / Olive',
      reference: 'T360-H01-OD',
      hex: '#788364',
      color: 'Olive drab',
      finish: 'Oliva mate · representación visual',
    },
    {
      id: 'atlas-sand',
      name: 'ATLAS / Sand',
      reference: 'T360-H01-SD',
      hex: '#b8a27b',
      color: 'Desert sand',
      finish: 'Arena mate · representación visual',
    },
    {
      id: 'atlas-carbon',
      name: 'ATLAS / Carbon',
      reference: 'T360-H01-CB',
      hex: '#464e49',
      color: 'Carbon grey',
      finish: 'Grafito mate · representación visual',
    },
  ].map(
    (item): TacticalProduct => ({
      id: item.id,
      name: item.name,
      reference: item.reference,
      manufacturer: 'T360 Design Lab',
      category: 'helmets',
      shortDescription: 'Casco conceptual de corte alto',
      description:
        'Una mirada completa al diseño. Explora la carcasa de corte alto, los rieles laterales, la montura frontal y el sistema interior de ATLAS en una experiencia tridimensional. Modelo original de demostración; no representa un equipo certificado.',
      color: { name: item.color, hex: item.hex },
      images: images(item.id, item.name),
      model3D: {
        exterior: assetUrl(`/models/helmets/${item.id}.glb`),
        hasInterior: true,
        scale: 1,
      },
      specifications: { finish: item.finish },
      components: helmetComponents,
      documentation,
      illustrative: true,
      featured: true,
    }),
  ),
  {
    id: 'rail-kit',
    name: 'ARC / Rail kit',
    manufacturer: 'T360 Design Lab',
    reference: 'T360-A02-RL',
    category: 'accessories',
    shortDescription: 'Conjunto de rieles laterales',
    description:
      'Explora dos rieles segmentados y sus fijaciones. Un estudio de forma para demostrar la inspección de accesorios; la compatibilidad con equipos comerciales no ha sido verificada.',
    color: { name: 'Graphite', hex: '#555e4b' },
    images: images('rail-kit', 'ARC / Rail kit'),
    model3D: { exterior: assetUrl('/models/accessories/rail-kit.glb') },
    specifications: { finish: 'Grafito mate · representación visual' },
    components: [
      {
        id: 'rail',
        name: 'Riel segmentado',
        description: 'Perfil lateral y anclajes presentes en el modelo de demostración.',
        position: [1.25, 0.2, 0.1],
      },
    ],
    documentation,
    illustrative: true,
  },
  {
    id: 'comfort-kit',
    name: 'CORE / Comfort kit',
    manufacturer: 'T360 Design Lab',
    reference: 'T360-I03-PD',
    category: 'interiors',
    shortDescription: 'Sistema de almohadillas interiores',
    description:
      'Conjunto conceptual de seis almohadillas independientes. Observa su geometría y distribución. Los materiales, dimensiones y propiedades de absorción deben ser aportados por el fabricante del producto final.',
    color: { name: 'Soft charcoal', hex: '#454b40' },
    images: images('comfort-kit', 'CORE / Comfort kit'),
    model3D: { exterior: assetUrl('/models/accessories/comfort-kit.glb') },
    specifications: { finish: 'Textura mate · representación visual' },
    components: [
      {
        id: 'pad',
        name: 'Almohadilla central',
        description: 'Volumen independiente con superficie de contacto modelada.',
        position: [0, 0.23, 0.4],
      },
    ],
    documentation,
    illustrative: true,
  },
  {
    id: 'visor',
    name: 'SPECTRA / Visor',
    manufacturer: 'T360 Design Lab',
    reference: 'T360-A04-VS',
    category: 'accessories',
    shortDescription: 'Visor curvo con marco superior',
    description:
      'Un estudio de superficies transparentes, curvatura y puntos de unión. Este modelo ilustrativo no acredita protección óptica, frente a impactos o balística.',
    color: { name: 'Smoke green', hex: '#8d9d90' },
    images: images('visor', 'SPECTRA / Visor'),
    model3D: { exterior: assetUrl('/models/accessories/visor.glb') },
    specifications: { finish: 'Translúcido · representación visual' },
    components: [
      {
        id: 'lens',
        name: 'Superficie del visor',
        description: 'Geometría curva translúcida incluida en el modelo conceptual.',
        position: [0, 0.16, 1.15],
      },
      {
        id: 'frame',
        name: 'Marco superior',
        description: 'Marco continuo sobre el borde superior del visor.',
        position: [0.6, 0.48, 0.94],
      },
    ],
    documentation,
    illustrative: true,
  },
];
