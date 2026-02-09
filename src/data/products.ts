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
  // Cuidado
  {
    id: 'upper-cuidado-cuero-cabelludo-barba',
    name: 'Cuidado Premium Cuero Cabelludo y Barba',
    description: 'El cuidado empieza en tu cuero cabelludo. Tenemos la solución para ambos tipos de cuidado.',
    price: 42000,
    category: 'cuidado',
    image: '/media/tienda/cuidado/el-cuidado-empieza-en-tu-cuero-cabelludo-tenemos-la-solucio-n-para-ambos-tip-20250906-112529-0000.webp',
  },
  {
    id: 'upper-minoxidil',
    name: 'Minoxidil',
    description: 'Tratamiento efectivo para el crecimiento y fortalecimiento del cabello y barba.',
    price: 42000,
    category: 'cuidado',
  },
  {
    id: 'upper-aceites-barba',
    name: 'Aceites para Barba',
    description: 'Hidratación profunda y nutrición para mantener tu barba suave y brillante.',
    price: 34000,
    category: 'cuidado',
  },
  {
    id: 'upper-locion-despues-afeitado',
    name: 'Loción para Después del Afeitado',
    description: 'Calma y refresca la piel después del afeitado, previniendo irritaciones.',
    price: 12000,
    category: 'cuidado',
  },
  {
    id: 'upper-gel-afeitar',
    name: 'Gel para Afeitar',
    description: 'Gel de afeitado que proporciona un deslizamiento suave y protección para la piel.',
    price: 12000,
    category: 'cuidado',
  },
  {
    id: 'upper-shampoo-green-forest',
    name: 'Shampoo Green Forest',
    description: 'Shampoo natural con extractos de bosque para limpieza profunda y cuidado del cabello.',
    price: 40000,
    category: 'cuidado',
  },
  {
    id: 'upper-shampoo-premium',
    name: 'Shampoo Premium',
    description: 'Limpieza profunda con ingredientes naturales que mantienen el brillo y la suavidad.',
    price: 38000,
    category: 'cuidado',
  },
  {
    id: 'upper-acondicionador',
    name: 'Acondicionador Premium',
    description: 'Acondicionador nutritivo que suaviza y desenreda el cabello sin dejar residuos.',
    price: 38000,
    category: 'cuidado',
  },
  {
    id: 'upper-tratamiento-capilar',
    name: 'Tratamiento Capilar',
    description: 'Tratamiento reparador para cabello dañado, restaurando su salud y brillo natural.',
    price: 38000,
    category: 'cuidado',
  },
  // Styling
  {
    id: 'upper-ceras-nishman',
    name: 'Ceras Nishman',
    description: 'Ceras profesionales de alta calidad para un control y fijación excepcionales.',
    price: 35000,
    category: 'styling',
  },
  {
    id: 'upper-cera-polvo',
    name: 'Cera en Polvo',
    description: 'Control total y acabado profesional para peinados freestyle y texturizados con acabado mate.',
    price: 38000,
    category: 'styling',
    image: '/media/tienda/styling/cera-en-polvo-20250717-132352-0000.webp',
  },
  {
    id: 'upper-cera-amarilla-crema',
    name: 'Cera Amarilla en Crema',
    description: 'Cera en crema de alta fijación con acabado natural y brillo controlado.',
    price: 38000,
    category: 'styling',
  },
  {
    id: 'upper-cera-roqvel-verde',
    name: 'Cera Roqvel Verde',
    description: 'Cera profesional de fijación media-alta con acabado mate y textura natural.',
    price: 35000,
    category: 'styling',
  },
  {
    id: 'upper-lapiz-barba',
    name: 'Lápiz para Barba',
    description: 'Herramienta de precisión para el cuidado y styling de tu barba con acabado profesional.',
    price: 22000,
    category: 'styling',
    image: '/media/tienda/beard-pen-20250729-155412-0000.webp',
  },
  // Herramientas
  {
    id: 'upper-barberas',
    name: 'Barberas',
    description: 'Navajas profesionales de alta calidad para un afeitado preciso y seguro.',
    price: 10000,
    category: 'herramientas',
  },
  {
    id: 'upper-cepillo-barba',
    name: 'Cepillo para Barba',
    description: 'Cepillo de cerdas naturales para desenredar, dar forma y distribuir productos en tu barba.',
    price: 22000,
    category: 'herramientas',
  },
  {
    id: 'upper-peine-dientes-separados-1',
    name: 'Peine Dientes Separados',
    description: 'No todos los peines son iguales. Diseño profesional para un cuidado superior de tu barba y cabello.',
    price: 5000,
    category: 'herramientas',
    image: '/media/tienda/herramientas/no-todos-los-peines-son-iguales-20250515-083111-0001.webp',
  },
  {
    id: 'upper-peine-dientes-separados-2',
    name: 'Peine Dientes Separados',
    description: 'No todos los peines son iguales. Herramienta esencial para el cuidado diario de tu barba y cabello.',
    price: 5000,
    category: 'herramientas',
    image: '/media/tienda/herramientas/no-todos-los-peines-son-iguales-20250515-083111-0002.webp',
  },
  {
    id: 'upper-peine-dientes-separados-3',
    name: 'Peine Dientes Separados',
    description: 'No todos los peines son iguales. Diseño ergonómico para un peinado perfecto sin estática.',
    price: 5000,
    category: 'herramientas',
    image: '/media/tienda/herramientas/no-todos-los-peines-son-iguales-20250515-140343-0002.webp',
  },
  {
    id: 'upper-derma-roller',
    name: 'Derma Roller',
    description: 'Herramienta de microagujas para estimular el crecimiento del cabello y mejorar la absorción de productos.',
    price: 22000,
    category: 'herramientas',
  },
];
