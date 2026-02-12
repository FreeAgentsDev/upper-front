import { useState, useEffect } from 'react';
import StoreFront from './StoreFront';
import type { Product } from '../../data/products';
import { products as initialProducts } from '../../data/products';
import { storageService } from '../../services/storage';

export default function StoreFrontWrapper() {
	const [products, setProducts] = useState<Product[]>(initialProducts);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Cargar productos desde localStorage
		const loadedProducts = storageService.getProducts(initialProducts);
		setProducts(loadedProducts);
		setLoading(false);

		// Escuchar cambios en tiempo real desde el admin
		const handleStorageUpdate = () => {
			const updatedProducts = storageService.getProducts(initialProducts);
			setProducts(updatedProducts);
		};

		window.addEventListener('storage-update', handleStorageUpdate);
		return () => window.removeEventListener('storage-update', handleStorageUpdate);
	}, []);

	if (loading) {
		return <div className="animate-pulse text-center py-12 text-brand-amber">Cargando tienda...</div>;
	}

	return <StoreFront products={products} />;
}



