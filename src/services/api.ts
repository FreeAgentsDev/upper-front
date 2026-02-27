import type { Service } from '../data/services';
import { services as localServices } from '../data/services';
import type { Product, ProductCategory } from '../data/products';
import { products as localProducts } from '../data/products';
import type { CustomCombo } from '../data/combos';

const API_BASE_URL = '/api';

// --- Auth helpers ---
const TOKEN_KEY = 'admin_token';

export function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('admin_authenticated');
}

function authHeaders(): Record<string, string> {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Cache para categorías
let serviceCategoriesCache: any[] = [];
let productCategoriesCache: any[] = [];

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        if (response.status === 401) {
            clearToken();
            if (typeof window !== 'undefined') {
                window.location.href = '/admin/login';
            }
            throw new Error('Sesión expirada. Inicia sesión nuevamente.');
        }
        let errorMessage = `Error HTTP: ${response.status}`;
        try {
            const errorData = await response.json();
            console.error('API Error details:', errorData);
            errorMessage = errorData.message || errorData.error || errorData.detail || errorMessage;
        } catch (e) {
            console.error('Could not parse error response');
        }
        throw new Error(errorMessage);
    }
    return response.json();
}

// Mapeos de datos (Backend -> Frontend)
const resolveImagePath = (imageUrl?: string, category?: string): string | undefined => {
    if (!imageUrl) return undefined;
    if (imageUrl.startsWith('/uploads/')) return imageUrl;
    if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) return imageUrl;

    // Mapeo detallado de categorías del backend a carpetas locales
    const cat = (category || '').toLowerCase();
    let folder = 'styling'; // Default

    if (cat.includes('cuidado')) folder = 'cuidado';
    else if (cat.includes('vera') || cat.includes('pomada') || cat.includes('styling')) folder = 'styling';
    else if (cat.includes('herramienta') || cat.includes('maquinaria') || cat.includes('aceite')) folder = 'herramientas';

    // Limpiar el nombre del archivo y forzar .webp que es lo que tenemos localmente
    const cleanFileName = imageUrl.split('/').pop()?.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    if (!cleanFileName) return undefined;

    return `/media/tienda/${folder}/${cleanFileName}`;
};

const mapBackendService = (s: any): Service => {
    const backendCategory = s.category?.name || '';
    let frontendCategory: string;

    if (backendCategory === 'Tratamientos') {
        frontendCategory = 'sin-cita';
    } else if (s.name?.includes(' + ') || s.name?.toLowerCase().startsWith('combo')) {
        frontendCategory = 'combo';
    } else {
        frontendCategory = 'principal';
    }

    // Enriquecer con datos locales (features, imágenes) cuando el backend no los tiene
    const localMatch = localServices.find(ls => ls.name.toLowerCase() === s.name?.toLowerCase());

    const features = s.features
        ? (Array.isArray(s.features) ? s.features : JSON.parse(s.features))
        : (localMatch?.features || []);

    const uploadImage = s.image_url?.startsWith('/uploads/') ? s.image_url : undefined;

    return {
        id: s.id.toString(),
        name: s.name,
        summary: s.description || '',
        duration: s.duration || '',
        price: `$${(s.price || 0).toLocaleString('es-CO')}`,
        priceNumber: s.price || 0,
        features,
        category: frontendCategory,
        image: uploadImage || localMatch?.image
    };
};

