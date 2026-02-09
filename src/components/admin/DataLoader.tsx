// Force rebuild
import { useEffect, useState } from 'react';
import type { Service } from '../../data/services';
import type { Product } from '../../data/products';
import { principalServices, sinCitaServices } from '../../data/services';
import { comboServices } from '../../data/combos';
import { products as defaultProducts } from '../../data/products';
import { apiService } from '../../services/api';

export function useServices() {
	const [services, setServices] = useState<Service[]>(() => [...principalServices, ...comboServices, ...sinCitaServices]);

	useEffect(() => {
		const load = async () => {
			try {
				const data = await apiService.getServices();
				if (data.length > 0) setServices(data);
			} catch (error) {
				console.error('Error loading services in DataLoader:', error);
			}
		};
		load();
	}, []);

	return services;
}

export function useProducts() {
	const [products, setProducts] = useState<Product[]>(defaultProducts);

	useEffect(() => {
		const load = async () => {
			try {
				const data = await apiService.getProducts();
				if (data && data.length > 0) {
					setProducts(data);
				}
			} catch (error) {
				console.error('Error loading products in DataLoader:', error);
			}
		};
		load();
	}, []);

	return products;
}



