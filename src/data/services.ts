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

// import { comboServices } from './combos';

//  Adiciones al servicio (Combos)
// export { comboServices };

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
  ...sinCitaServices,
];
