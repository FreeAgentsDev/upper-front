export interface Service {
  id: string;
  name: string;
  summary: string;
  duration: string;
  price: string;
  priceNumber: number;
  features: string[];
  category: 'principal' | 'combo' | 'sin-cita';
}

export interface ServiceCombo {
  id: string;
  name: string;
  services: string[];
  price: number;
  description: string;
}

// Servicios principales
export const principalServices: Service[] = [
  {
    id: 'corte-cabello',
    name: 'Corte de Cabello',
    summary: 'Cortes profesionales personalizados que definen tu estilo único. Diseños modernos con técnicas avanzadas de barbería.',
    duration: '45 min',
    price: '$22.000',
    priceNumber: 22000,
    category: 'principal',
    features: [
      'Diagnóstico de rostro y estilo',
      'Corte con máquina y tijera',
      'Finalización con productos Upper',
    ],
  },
  {
    id: 'diseno-barba',
    name: 'Diseño de Barba',
    summary: 'Perfilado profesional de barba que resalta tus facciones. Cuidado detallado con técnicas de precisión.',
    duration: '30 min',
    price: '$22.000',
    priceNumber: 22000,
    category: 'principal',
    features: [
      'Acondicionamiento con toalla caliente',
      'Perfilado con navaja de precisión',
      'Hidratación con aceite restaurador',
    ],
  },
];

// Adiciones al servicio (Combos)
export const comboServices: Service[] = [
  {
    id: 'corte-barba',
    name: 'Corte + Barba',
    summary: 'La combinación perfecta. Transformación completa con corte de cabello y diseño de barba profesional.',
    duration: '75 min',
    price: '$33.000',
    priceNumber: 33000,
    category: 'combo',
    features: [
      'Corte personalizado',
      'Diseño de barba profesional',
      'Productos premium incluidos',
    ],
  },
  {
    id: 'corte-cejas',
    name: 'Corte + Cejas',
    summary: 'Corte de cabello con definición de cejas para un look completo y armonioso.',
    duration: '50 min',
    price: '$25.000',
    priceNumber: 25000,
    category: 'combo',
    features: [
      'Corte personalizado',
      'Cejas de precisión',
      'Asesoría de estilo',
    ],
  },
  {
    id: 'corte-afeitado',
    name: 'Corte + Afeitado',
    summary: 'Corte de cabello con afeitado al ras para un acabado impecable y profesional.',
    duration: '60 min',
    price: '$28.000',
    priceNumber: 28000,
    category: 'combo',
    features: [
      'Corte personalizado',
      'Afeitado al ras',
      'Productos calmantes incluidos',
    ],
  },
  {
    id: 'corte-lineas',
    name: 'Corte + Líneas',
    summary: 'Corte de cabello con diseños y líneas personalizadas para un estilo único y moderno.',
    duration: '55 min',
    price: '$25.000',
    priceNumber: 25000,
    category: 'combo',
    features: [
      'Corte personalizado',
      'Diseños y líneas creativas',
      'Acabado profesional',
    ],
  },
  {
    id: 'barba-afeitado',
    name: 'Barba + Afeitado',
    summary: 'Diseño de barba con afeitado al ras para un acabado perfecto y definido.',
    duration: '40 min',
    price: '$30.000',
    priceNumber: 30000,
    category: 'combo',
    features: [
      'Diseño de barba',
      'Afeitado de precisión',
      'Hidratación profunda',
    ],
  },
  {
    id: 'barba-cejas',
    name: 'Barba + Cejas',
    summary: 'Diseño de barba con definición de cejas para un look armonioso y cuidado.',
    duration: '35 min',
    price: '$25.000',
    priceNumber: 25000,
    category: 'combo',
    features: [
      'Diseño de barba',
      'Cejas de precisión',
      'Productos calmantes',
    ],
  },
  {
    id: 'corte-barba-pequena',
    name: 'Corte + Barba Pequeña',
    summary: 'Corte de cabello con diseño de barba pequeña para un look equilibrado y moderno.',
    duration: '50 min',
    price: '$28.000',
    priceNumber: 28000,
    category: 'combo',
    features: [
      'Corte personalizado',
      'Diseño de barba pequeña',
      'Productos incluidos',
    ],
  },
  {
    id: 'corte-barba-cejas',
    name: 'Corte + Barba + Cejas',
    summary: 'Transformación completa con corte, barba y cejas. El combo más completo para un look perfecto.',
    duration: '80 min',
    price: '$35.000',
    priceNumber: 35000,
    category: 'combo',
    features: [
      'Corte personalizado',
      'Diseño de barba',
      'Cejas de precisión',
      'Productos premium',
    ],
  },
  {
    id: 'corte-barba-lineas',
    name: 'Corte + Barba + Líneas',
    summary: 'Corte con diseño de barba y líneas creativas para un estilo único y moderno.',
    duration: '85 min',
    price: '$35.000',
    priceNumber: 35000,
    category: 'combo',
    features: [
      'Corte personalizado',
      'Diseño de barba',
      'Líneas y diseños',
      'Acabado profesional',
    ],
  },
  {
    id: 'corte-afeitado-cejas',
    name: 'Corte + Afeitado + Cejas',
    summary: 'Corte con afeitado al ras y definición de cejas para un acabado impecable.',
    duration: '65 min',
    price: '$30.000',
    priceNumber: 30000,
    category: 'combo',
    features: [
      'Corte personalizado',
      'Afeitado al ras',
      'Cejas de precisión',
      'Productos calmantes',
    ],
  },
  {
    id: 'corte-afeitado-lineas',
    name: 'Corte + Afeitado + Líneas',
    summary: 'Corte con afeitado y líneas creativas para un estilo moderno y definido.',
    duration: '70 min',
    price: '$30.000',
    priceNumber: 30000,
    category: 'combo',
    features: [
      'Corte personalizado',
      'Afeitado al ras',
      'Líneas y diseños',
      'Acabado profesional',
    ],
  },
  {
    id: 'corte-cejas-lineas',
    name: 'Corte + Cejas + Líneas',
    summary: 'Corte con definición de cejas y líneas creativas para un look único.',
    duration: '60 min',
    price: '$27.000',
    priceNumber: 27000,
    category: 'combo',
    features: [
      'Corte personalizado',
      'Cejas de precisión',
      'Líneas y diseños',
      'Productos incluidos',
    ],
  },
  {
    id: 'corte-barba-cejas-lineas',
    name: 'Corte + Barba + Cejas + Líneas',
    summary: 'El combo más completo. Transformación total con corte, barba, cejas y líneas creativas.',
    duration: '90 min',
    price: '$37.000',
    priceNumber: 37000,
    category: 'combo',
    features: [
      'Corte personalizado',
      'Diseño de barba',
      'Cejas de precisión',
      'Líneas y diseños',
      'Productos premium',
    ],
  },
  {
    id: 'corte-afeitado-lineas-cejas',
    name: 'Corte + Afeitado + Líneas + Cejas',
    summary: 'Combo completo con corte, afeitado, líneas y cejas para un acabado perfecto.',
    duration: '75 min',
    price: '$32.000',
    priceNumber: 32000,
    category: 'combo',
    features: [
      'Corte personalizado',
      'Afeitado al ras',
      'Líneas y diseños',
      'Cejas de precisión',
      'Productos calmantes',
    ],
  },
];

