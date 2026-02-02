import type { Service } from '../data/services';
import type { Product } from '../data/products';
import type { CustomCombo } from '../data/combos';

// Claves para guardar en el navegador
const KEYS = {
    SERVICES: 'admin_services',
    PRODUCTS: 'admin_products',
    COMBOS: 'upper-custom-combos'
};

// Leer datos
const getItems = <T>(key: string, initialData: T[] = []): T[] => {
    if (typeof window === 'undefined') return initialData;
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : initialData;
    } catch (error) {
        console.error(`Error leyendo ${key} de localStorage:`, error);
        return initialData;
    }
};

// Guardar datos
const saveItems = <T>(key: string, items: T[]): void => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(key, JSON.stringify(items));
            // Actualizar componentes
            window.dispatchEvent(new Event('storage-update'));
        } catch (error) {
            console.error(`Error guardando ${key} en localStorage:`, error);
        }
    }
};

// Servicios
export const storageService = {
    getServices: (initial: Service[]) => getItems<Service>(KEYS.SERVICES, initial),
    saveServices: (items: Service[]) => saveItems(KEYS.SERVICES, items),

    getProducts: (initial: Product[]) => getItems<Product>(KEYS.PRODUCTS, initial),
    saveProducts: (items: Product[]) => saveItems(KEYS.PRODUCTS, items),

    getCombos: (initial: CustomCombo[]) => getItems<CustomCombo>(KEYS.COMBOS, initial),
    saveCombos: (items: CustomCombo[]) => saveItems(KEYS.COMBOS, items),
};
