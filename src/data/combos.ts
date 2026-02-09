import type { Service } from './services';

export interface CustomCombo {
  id: string;
  name: string;
  services: string[];
  price: number;
  description: string;
  createdAt: number;
}

// Interfaz extendida para combos que incluye tanto campos de Service como de CustomCombo
export interface ComboService extends Service {
  services: string[]; // IDs de los servicios que componen el combo
  createdAt: number;
}

// Almacenar combos personalizados en localStorage
export const COMBO_STORAGE_KEY = 'upper-custom-combos';

export function getCustomCombos(): CustomCombo[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(COMBO_STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveCustomCombo(combo: CustomCombo): void {
  if (typeof window === 'undefined') return;
  const combos = getCustomCombos();
  combos.push(combo);
  localStorage.setItem(COMBO_STORAGE_KEY, JSON.stringify(combos));
}

export function deleteCustomCombo(comboId: string): void {
  if (typeof window === 'undefined') return;
  const combos = getCustomCombos();
  const filtered = combos.filter((c) => c.id !== comboId);
  localStorage.setItem(COMBO_STORAGE_KEY, JSON.stringify(filtered));
}

// Adiciones al servicio (Combos)
export const comboServices: ComboService[] = [
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
    services: ['corte-cabello', 'diseno-barba'],
    createdAt: Date.now(),
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
    services: ['corte-cabello', 'cejas'],
    createdAt: Date.now(),
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
    services: ['corte-cabello', 'afeitado-barba'],
    createdAt: Date.now(),
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
    services: ['corte-cabello', 'lineas'],
    createdAt: Date.now(),
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
    services: ['diseno-barba', 'afeitado-barba'],
    createdAt: Date.now(),
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
    services: ['diseno-barba', 'cejas'],
    createdAt: Date.now(),
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
    services: ['corte-cabello', 'diseno-barba-pequena'],
    createdAt: Date.now(),
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
    services: ['corte-cabello', 'diseno-barba', 'cejas'],
    createdAt: Date.now(),
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
    services: ['corte-cabello', 'diseno-barba', 'lineas'],
    createdAt: Date.now(),
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
    services: ['corte-cabello', 'afeitado-barba', 'cejas'],
    createdAt: Date.now(),
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
    services: ['corte-cabello', 'afeitado-barba', 'lineas'],
    createdAt: Date.now(),
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
    services: ['corte-cabello', 'cejas', 'lineas'],
    createdAt: Date.now(),
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
    services: ['corte-cabello', 'diseno-barba', 'cejas', 'lineas'],
    createdAt: Date.now(),
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
    services: ['corte-cabello', 'afeitado-barba', 'lineas', 'cejas'],
    createdAt: Date.now(),
  },
];


