import { useEffect, useState } from 'react';
import type { Service } from '../../data/services';
import type { Product } from '../../data/products';
import { principalServices, comboServices, sinCitaServices } from '../../data/services';
import { products as defaultProducts } from '../../data/products';

export function useServices() {
	const [services, setServices] = useState<Service[]>(() => {
		if (typeof window === 'undefined') {
			return [...principalServices, ...comboServices, ...sinCitaServices];
		}
		const saved = localStorage.getItem('admin_services');
		return saved ? JSON.parse(saved) : [...principalServices, ...comboServices, ...sinCitaServices];
	});

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const saved = localStorage.getItem('admin_services');
		if (saved) {
			setServices(JSON.parse(saved));
		}
	}, []);

	return services;
}

export function useProducts() {
	const [products, setProducts] = useState<Product[]>(() => {
		if (typeof window === 'undefined') {
			return defaultProducts;
		}
		const saved = localStorage.getItem('admin_products');
		return saved ? JSON.parse(saved) : defaultProducts;
	});

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const saved = localStorage.getItem('admin_products');
		if (saved) {
			setProducts(JSON.parse(saved));
		}
	}, []);

	return products;
}

