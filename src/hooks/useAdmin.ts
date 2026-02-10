import { useState, useEffect, useCallback } from 'react';
import type { Service } from '../data/services';
import type { Product } from '../data/products';
import type { CustomCombo } from '../data/combos';
import { services as initialServices } from '../data/services';
import { products as initialProducts } from '../data/products';
import { apiService } from '../services/api';
import { storageService } from '../services/storage';

export function useAdmin() {
    const [services, setServices] = useState<Service[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [combos, setCombos] = useState<CustomCombo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar datos al inicio - localStorage primero, API como fallback
    const refreshData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Primero intentar leer del localStorage (datos locales editados)
            let storedServices = storageService.getServices(initialServices);
            let storedProducts = storageService.getProducts(initialProducts);
            let storedCombos = storageService.getCombos([]);

            // Si hay datos en localStorage, usarlos
            if (storedServices.length > 0 || storedProducts.length > 0 || storedCombos.length > 0) {
                setServices(storedServices);
                setProducts(storedProducts);
                setCombos(storedCombos);
                setLoading(false);
                return;
            }

            // Si no hay datos en localStorage, intentar obtener de la API
            try {
                const [fetchedServices, fetchedProducts, fetchedCombos] = await Promise.all([
                    apiService.getServices(),
                    apiService.getProducts(),
                    apiService.getCombos()
                ]);

                setServices(fetchedServices);
                setProducts(fetchedProducts);
                setCombos(fetchedCombos);

                // Guardar en localStorage para futuras cargas
                storageService.saveServices(fetchedServices);
                storageService.saveProducts(fetchedProducts);
                storageService.saveCombos(fetchedCombos);
            } catch (apiErr) {
                // Si la API falla, usar los datos iniciales
                console.error('API no disponible, usando datos iniciales:', apiErr);
                setServices(initialServices);
                setProducts(initialProducts);
                setCombos([]);
                storageService.saveServices(initialServices);
                storageService.saveProducts(initialProducts);
                storageService.saveCombos([]);
            }

        } catch (err: any) {
            console.error('Error cargando datos:', err);
            setError(err.message || 'Error al conectar con el servidor');
            // Fallback a los datos iniciales
            setServices(initialServices);
            setProducts(initialProducts);
            setCombos([]);
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
            // Actualizar localmente primero (optimistic update)
            setServices(prev => {
                const newServices = prev.map(s => s.id === updatedService.id ? updatedService : s);
                storageService.saveServices(newServices);
                return newServices;
            });

            // Intentar sincronizar con API (pero no es crítico si falla)
            try {
                await apiService.updateService(updatedService.id, updatedService);
            } catch (apiErr) {
                console.error('Error sincronizando con API, pero localStorage está actualizado:', apiErr);
            }
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
            // Actualizar localmente primero (optimistic update)
            setProducts(prev => {
                const newProducts = prev.map(p => p.id === updatedProduct.id ? updatedProduct : p);
                storageService.saveProducts(newProducts);
                return newProducts;
            });

            // Intentar sincronizar con API (pero no es crítico si falla)
            try {
                await apiService.updateProduct(updatedProduct.id, updatedProduct);
            } catch (apiErr) {
                console.error('Error sincronizando con API, pero localStorage está actualizado:', apiErr);
            }
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
            // Actualizar localmente primero (optimistic update)
            setCombos(prev => {
                const newCombos = prev.map(c => c.id === updatedCombo.id ? updatedCombo : c);
                storageService.saveCombos(newCombos);
                return newCombos;
            });

            // Intentar sincronizar con API (pero no es crítico si falla)
            try {
                await apiService.updateCombo(updatedCombo);
            } catch (apiErr) {
                console.error('Error sincronizando con API, pero localStorage está actualizado:', apiErr);
            }
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

