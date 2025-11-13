export type ProductCategory = 'cuidado' | 'maquinaria' | 'styling' | 'herramientas';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image?: string;
}

export const products: Product[] = [
  {
    id: 'upper-shampoo-barba',
    name: 'Shampoo Premium para Barba',
    description: 'Limpieza profunda con ingredientes naturales que mantienen el brillo y la suavidad.',
    price: 59000,
    category: 'cuidado',
  },
  {
    id: 'upper-aceite-barba',
    name: 'Aceite Restaurador Upper',
    description: 'Blend de aceites esenciales que hidrata y perfila la barba sin sensación grasosa.',
    price: 68000,
    category: 'cuidado',
  },
  {
    id: 'upper-polvo-volumen',
    name: 'Polvo Voluminizador Matte',
    description: 'Control total y acabado profesional para peinados freestyle y texturizados.',
    price: 52000,
    category: 'styling',
  },
  {
    id: 'upper-trimmer',
    name: 'Trimmer de Precisión Upper',
    description: 'Herramienta profesional con cuchillas de carbono y set de peines intercambiables.',
    price: 329000,
    category: 'maquinaria',
  },
  {
    id: 'upper-navaja',
    name: 'Navaja Clásica con Mango Metálico',
    description: 'Diseño equilibrado para un afeitado preciso y seguro en cada pasada.',
    price: 119000,
    category: 'herramientas',
  },
  {
    id: 'upper-kit-mantenimiento',
    name: 'Kit Mantenimiento Premium',
    description: 'Incluye cepillo de barba, tijeras de precisión y peine antiestático.',
    price: 154000,
    category: 'herramientas',
  },
];


