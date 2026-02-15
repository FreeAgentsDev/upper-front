import { useState, useEffect } from 'react';
import StoreFront from './StoreFront';
import type { Product } from '../../data/products';
import { products as initialProducts } from '../../data/products';
import { apiService } from '../../services/api';
import { storageService } from '../../services/storage';

export default function StoreFrontWrapper() {
	const [products, setProducts] = useState<Product[]>(initialProducts);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			try {
				const fetched = await apiService.getProducts();
				setProducts(fetched);
				storageService.saveProducts(fetched);
			} catch {
				const cached = storageService.getProducts(initialProducts);
				setProducts(cached);
			} finally {
				setLoading(false);
			}
		};
		loadData();

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
