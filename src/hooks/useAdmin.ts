import { useState, useEffect, useCallback } from 'react';
import type { Service } from '../data/services';
import type { Product } from '../data/products';
import type { CustomCombo } from '../data/combos';
import { apiService } from '../services/api';

// Datos locales para sincronización
// import { principalServices, sinCitaServices } from '../data/services';
// import { comboServices } from '../data/combos';
// import { products as localProducts } from '../data/products';

export function useAdmin() {
    const [services, setServices] = useState<Service[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [combos, setCombos] = useState<CustomCombo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar datos al inicio
    const refreshData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [fetchedServices, fetchedProducts, fetchedCombos] = await Promise.all([
                apiService.getServices(),
                apiService.getProducts(),
                apiService.getCombos()
            ]);

            setServices(fetchedServices);
            setProducts(fetchedProducts);
            setCombos(fetchedCombos);

        } catch (err: any) {
            console.error('Error cargando datos de la API:', err);
            setError(err.message || 'Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    // --- ACTIONS (API Calls) ---

    // Services
    const addService = async (newService: Service) => {
        try {
            const created = await apiService.createService(newService);
            setServices(prev => [...prev, created]);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const updateService = async (updatedService: Service) => {
        try {
            const updated = await apiService.updateService(updatedService.id, updatedService);
            setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
        } catch (err: any) {
            setError(err.message);
        }
    };

    const deleteService = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este servicio?')) return;
        try {
            await apiService.deleteService(id);
            setServices(prev => prev.filter(s => s.id !== id));
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Products
    const addProduct = async (newProduct: Product) => {
        try {
            const created = await apiService.createProduct(newProduct);
            setProducts(prev => [...prev, created]);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const updateProduct = async (updatedProduct: Product) => {
        try {
            const updated = await apiService.updateProduct(updatedProduct.id, updatedProduct);
            setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
        } catch (err: any) {
            setError(err.message);
        }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            await apiService.deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Combos
    const addCombo = async (newCombo: CustomCombo) => {
        try {
            const created = await apiService.createCombo(newCombo);
            setCombos(prev => [...prev, created]);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const updateCombo = async (updatedCombo: CustomCombo) => {
        try {
            const updated = await apiService.updateCombo(updatedCombo);
            setCombos(prev => prev.map(c => c.id === updatedCombo.id ? updated : c));
        } catch (err: any) {
            setError(err.message);
        }
    };

    const deleteCombo = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este combo?')) return;
        try {
            await apiService.deleteCombo(id);
            setCombos(prev => prev.filter(c => c.id !== id));
        } catch (err: any) {
            setError(err.message);
        }
    };

    return {
        // State
        services,
        products,
        combos,
        loading,
        error,

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

