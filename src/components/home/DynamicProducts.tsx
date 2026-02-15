import { useState, useEffect } from 'react';
import type { Product } from '../../data/products';
import { products as initialProducts } from '../../data/products';
import { apiService } from '../../services/api';
import { storageService } from '../../services/storage';

export default function DynamicProducts() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			try {
				const fetched = await apiService.getProducts();
				const sliced = fetched.slice(0, 3);
				setProducts(sliced);
				storageService.saveProducts(fetched);
			} catch {
				const cached = storageService.getProducts(initialProducts);
				setProducts(cached.slice(0, 3));
			} finally {
				setLoading(false);
			}
		};
		loadData();

		const handleStorageUpdate = () => {
			const updated = storageService.getProducts(initialProducts);
			setProducts(updated.slice(0, 3));
		};

		window.addEventListener('storage-update', handleStorageUpdate);
		return () => window.removeEventListener('storage-update', handleStorageUpdate);
	}, []);

	if (loading) {
		return (
			<div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{[1, 2, 3].map((i) => (
					<div key={i} className="card-enhanced p-5 sm:p-6 lg:p-7 animate-pulse">
						<div className="aspect-[4/3] bg-brand-stone/30 rounded mb-4"></div>
						<div className="h-6 bg-brand-stone/30 rounded w-2/3 mb-3"></div>
						<div className="h-12 bg-brand-stone/30 rounded mb-4"></div>
						<div className="h-8 bg-brand-stone/30 rounded"></div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{products.map((product, index) => {
				const productImage = product.image || '';

				return (
					<article key={product.id} className="group card-enhanced animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
						{productImage && (
							<div className="relative aspect-[4/3] overflow-hidden bg-brand-ink">
								<img
									src={productImage}
									alt={product.name}
									className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
									loading="lazy"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/40 to-transparent"></div>
								<div className="absolute top-4 right-4">
									<span className="rounded-full border border-brand-amber/60 bg-brand-amber/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-amber backdrop-blur-sm">
										{product.category === 'cuidado' ? '✨ Cuidado' : product.category === 'styling' ? '💇 Styling' : '🔧 Herramientas'}
									</span>
								</div>
							</div>
						)}
						<div className="p-5 sm:p-6 lg:p-7">
							<h3 className="text-lg sm:text-xl font-black text-brand-light leading-tight">{product.name}</h3>
							<p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed text-brand-light/75">{product.description}</p>
							<div className="mt-5 sm:mt-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t-2 border-brand-stone/30 pt-4 sm:pt-6">
								<p className="text-xl sm:text-2xl font-black text-brand-amber">
									{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.price)}
								</p>
								<a
									href="/tienda"
									className="w-full sm:w-auto rounded-full border-2 border-brand-amber/70 bg-brand-amber/10 px-4 py-2 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-brand-amber transition-all duration-300 hover:border-brand-amber hover:bg-brand-amber hover:text-brand-ink hover:scale-105 text-center"
								>
									Ver →
								</a>
							</div>
						</div>
					</article>
				);
			})}
		</div>
	);
}
