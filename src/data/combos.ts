export interface CustomCombo {
  id: string;
  name: string;
  services: string[];
  price: number;
  description: string;
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