const mapBackendProduct = (p: any): Product => {
    const rawCategory = p.category?.name?.toLowerCase() || 'cuidado';

    // Normalizar categoría para el frontend
    let categoryName: ProductCategory = 'cuidado';
    if (rawCategory.includes('shampoo') || rawCategory.includes('cuidado')) categoryName = 'cuidado';
    else if (rawCategory.includes('cera') || rawCategory.includes('pomada') || rawCategory.includes('styling')) categoryName = 'styling';
    else if (rawCategory.includes('aceite') || rawCategory.includes('herramienta')) categoryName = 'herramientas';
    else if (rawCategory.includes('maquina')) categoryName = 'maquinaria';

    // Prioridad 1: Buscar por nombre en los productos locales
    const localMatch = localProducts.find(lp => lp.name.toLowerCase() === p.name.toLowerCase());
    if (localMatch) categoryName = localMatch.category;

    // Prioridad 2: Intentar resolver la imagen
    const resolvedBackendImage = resolveImagePath(p.image_url, rawCategory);


    // Prioridad: imagen de uploads > local match > resolved backend
    const uploadImage = p.image_url?.startsWith('/uploads/') ? p.image_url : undefined;

    return {
        id: p.id.toString(),
        name: p.name,
        description: p.description || '',
        price: p.price || 0,
        category: categoryName as any,
        image: uploadImage || localMatch?.image || resolvedBackendImage
    };
};

