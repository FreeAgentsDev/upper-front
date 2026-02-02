import { useState, useEffect } from 'react';
import type { Service } from '../data/services';
import type { Product } from '../data/products';
import type { CustomCombo } from '../data/combos';
import { storageService } from '../services/storage';

// Importar datos iniciales
import { principalServices, comboServices, sinCitaServices } from '../data/services';
import { products as initialProducts } from '../data/products';
import { getCustomCombos } from '../data/combos'; // Mantenemos compatibilidad por ahora

export function useAdmin() {
    const [services, setServices] = useState<Service[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [combos, setCombos] = useState<CustomCombo[]>([]);
    const [loading, setLoading] = useState(true);

    // Cargar datos al inicio
    const refreshData = () => {
        setLoading(true);
        // Combina servicios iniciales + guardados
        const initialServices = [...principalServices, ...comboServices, ...sinCitaServices];
        setServices(storageService.getServices(initialServices));

        setProducts(storageService.getProducts(initialProducts));

        // Combos es un caso especial porque getCustomCombos ya existe, pero migraremos
        const loadedCombos = storageService.getCombos([]);

        // Convertir los combos estáticos a formato CustomCombo visual
        const staticCombos: CustomCombo[] = comboServices.map(s => ({
            id: s.id,
            name: s.name,
            services: [], // Los combos estáticos no tienen lista de IDs de sub-servicios
            price: s.priceNumber,
            description: s.summary,
            createdAt: 0
        }));

        if (loadedCombos.length === 0) {
            // Fallback a la función antigua si storage está vacío
            const legacyCombos = getCustomCombos();
            setCombos([...staticCombos, ...legacyCombos]);
        } else {
            setCombos([...staticCombos, ...loadedCombos]);
        }

        setLoading(false);
    };

    useEffect(() => {
        refreshData();

        // Escuchar cambios de otras pestañas o componentes
        const handleStorageChange = () => refreshData();
        window.addEventListener('storage-update', handleStorageChange);

        return () => {
            window.removeEventListener('storage-update', handleStorageChange);
        };
    }, []);

    // --- ACTIONS (Controller Logic) ---

    // Services
    const addService = (newService: Service) => {
        const updated = [...services, newService];
        storageService.saveServices(updated);
        setServices(updated);
    };

    const updateService = (updatedService: Service) => {
        const updated = services.map(s => s.id === updatedService.id ? updatedService : s);
        storageService.saveServices(updated);
        setServices(updated);
    };

    const deleteService = (id: string) => {
        const updated = services.filter(s => s.id !== id);
        storageService.saveServices(updated);
        setServices(updated);
    };

    // Products
    const addProduct = (newProduct: Product) => {
        const updated = [...products, newProduct];
        storageService.saveProducts(updated);
        setProducts(updated);
    };

    const updateProduct = (updatedProduct: Product) => {
        const updated = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
        storageService.saveProducts(updated);
        setProducts(updated);
    };

    const deleteProduct = (id: string) => {
        const updated = products.filter(p => p.id !== id);
        storageService.saveProducts(updated);
        setProducts(updated);
    };

    // Combos
    const addCombo = (newCombo: CustomCombo) => {
        const updated = [...combos, newCombo];
        storageService.saveCombos(updated);
        setCombos(updated);
    };

    const updateCombo = (updatedCombo: CustomCombo) => {
        const updated = combos.map(c => c.id === updatedCombo.id ? updatedCombo : c);
        storageService.saveCombos(updated);
        setCombos(updated);
    };

    const deleteCombo = (id: string) => {
        const updated = combos.filter(c => c.id !== id);
        storageService.saveCombos(updated);
        setCombos(updated);
    };

    return {
        // State
        services,
        products,
        combos,
        loading,

        // Methods
        refreshData,

        // Service Actions
        addService,
        updateService,
        deleteService,

        // Product Actions
        addProduct,
        updateProduct,
        deleteProduct,

        // Combo Actions
        addCombo,
        updateCombo,
        deleteCombo
    };
}
