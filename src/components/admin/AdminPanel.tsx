import { useState, useEffect } from 'react';
import type { Service } from '../../data/services';
import type { Product } from '../../data/products';

// Importar datos iniciales
import { principalServices, comboServices, sinCitaServices } from '../../data/services';
import { products } from '../../data/products';

export default function AdminPanel() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');
	const [services, setServices] = useState<Service[]>([]);
	const [productsData, setProductsData] = useState<Product[]>([]);
	const [editingService, setEditingService] = useState<Service | null>(null);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);

	useEffect(() => {
		// Verificar autenticación
		const auth = localStorage.getItem('admin_authenticated');
		if (auth !== 'true') {
			window.location.href = '/admin/login';
			return;
		}
		setIsAuthenticated(true);

		// Cargar datos desde localStorage o usar datos iniciales
		const savedServices = localStorage.getItem('admin_services');
		const savedProducts = localStorage.getItem('admin_products');

		if (savedServices) {
			setServices(JSON.parse(savedServices));
		} else {
			const allServices = [...principalServices, ...comboServices, ...sinCitaServices];
			setServices(allServices);
			localStorage.setItem('admin_services', JSON.stringify(allServices));
		}

		if (savedProducts) {
			setProductsData(JSON.parse(savedProducts));
		} else {
			setProductsData(products);
			localStorage.setItem('admin_products', JSON.stringify(products));
		}
	}, []);

	const handleLogout = () => {
		localStorage.removeItem('admin_authenticated');
		window.location.href = '/admin/login';
	};

	const handleSaveService = (updatedService: Service) => {
		const updated = services.map((s) => (s.id === updatedService.id ? updatedService : s));
		setServices(updated);
		localStorage.setItem('admin_services', JSON.stringify(updated));
		setEditingService(null);
	};

	const handleSaveProduct = (updatedProduct: Product) => {
		const updated = productsData.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
		setProductsData(updated);
		localStorage.setItem('admin_products', JSON.stringify(updated));
		setEditingProduct(null);
	};

	const handleDeleteService = (id: string) => {
		if (confirm('¿Estás seguro de eliminar este servicio?')) {
			const updated = services.filter((s) => s.id !== id);
			setServices(updated);
			localStorage.setItem('admin_services', JSON.stringify(updated));
		}
	};

	const handleDeleteProduct = (id: string) => {
		if (confirm('¿Estás seguro de eliminar este producto?')) {
			const updated = productsData.filter((p) => p.id !== id);
			setProductsData(updated);
			localStorage.setItem('admin_products', JSON.stringify(updated));
		}
	};

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="mx-auto max-w-7xl px-6 py-12">
			{/* Header */}
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-black uppercase text-brand-light">Panel de Administración</h1>
					<p className="mt-2 text-sm text-brand-light/60">Gestiona servicios y productos</p>
				</div>
				<button
					onClick={handleLogout}
					className="rounded-full border border-brand-stone/60 bg-brand-night/50 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-light/70 transition-all duration-300 hover:border-red-500/60 hover:bg-red-500/10 hover:text-red-400"
				>
					Cerrar Sesión
				</button>
			</div>

			{/* Tabs */}
			<div className="mb-8 flex gap-2 border-b border-brand-stone/60">
				<button
					onClick={() => setActiveTab('services')}
					className={`px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition-all ${
						activeTab === 'services'
							? 'border-b-2 border-brand-amber text-brand-amber'
							: 'text-brand-light/60 hover:text-brand-light'
					}`}
				>
					Servicios ({services.length})
				</button>
				<button
					onClick={() => setActiveTab('products')}
					className={`px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition-all ${
						activeTab === 'products'
							? 'border-b-2 border-brand-amber text-brand-amber'
							: 'text-brand-light/60 hover:text-brand-light'
					}`}
				>
					Productos ({productsData.length})
				</button>
			</div>

			{/* Content */}
			{activeTab === 'services' && (
				<div className="space-y-4">
					{services.map((service) => (
						<div
							key={service.id}
							className="rounded-2xl border border-brand-stone/60 bg-brand-night/50 p-6"
						>
							{editingService?.id === service.id ? (
								<ServiceEditForm
									service={editingService}
									onSave={handleSaveService}
									onCancel={() => setEditingService(null)}
								/>
							) : (
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-3">
											<h3 className="text-xl font-bold text-brand-light">{service.name}</h3>
											<span className="rounded-full bg-brand-amber/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-brand-amber">
												{service.category}
											</span>
										</div>
										<p className="mt-2 text-sm text-brand-light/70">{service.summary}</p>
										<div className="mt-4 flex gap-6 text-sm text-brand-light/60">
											<span>Duración: {service.duration}</span>
											<span>Precio: {service.price}</span>
										</div>
										<ul className="mt-3 space-y-1 text-sm text-brand-light/50">
											{service.features.map((feature, idx) => (
												<li key={idx}>• {feature}</li>
											))}
										</ul>
									</div>
									<div className="ml-4 flex gap-2">
										<button
											onClick={() => setEditingService(service)}
											className="rounded-lg border border-brand-amber/60 bg-brand-amber/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-brand-amber transition hover:bg-brand-amber/20"
										>
											Editar
										</button>
										<button
											onClick={() => handleDeleteService(service.id)}
											className="rounded-lg border border-red-500/60 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-red-400 transition hover:bg-red-500/20"
										>
											Eliminar
										</button>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			)}

			{activeTab === 'products' && (
				<div className="space-y-4">
					{productsData.map((product) => (
						<div
							key={product.id}
							className="rounded-2xl border border-brand-stone/60 bg-brand-night/50 p-6"
						>
							{editingProduct?.id === product.id ? (
								<ProductEditForm
									product={editingProduct}
									onSave={handleSaveProduct}
									onCancel={() => setEditingProduct(null)}
								/>
							) : (
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-3">
											<h3 className="text-xl font-bold text-brand-light">{product.name}</h3>
											<span className="rounded-full bg-brand-amber/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-brand-amber">
												{product.category}
											</span>
										</div>
										<p className="mt-2 text-sm text-brand-light/70">{product.description}</p>
										<div className="mt-4 flex gap-6 text-sm">
											<span className="text-brand-amber font-bold">
												{new Intl.NumberFormat('es-CO', {
													style: 'currency',
													currency: 'COP',
													maximumFractionDigits: 0,
												}).format(product.price)}
											</span>
											{product.image && (
												<span className="text-brand-light/50">Imagen: {product.image}</span>
											)}
										</div>
									</div>
									<div className="ml-4 flex gap-2">
										<button
											onClick={() => setEditingProduct(product)}
											className="rounded-lg border border-brand-amber/60 bg-brand-amber/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-brand-amber transition hover:bg-brand-amber/20"
										>
											Editar
										</button>
										<button
											onClick={() => handleDeleteProduct(product.id)}
											className="rounded-lg border border-red-500/60 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-red-400 transition hover:bg-red-500/20"
										>
											Eliminar
										</button>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function ServiceEditForm({
	service,
	onSave,
	onCancel,
}: {
	service: Service;
	onSave: (service: Service) => void;
	onCancel: () => void;
}) {
	const [formData, setFormData] = useState(service);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid gap-4 md:grid-cols-2">
				<div>
					<label className="mb-1 block text-xs uppercase tracking-[0.1em] text-brand-light/80">
						Nombre
					</label>
					<input
						type="text"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						className="w-full rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-4 py-2 text-brand-light focus:border-brand-amber focus:outline-none"
						required
					/>
				</div>
				<div>
					<label className="mb-1 block text-xs uppercase tracking-[0.1em] text-brand-light/80">
						Duración
					</label>
					<input
						type="text"
						value={formData.duration}
						onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
						className="w-full rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-4 py-2 text-brand-light focus:border-brand-amber focus:outline-none"
						required
					/>
				</div>
			</div>

			<div>
				<label className="mb-1 block text-xs uppercase tracking-[0.1em] text-brand-light/80">
					Resumen
				</label>
				<textarea
					value={formData.summary}
					onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
					className="w-full rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-4 py-2 text-brand-light focus:border-brand-amber focus:outline-none"
					rows={3}
					required
				/>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<div>
					<label className="mb-1 block text-xs uppercase tracking-[0.1em] text-brand-light/80">
						Precio (texto)
					</label>
					<input
						type="text"
						value={formData.price}
						onChange={(e) => setFormData({ ...formData, price: e.target.value })}
						className="w-full rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-4 py-2 text-brand-light focus:border-brand-amber focus:outline-none"
						required
					/>
				</div>
				<div>
					<label className="mb-1 block text-xs uppercase tracking-[0.1em] text-brand-light/80">
						Precio (número)
					</label>
					<input
						type="number"
						value={formData.priceNumber}
						onChange={(e) =>
							setFormData({ ...formData, priceNumber: Number(e.target.value) })
						}
						className="w-full rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-4 py-2 text-brand-light focus:border-brand-amber focus:outline-none"
						required
					/>
				</div>
			</div>

			<div>
				<label className="mb-1 block text-xs uppercase tracking-[0.1em] text-brand-light/80">
					Características (una por línea)
				</label>
				<textarea
					value={formData.features.join('\n')}
					onChange={(e) =>
						setFormData({
							...formData,
							features: e.target.value.split('\n').filter((f) => f.trim()),
						})
					}
					className="w-full rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-4 py-2 text-brand-light focus:border-brand-amber focus:outline-none"
					rows={4}
					required
				/>
			</div>

			<div className="flex gap-3">
				<button
					type="submit"
					className="rounded-lg border border-brand-amber bg-brand-amber px-6 py-2 text-sm font-semibold uppercase tracking-[0.1em] text-brand-ink transition hover:bg-brand-amber/90"
				>
					Guardar
				</button>
				<button
					type="button"
					onClick={onCancel}
					className="rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-6 py-2 text-sm font-semibold uppercase tracking-[0.1em] text-brand-light transition hover:bg-brand-ink/70"
				>
					Cancelar
				</button>
			</div>
		</form>
	);
}

function ProductEditForm({
	product,
	onSave,
	onCancel,
}: {
	product: Product;
	onSave: (product: Product) => void;
	onCancel: () => void;
}) {
	const [formData, setFormData] = useState(product);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid gap-4 md:grid-cols-2">
				<div>
					<label className="mb-1 block text-xs uppercase tracking-[0.1em] text-brand-light/80">
						Nombre
					</label>
					<input
						type="text"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						className="w-full rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-4 py-2 text-brand-light focus:border-brand-amber focus:outline-none"
						required
					/>
				</div>
				<div>
					<label className="mb-1 block text-xs uppercase tracking-[0.1em] text-brand-light/80">
						Categoría
					</label>
					<select
						value={formData.category}
						onChange={(e) =>
							setFormData({
								...formData,
								category: e.target.value as Product['category'],
							})
						}
						className="w-full rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-4 py-2 text-brand-light focus:border-brand-amber focus:outline-none"
						required
					>
						<option value="cuidado">Cuidado</option>
						<option value="styling">Styling</option>
						<option value="herramientas">Herramientas</option>
						<option value="maquinaria">Maquinaria</option>
					</select>
				</div>
			</div>

			<div>
				<label className="mb-1 block text-xs uppercase tracking-[0.1em] text-brand-light/80">
					Descripción
				</label>
				<textarea
					value={formData.description}
					onChange={(e) => setFormData({ ...formData, description: e.target.value })}
					className="w-full rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-4 py-2 text-brand-light focus:border-brand-amber focus:outline-none"
					rows={3}
					required
				/>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<div>
					<label className="mb-1 block text-xs uppercase tracking-[0.1em] text-brand-light/80">
						Precio
					</label>
					<input
						type="number"
						value={formData.price}
						onChange={(e) =>
							setFormData({ ...formData, price: Number(e.target.value) })
						}
						className="w-full rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-4 py-2 text-brand-light focus:border-brand-amber focus:outline-none"
						required
					/>
				</div>
				<div>
					<label className="mb-1 block text-xs uppercase tracking-[0.1em] text-brand-light/80">
						Imagen (ruta)
					</label>
					<input
						type="text"
						value={formData.image || ''}
						onChange={(e) => setFormData({ ...formData, image: e.target.value })}
						className="w-full rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-4 py-2 text-brand-light focus:border-brand-amber focus:outline-none"
						placeholder="/media/tienda/..."
					/>
				</div>
			</div>

			<div className="flex gap-3">
				<button
					type="submit"
					className="rounded-lg border border-brand-amber bg-brand-amber px-6 py-2 text-sm font-semibold uppercase tracking-[0.1em] text-brand-ink transition hover:bg-brand-amber/90"
				>
					Guardar
				</button>
				<button
					type="button"
					onClick={onCancel}
					className="rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-6 py-2 text-sm font-semibold uppercase tracking-[0.1em] text-brand-light transition hover:bg-brand-ink/70"
				>
					Cancelar
				</button>
			</div>
		</form>
	);
}

