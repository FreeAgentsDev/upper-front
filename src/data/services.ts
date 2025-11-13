export interface Service {
  id: string;
  name: string;
  summary: string;
  duration: string;
  price: string;
  features: string[];
}

export const services: Service[] = [
  {
    id: 'corte-freestyle',
    name: 'Corte Freestyle',
    summary: 'Diseños personalizados con líneas y texturas inspiradas en el estilo urbano Upper.',
    duration: '60 min',
    price: '$55.000',
    features: [
      'Diagnóstico rápido de rostro y estilo',
      'Texturizado y definición con máquina y tijera',
      'Finalización con productos Upper Styling',
    ],
  },
  {
    id: 'barba-perfilada',
    name: 'Perfilado de Barba',
    summary: 'Afeitado al ras o con volumen, cuidando la línea natural y la hidratación.',
    duration: '45 min',
    price: '$38.000',
    features: [
      'Acondicionamiento con toalla caliente',
      'Shave gel refrescante y navaja de precisión',
      'Sellado con aceite restaurador Upper',
    ],
  },
  {
    id: 'combo-signature',
    name: 'Combo Signature',
    summary: 'Corte + barba + cejas con la experiencia completa Upper Barber Cuts.',
    duration: '90 min',
    price: '$85.000',
    features: [
      'Playlist personalizada',
      'Corte y diseño integrados a tu estilo de vida',
      'Rutina de cuidado recomendada para casa',
    ],
  },
  {
    id: 'cejas-precision',
    name: 'Cejas de Precisión',
    summary: 'Definición ligera para resaltar la mirada sin perder naturalidad.',
    duration: '25 min',
    price: '$25.000',
    features: [
      'Mapeo rápido según facciones',
      'Depilación combinada (cera y navaja)',
      'Producto calmante y tips de mantenimiento',
    ],
  },
];


