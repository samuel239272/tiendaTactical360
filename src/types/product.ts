export type Vector3Tuple = [number, number, number];
export type CategoryId = 'helmets' | 'accessories' | 'interiors';
export interface ProductComponent {
  id: string;
  name: string;
  description: string;
  position: Vector3Tuple;
  image?: string;
  technicalInfo?: string;
}
export interface TacticalProduct {
  id: string;
  name: string;
  manufacturer: string;
  reference: string;
  category: CategoryId;
  description: string;
  shortDescription: string;
  color: { name: string; hex: string };
  images: { src: string; alt: string }[];
  model3D?: { exterior: string; hasInterior?: boolean; scale?: number };
  specifications: {
    material?: string;
    weight?: string;
    dimensions?: string;
    sizes?: string[];
    finish?: string;
    certifications?: { name: string; sourceUrl: string }[];
  };
  components: ProductComponent[];
  documentation?: { title: string; url: string; type: string }[];
  illustrative: boolean;
  featured?: boolean;
}