export const apiService = {
    // Auth
    async login(password: string): Promise<string> {
        const data = await handleResponse<{ token: string }>(await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        }));
        setToken(data.token);
        return data.token;
    },

    // Categories
    async getServiceCategories(): Promise<any[]> {
        if (serviceCategoriesCache.length > 0) return serviceCategoriesCache;
        serviceCategoriesCache = await handleResponse<any[]>(await fetch(`${API_BASE_URL}/service-categories`));
        return serviceCategoriesCache;
    },

    async getProductCategories(): Promise<any[]> {
        if (productCategoriesCache.length > 0) return productCategoriesCache;
        productCategoriesCache = await handleResponse<any[]>(await fetch(`${API_BASE_URL}/product-categories`));
        return productCategoriesCache;
    },

    // Services
    async getServices(): Promise<Service[]> {
        const data = await handleResponse<any[]>(await fetch(`${API_BASE_URL}/services`));
        if (!data || !Array.isArray(data)) {
            console.error('getServices: Invalid response from backend', data);
            return [];
        }
        return data.map(mapBackendService);
    },

    async createService(service: Partial<Service>): Promise<Service> {
        const categories = await this.getServiceCategories();
        // Mapear el nombre de la categoría del frontend a un ID del backend
        const categoryMap: Record<string, string> = {
            'principal': 'Cortes',
            'combo': 'Cortes',
            'sin-cita': 'Tratamientos'
        };
        const backendCatName = categoryMap[service.category || 'principal'] || 'Cortes';
        const category = categories.find(c => c.name === backendCatName) || categories[0];

        const body = {
            name: service.name,
            description: service.summary,
            duration: service.duration,
            price: service.priceNumber,
            category_id: category?.id || 1,
            features: JSON.stringify(service.features || []),
            image_url: service.image
        };
        const data = await handleResponse<any>(await fetch(`${API_BASE_URL}/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
            body: JSON.stringify(body)
        }));
        return mapBackendService(data);
    },

    async updateService(id: string, service: Partial<Service>): Promise<Service> {
        const body: any = {};
        if (service.name) body.name = service.name;
        if (service.summary) body.description = service.summary;
        if (service.duration) body.duration = service.duration;
        if (service.priceNumber) body.price = service.priceNumber;
        if (service.features) body.features = JSON.stringify(service.features);
        if (service.image) body.image_url = service.image;

        if (service.category) {
            const categories = await this.getServiceCategories();
            const categoryMap: Record<string, string> = {
                'principal': 'Cortes',
                'combo': 'Cortes',
                'sin-cita': 'Tratamientos'
            };
            const backendCatName = categoryMap[service.category] || 'Cortes';
            const category = categories.find(c => c.name === backendCatName);
            if (category) body.category_id = category.id;
        }

        const data = await handleResponse<any>(await fetch(`${API_BASE_URL}/services/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
            body: JSON.stringify(body)
        }));
        return mapBackendService(data);
    },

    async deleteService(id: string): Promise<void> {
        await handleResponse(await fetch(`${API_BASE_URL}/services/${id}`, {
            method: 'DELETE',
            headers: { ...authHeaders() }
        }));
    },

    // Products
    async getProducts(): Promise<Product[]> {
        const data = await handleResponse<any[]>(await fetch(`${API_BASE_URL}/products`));
        if (!data || !Array.isArray(data)) {
            console.error('getProducts: Invalid response from backend', data);
            return [];
        }
        return data.map(mapBackendProduct);
    },

    async createProduct(product: Partial<Product>): Promise<Product> {
        const categories = await this.getProductCategories();
        const categoryMap: Record<string, string> = {
            'cuidado': 'Shampoos',
            'styling': 'Ceras y Pomadas',
            'herramientas': 'Aceites',
            'maquinaria': 'Aceites'
        };
        const backendCatName = categoryMap[product.category || 'cuidado'] || 'Shampoos';
        const category = categories.find(c => c.name === backendCatName) || categories[0];

        const body = {
            name: product.name,
            description: product.description,
            price: product.price,
            category_id: category?.id || 1,
            image_url: product.image,
            stock: 10
        };
        const data = await handleResponse<any>(await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
            body: JSON.stringify(body)
        }));
        return mapBackendProduct(data);
    },

    async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
        const body: any = {};
        if (product.name) body.name = product.name;
        if (product.description) body.description = product.description;
        if (product.price) body.price = product.price;
        if (product.image) body.image_url = product.image;
        if (product.category) {
            const categories = await this.getProductCategories();
            const categoryMap: Record<string, string> = {
                'cuidado': 'Shampoos',
                'styling': 'Ceras y Pomadas',
                'herramientas': 'Aceites',
                'maquinaria': 'Aceites'
            };
            const backendCatName = categoryMap[product.category] || 'Shampoos';
            const category = categories.find(c => c.name === backendCatName);
            if (category) body.category_id = category.id;
        }

        const data = await handleResponse<any>(await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
            body: JSON.stringify(body)
        }));
        return mapBackendProduct(data);
    },

    async deleteProduct(id: string): Promise<void> {
        await handleResponse(await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE',
            headers: { ...authHeaders() }
        }));
    },

    // Combos
    async getCombos(): Promise<CustomCombo[]> {
        const data = await handleResponse<any[]>(await fetch(`${API_BASE_URL}/combos`));
        if (!data || !Array.isArray(data)) {
            console.error('getCombos: Invalid response from backend', data);
            return [];
        }
        return data.map(c => ({
            id: c.id.toString(),
            name: c.name,
            services: c.items?.map((i: any) => i.service_name || `Servicio ${i.service_id}`) || [],
            price: c.total_price,
            description: c.description || '',
            image: c.image_url?.startsWith('/uploads/') ? c.image_url : undefined,
            createdAt: new Date(c.created_at).getTime()
        }));
    },

    async createCombo(combo: Partial<CustomCombo>): Promise<CustomCombo> {
        // Primero, obtener todos los servicios del backend para mapear IDs locales a IDs numéricos
        const servicesResponse = await fetch(`${API_BASE_URL}/services`);
        const backendServices = await handleResponse<any[]>(servicesResponse);

        // Validar que la respuesta no sea nula
        if (!backendServices || !Array.isArray(backendServices)) {
            throw new Error('No se pudieron obtener los servicios del backend. Asegúrate de sincronizar los servicios primero.');
        }

        // Crear un mapa de nombre de servicio -> ID numérico del backend
        const serviceNameToId = new Map<string, number>();
        backendServices.forEach(s => {
            if (s && s.name && s.id) {
                serviceNameToId.set(s.name.toLowerCase(), s.id);
            }
        });

        // Mapear los IDs locales (strings) a IDs numéricos del backend
        const items = (combo.services || []).map(serviceId => {
            // Si ya es un ID numérico, usarlo directamente
            if (/^\d+$/.test(serviceId)) {
                return { service_id: parseInt(serviceId) };
            }

            // Mapear nombres de servicios locales a nombres del backend
            const serviceNameMap: Record<string, string> = {
                'corte-cabello': 'corte de cabello',
                'diseno-barba': 'diseño de barba',
                'diseno-barba-pequena': 'diseño de barba pequeña',
                'afeitado-cabeza': 'afeitado de cabeza',
                'afeitado-barba': 'afeitado de barba',
                'contornos': 'contornos',
                'cejas': 'cejas',
                'lineas': 'líneas'
            };

            const backendName = serviceNameMap[serviceId] || serviceId.replace(/-/g, ' ');
            const backendId = serviceNameToId.get(backendName.toLowerCase());

            if (backendId) {
                return { service_id: backendId };
            }

            // Si no encontramos el ID, lanzar error descriptivo
            throw new Error(`No se encontró el servicio "${serviceId}" en el backend. Asegúrate de sincronizar los servicios primero.`);
        });

        const body = {
            name: combo.name,
            description: combo.description,
            total_price: combo.price,
            image_url: combo.image,
            items
        };

        const data = await handleResponse<any>(await fetch(`${API_BASE_URL}/combos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
            body: JSON.stringify(body)
        }));

        return {
            id: data.id.toString(),
            name: data.name,
            services: combo.services || [],
            price: data.total_price,
            description: data.description || '',
            createdAt: new Date(data.created_at).getTime()
        };
    },

    async updateCombo(combo: CustomCombo): Promise<CustomCombo> {
        // Reutilizar lógica de mapeo de servicios
        const servicesResponse = await fetch(`${API_BASE_URL}/services`);
        const backendServices = await handleResponse<any[]>(servicesResponse);
        const serviceNameToId = new Map<string, number>();
        if (backendServices && Array.isArray(backendServices)) {
            backendServices.forEach(s => {
                if (s && s.name && s.id) serviceNameToId.set(s.name.toLowerCase(), s.id);
            });
        }

        const items = (combo.services || []).map(serviceId => {
            if (/^\d+$/.test(serviceId)) return { service_id: parseInt(serviceId) };
            const serviceNameMap: Record<string, string> = {
                'corte-cabello': 'corte de cabello', 'diseno-barba': 'diseño de barba',
                'diseno-barba-pequena': 'diseño de barba pequeña', 'afeitado-cabeza': 'afeitado de cabeza',
                'afeitado-barba': 'afeitado de barba', 'contornos': 'contornos', 'cejas': 'cejas', 'lineas': 'líneas'
            };
            const backendName = serviceNameMap[serviceId] || serviceId.replace(/-/g, ' ');
            const backendId = serviceNameToId.get(backendName.toLowerCase());
            if (backendId) return { service_id: backendId };
            throw new Error(`Servicio no encontrado para actualizar: ${serviceId}`);
        });

        const body = {
            name: combo.name,
            description: combo.description,
            total_price: combo.price,
            image_url: combo.image,
            items
        };

        const data = await handleResponse<any>(await fetch(`${API_BASE_URL}/combos/${combo.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
            body: JSON.stringify(body)
        }));

        return {
            id: data.id.toString(),
            name: data.name,
            services: combo.services || [],
            price: data.total_price,
            description: data.description || '',
            createdAt: new Date(data.created_at).getTime()
        };
    },

    async deleteCombo(id: string): Promise<void> {
        await handleResponse(await fetch(`${API_BASE_URL}/combos/${id}`, {
            method: 'DELETE',
            headers: { ...authHeaders() }
        }));
    },

    // Upload
    async uploadImage(file: File, oldImageUrl?: string): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);
        if (oldImageUrl) {
            formData.append('old_image_url', oldImageUrl);
        }
        const data = await handleResponse<{ url: string }>(await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            headers: { ...authHeaders() },
            body: formData
        }));
        return data.url;
    },

    // Health
    async ping(): Promise<boolean> {
        try {
            const data = await handleResponse<any>(await fetch(`${API_BASE_URL}/ping`));
            return data.message === 'pong';
        } catch {
            return false;
        }
    }
};
