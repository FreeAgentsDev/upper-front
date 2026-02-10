import { useState, useEffect, useCallback } from 'react';
import type { Service } from '../data/services';
import type { Product } from '../data/products';
import type { CustomCombo } from '../data/combos';
import { apiService } from '../services/api';
import { storageService } from '../services/storage';

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

            // Sincronizar con localStorage para que la landing page tenga los datos
            storageService.saveServices(fetchedServices);
            storageService.saveProducts(fetchedProducts);
            storageService.saveCombos(fetchedCombos);

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
            setServices(prev => {
                const updated = [...prev, created];
                storageService.saveServices(updated);
                return updated;
            });
        } catch (err: any) {
            setError(err.message);
        }
    };

    const updateService = async (updatedService: Service) => {
        try {
            const updated = await apiService.updateService(updatedService.id, updatedService);
            setServices(prev => {
                const newServices = prev.map(s => s.id === updated.id ? updated : s);
                storageService.saveServices(newServices);
                return newServices;
            });
        } catch (err: any) {
            setError(err.message);
        }
    };

    const deleteService = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este servicio?')) return;
        try {
            await apiService.deleteService(id);
            setServices(prev => {
                const updated = prev.filter(s => s.id !== id);
                storageService.saveServices(updated);
                return updated;
            });
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Products
    const addProduct = async (newProduct: Product) => {
        try {
            const created = await apiService.createProduct(newProduct);
            setProducts(prev => {
                const updated = [...prev, created];
                storageService.saveProducts(updated);
                return updated;
            });
        } catch (err: any) {
            setError(err.message);
        }
    };

    const updateProduct = async (updatedProduct: Product) => {
        try {
            const updated = await apiService.updateProduct(updatedProduct.id, updatedProduct);
            setProducts(prev => {
                const newProducts = prev.map(p => p.id === updated.id ? updated : p);
                storageService.saveProducts(newProducts);
                return newProducts;
            });
        } catch (err: any) {
            setError(err.message);
        }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            await apiService.deleteProduct(id);
            setProducts(prev => {
                const updated = prev.filter(p => p.id !== id);
                storageService.saveProducts(updated);
                return updated;
            });
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Combos
    const addCombo = async (newCombo: CustomCombo) => {
        try {
            const created = await apiService.createCombo(newCombo);
            setCombos(prev => {
                const updated = [...prev, created];
                storageService.saveCombos(updated);
                return updated;
            });
        } catch (err: any) {
            setError(err.message);
        }
    };

    const updateCombo = async (updatedCombo: CustomCombo) => {
        try {
            const updated = await apiService.updateCombo(updatedCombo);
            setCombos(prev => {
                const newCombos = prev.map(c => c.id === updatedCombo.id ? updated : c);
                storageService.saveCombos(newCombos);
                return newCombos;
            });
        } catch (err: any) {
            setError(err.message);
        }
    };

    const deleteCombo = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este combo?')) return;
        try {
            await apiService.deleteCombo(id);
            setCombos(prev => {
                const updated = prev.filter(c => c.id !== id);
                storageService.saveCombos(updated);
                return updated;
            });
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