// Servicios sin cita
export const sinCitaServices: Service[] = [
  {
    id: 'diseno-barba-pequena',
    name: 'Diseño de Barba Pequeña',
    summary: 'Perfilado rápido de barba pequeña. Servicio express sin necesidad de cita previa.',
    duration: '15 min',
    price: '$16.000',
    priceNumber: 16000,
    category: 'sin-cita',
    features: [
      'Perfilado rápido',
      'Sin cita previa',
      'Productos incluidos',
    ],
  },
  {
    id: 'afeitado-cabeza',
    name: 'Afeitado de Cabeza',
    summary: 'Afeitado completo de cabeza al ras para un acabado impecable y suave.',
    duration: '20 min',
    price: '$11.000',
    priceNumber: 11000,
    category: 'sin-cita',
    features: [
      'Afeitado al ras',
      'Sin cita previa',
      'Productos calmantes',
    ],
  },
  {
    id: 'afeitado-barba',
    name: 'Afeitado de Barba',
    summary: 'Afeitado completo de barba al ras para un look limpio y definido.',
    duration: '15 min',
    price: '$8.000',
    priceNumber: 8000,
    category: 'sin-cita',
    features: [
      'Afeitado al ras',
      'Sin cita previa',
      'Productos calmantes',
    ],
  },
  {
    id: 'contornos',
    name: 'Contornos',
    summary: 'Definición de contornos y líneas para mantener tu estilo entre cortes.',
    duration: '10 min',
    price: '$7.000',
    priceNumber: 7000,
    category: 'sin-cita',
    features: [
      'Definición de líneas',
      'Sin cita previa',
      'Acabado rápido',
    ],
  },
  {
    id: 'cejas',
    name: 'Cejas',
    summary: 'Definición rápida de cejas para mantener tu look siempre impecable.',
    duration: '10 min',
    price: '$6.000',
    priceNumber: 6000,
    category: 'sin-cita',
    features: [
      'Definición de cejas',
      'Sin cita previa',
      'Productos calmantes',
    ],
  },
  {
    id: 'lineas',
    name: 'Líneas',
    summary: 'Diseños y líneas creativas. Precio según complejidad del diseño.',
    duration: '15-30 min',
    price: '$2.000 - $10.000',
    priceNumber: 2000,
    category: 'sin-cita',
    features: [
      'Diseños personalizados',
      'Sin cita previa',
      'Precio según complejidad',
    ],
  },
];

// Todos los servicios combinados
export const services: Service[] = [
  ...principalServices,
  ...comboServices,
  ...sinCitaServices,
];
