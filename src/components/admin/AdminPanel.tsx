import { useState, useEffect } from 'react';
import type { Service } from '../../data/services';
import type { Product } from '../../data/products';
import type { CustomCombo } from '../../data/combos';
import { getCustomCombos, saveCustomCombo, deleteCustomCombo, COMBO_STORAGE_KEY } from '../../data/combos';

// Importar datos iniciales
import { principalServices, comboServices, sinCitaServices } from '../../data/services';
import { products } from '../../data/products';

export default function AdminPanel() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [activeTab, setActiveTab] = useState<'services' | 'products' | 'combos'>('services');
	const [services, setServices] = useState<Service[]>([]);
	const [productsData, setProductsData] = useState<Product[]>([]);
	const [combos, setCombos] = useState<CustomCombo[]>([]);
	const [editingService, setEditingService] = useState<Service | null>(null);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [editingCombo, setEditingCombo] = useState<CustomCombo | null>(null);
	const [isCreatingService, setIsCreatingService] = useState(false);
	const [isCreatingProduct, setIsCreatingProduct] = useState(false);
	const [isCreatingCombo, setIsCreatingCombo] = useState(false);

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
		const savedCombos = localStorage.getItem(COMBO_STORAGE_KEY);

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

		if (savedCombos) {
			setCombos(JSON.parse(savedCombos));
		} else {
			setCombos([]);
		}
	}, []);

	const handleLogout = () => {
		localStorage.removeItem('admin_authenticated');
		window.location.href = '/admin/login';
	};

	// Servicios
	const handleSaveService = (updatedService: Service, isNew: boolean = false) => {
		let updated;
		if (isNew) {
			updated = [...services, updatedService];
		} else {
			updated = services.map((s) => (s.id === updatedService.id ? updatedService : s));
		}
		setServices(updated);
		localStorage.setItem('admin_services', JSON.stringify(updated));
		setEditingService(null);
		setIsCreatingService(false);
	};

	const handleDeleteService = (id: string) => {
		if (confirm('¿Estás seguro de eliminar este servicio?')) {
			const updated = services.filter((s) => s.id !== id);
			setServices(updated);
			localStorage.setItem('admin_services', JSON.stringify(updated));
		}
	};

	const handleCreateService = () => {
		const newService: Service = {
			id: `service-${Date.now()}`,
			name: '',
			summary: '',
			duration: '',
			price: '',
			priceNumber: 0,
			features: [],
			category: 'principal',
		};
		setEditingService(newService);
		setIsCreatingService(true);
	};

	// Productos
	const handleSaveProduct = (updatedProduct: Product, isNew: boolean = false) => {
		let updated;
		if (isNew) {
			updated = [...productsData, updatedProduct];
		} else {
			updated = productsData.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
		}
		setProductsData(updated);
		localStorage.setItem('admin_products', JSON.stringify(updated));
		setEditingProduct(null);
		setIsCreatingProduct(false);
	};

	const handleDeleteProduct = (id: string) => {
		if (confirm('¿Estás seguro de eliminar este producto?')) {
			const updated = productsData.filter((p) => p.id !== id);
			setProductsData(updated);
			localStorage.setItem('admin_products', JSON.stringify(updated));
		}
	};

	const handleCreateProduct = () => {
		const newProduct: Product = {
			id: `product-${Date.now()}`,
			name: '',
			description: '',
			price: 0,
			category: 'cuidado',
			image: '',
		};
		setEditingProduct(newProduct);
		setIsCreatingProduct(true);
	};

	// Combos
	const handleSaveCombo = (updatedCombo: CustomCombo, isNew: boolean = false) => {
		if (isNew) {
			saveCustomCombo(updatedCombo);
			setCombos([...combos, updatedCombo]);
		} else {
			const updated = combos.map((c) => (c.id === updatedCombo.id ? updatedCombo : c));
			setCombos(updated);
			localStorage.setItem(COMBO_STORAGE_KEY, JSON.stringify(updated));
		}
		setEditingCombo(null);
		setIsCreatingCombo(false);
	};

	const handleDeleteCombo = (id: string) => {
		if (confirm('¿Estás seguro de eliminar este combo?')) {
			deleteCustomCombo(id);
			setCombos(combos.filter((c) => c.id !== id));
		}
	};

	const handleCreateCombo = () => {
		const newCombo: CustomCombo = {
			id: `combo-${Date.now()}`,
			name: '',
			description: '',
			services: [],
			price: 0,
			createdAt: Date.now(),
		};
		setEditingCombo(newCombo);
		setIsCreatingCombo(true);
	};

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-12">
			{/* Header */}
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-brand-light">Panel de Administración</h1>
					<p className="mt-2 text-xs sm:text-sm text-brand-light/60">Gestiona servicios, productos y combos</p>
				</div>
				<button
					onClick={handleLogout}
					className="w-full sm:w-auto rounded-full border border-brand-stone/60 bg-brand-night/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-light/70 transition-all duration-300 hover:border-red-500/60 hover:bg-red-500/10 hover:text-red-400"
				>
					Cerrar Sesión
				</button>
			</div>

			{/* Tabs */}
			<div className="mb-6 flex flex-wrap gap-2 border-b border-brand-stone/60 overflow-x-auto">
				<button
					onClick={() => setActiveTab('services')}
					className={`flex-shrink-0 px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all ${
						activeTab === 'services'
							? 'border-b-2 border-brand-amber text-brand-amber'
							: 'text-brand-light/60 hover:text-brand-light'
					}`}
				>
					Servicios ({services.length})
				</button>
				<button
					onClick={() => setActiveTab('products')}
					className={`flex-shrink-0 px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all ${
						activeTab === 'products'
							? 'border-b-2 border-brand-amber text-brand-amber'
							: 'text-brand-light/60 hover:text-brand-light'
					}`}
				>
					Productos ({productsData.length})
				</button>
				<button
					onClick={() => setActiveTab('combos')}
					className={`flex-shrink-0 px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all ${
						activeTab === 'combos'
							? 'border-b-2 border-brand-amber text-brand-amber'
							: 'text-brand-light/60 hover:text-brand-light'
					}`}
				>
					Combos ({combos.length})
				</button>
			</div>

			{/* Content - Servicios */}
			{activeTab === 'services' && (
				<div className="space-y-4">
					<div className="mb-4 flex justify-end">
						<button
							onClick={handleCreateService}
							className="w-full sm:w-auto rounded-lg border border-brand-amber bg-brand-amber px-4 py-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.1em] text-brand-ink transition hover:bg-brand-amber/90"
						>
							+ Nuevo Servicio
						</button>
					</div>
					{services.map((service) => (
						<div
							key={service.id}
							className="rounded-2xl border border-brand-stone/60 bg-brand-night/50 p-4 sm:p-6"
						>
							{editingService?.id === service.id ? (
								<ServiceEditForm
									service={editingService}
									onSave={handleSaveService}
									onCancel={() => {
										setEditingService(null);
										setIsCreatingService(false);
									}}
									isNew={isCreatingService}
								/>
							) : (
								<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
									<div className="flex-1 min-w-0">
										<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
											<h3 className="text-lg sm:text-xl font-bold text-brand-light break-words">{service.name}</h3>
											<span className="w-fit rounded-full bg-brand-amber/20 px-2 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.1em] text-brand-amber">
												{service.category}
											</span>
										</div>
										<p className="mt-2 text-xs sm:text-sm text-brand-light/70">{service.summary}</p>
										<div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-6 text-xs sm:text-sm text-brand-light/60">
											<span>Duración: {service.duration}</span>
											<span>Precio: {service.price}</span>
										</div>
										<ul className="mt-3 space-y-1 text-xs sm:text-sm text-brand-light/50">
											{service.features.map((feature, idx) => (
												<li key={idx}>• {feature}</li>
											))}
										</ul>
									</div>
									<div className="flex gap-2 sm:ml-4 sm:flex-col">
										<button
											onClick={() => setEditingService(service)}
											className="flex-1 sm:flex-none rounded-lg border border-brand-amber/60 bg-brand-amber/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-brand-amber transition hover:bg-brand-amber/20"
										>
											Editar
										</button>
										<button
											onClick={() => handleDeleteService(service.id)}
											className="flex-1 sm:flex-none rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-red-400 transition hover:bg-red-500/20"
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

			{/* Content - Productos */}
			{activeTab === 'products' && (
				<div className="space-y-4">
					<div className="mb-4 flex justify-end">
						<button
							onClick={handleCreateProduct}
							className="w-full sm:w-auto rounded-lg border border-brand-amber bg-brand-amber px-4 py-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.1em] text-brand-ink transition hover:bg-brand-amber/90"
						>
							+ Nuevo Producto
						</button>
					</div>
					{productsData.map((product) => (
						<div
							key={product.id}
							className="rounded-2xl border border-brand-stone/60 bg-brand-night/50 p-4 sm:p-6"
						>
							{editingProduct?.id === product.id ? (
								<ProductEditForm
									product={editingProduct}
									onSave={handleSaveProduct}
									onCancel={() => {
										setEditingProduct(null);
										setIsCreatingProduct(false);
									}}
									isNew={isCreatingProduct}
								/>
							) : (
								<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
									<div className="flex-1 min-w-0">
										{product.image && (
											<img
												src={product.image.startsWith('data:') ? product.image : product.image}
												alt={product.name}
												className="mb-4 h-24 w-24 sm:h-32 sm:w-32 rounded-lg object-cover border border-brand-stone/60"
												onError={(e) => {
													(e.target as HTMLImageElement).style.display = 'none';
												}}
											/>
										)}
										<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
											<h3 className="text-lg sm:text-xl font-bold text-brand-light break-words">{product.name}</h3>
											<span className="w-fit rounded-full bg-brand-amber/20 px-2 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.1em] text-brand-amber">
												{product.category}
											</span>
										</div>
										<p className="mt-2 text-xs sm:text-sm text-brand-light/70">{product.description}</p>
										<div className="mt-3 sm:mt-4 flex flex-col gap-2 sm:flex-row sm:gap-6 text-xs sm:text-sm">
											<span className="text-brand-amber font-bold">
												{new Intl.NumberFormat('es-CO', {
													style: 'currency',
													currency: 'COP',
													maximumFractionDigits: 0,
												}).format(product.price)}
											</span>
											{product.image && !product.image.startsWith('data:') && (
												<span className="text-brand-light/50 text-xs break-all">Imagen: {product.image}</span>
											)}
										</div>
									</div>
									<div className="flex gap-2 sm:ml-4 sm:flex-col">
										<button
											onClick={() => setEditingProduct(product)}
											className="flex-1 sm:flex-none rounded-lg border border-brand-amber/60 bg-brand-amber/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-brand-amber transition hover:bg-brand-amber/20"
										>
											Editar
										</button>
										<button
											onClick={() => handleDeleteProduct(product.id)}
											className="flex-1 sm:flex-none rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-red-400 transition hover:bg-red-500/20"
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

			{/* Content - Combos */}
			{activeTab === 'combos' && (
				<div className="space-y-4">
					<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
						<h3 className="text-base sm:text-lg font-bold text-brand-light">Combos de Servicios (categoría combo)</h3>
						<button
							onClick={handleCreateCombo}
							className="w-full sm:w-auto rounded-lg border border-brand-amber bg-brand-amber px-4 py-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.1em] text-brand-ink transition hover:bg-brand-amber/90"
						>
							+ Nuevo Combo Personalizado
						</button>
					</div>
					
					{/* Combos de servicios (de comboServices) */}
					{services.filter((s) => s.category === 'combo').map((service) => (
						<div
							key={service.id}
							className="group rounded-2xl border-2 border-brand-stone/60 bg-gradient-to-br from-brand-night/80 to-brand-ink/60 p-4 sm:p-6 shadow-lg transition-all duration-300 hover:border-brand-amber/60 hover:shadow-xl hover:shadow-brand-amber/10"
						>
							{editingService?.id === service.id ? (
								<ServiceEditForm
									service={editingService}
									onSave={handleSaveService}
									onCancel={() => {
										setEditingService(null);
										setIsCreatingService(false);
									}}
									isNew={false}
								/>
							) : (
								<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
									<div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
										{/* Header con nombre y badge */}
										<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
											<div className="flex-1 min-w-0">
												<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 mb-2">
													<h3 className="text-xl sm:text-2xl font-black text-brand-light break-words">{service.name}</h3>
													<span className="w-fit rounded-full bg-brand-amber/20 border border-brand-amber/40 px-2 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em] text-brand-amber">
														Combo de Servicio
													</span>
												</div>
												<p className="text-sm sm:text-base text-brand-light/80 leading-relaxed">{service.summary}</p>
											</div>
										</div>

										{/* Información destacada */}
										<div className="grid grid-cols-2 gap-3 sm:gap-4">
											<div className="rounded-xl border border-brand-stone/40 bg-brand-ink/30 p-3 sm:p-4">
												<p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-brand-light/60 mb-1">Duración</p>
												<p className="text-base sm:text-lg font-bold text-brand-amber">{service.duration}</p>
											</div>
											<div className="rounded-xl border border-brand-stone/40 bg-brand-ink/30 p-3 sm:p-4">
												<p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-brand-light/60 mb-1">Precio</p>
												<p className="text-base sm:text-lg font-black text-brand-amber break-words">{service.price}</p>
											</div>
										</div>

										{/* Características */}
										<div className="rounded-xl border border-brand-stone/40 bg-brand-ink/20 p-3 sm:p-4">
											<p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-brand-light/70 mb-2 sm:mb-3 font-semibold">Características incluidas:</p>
											<ul className="space-y-1.5 sm:space-y-2">
												{service.features.map((feature, idx) => (
													<li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-brand-light/80">
														<svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-amber flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
															<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
														</svg>
														<span className="break-words">{feature}</span>
													</li>
												))}
											</ul>
										</div>
									</div>
									
									{/* Botones de acción */}
									<div className="flex gap-2 sm:flex-col">
										<button
											onClick={() => setEditingService(service)}
											className="flex-1 sm:flex-none rounded-lg border-2 border-brand-amber/70 bg-brand-amber/10 px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em] text-brand-amber transition-all duration-300 hover:bg-brand-amber hover:text-brand-ink"
										>
											Editar
										</button>
										<button
											onClick={() => handleDeleteService(service.id)}
											className="flex-1 sm:flex-none rounded-lg border-2 border-red-500/70 bg-red-500/10 px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em] text-red-400 transition-all duration-300 hover:bg-red-500 hover:text-white"
										>
											Eliminar
										</button>
									</div>
								</div>
							)}
						</div>
					))}

					{/* Separador */}
					{services.filter((s) => s.category === 'combo').length > 0 && combos.length > 0 && (
						<div className="my-8 border-t border-brand-stone/60">
							<div className="mt-8">
								<h3 className="text-lg font-bold text-brand-light mb-6">Combos Personalizados</h3>
							</div>
						</div>
					)}

					{/* Combos personalizados */}
					{combos.map((combo) => (
						<div
							key={combo.id}
							className="group rounded-2xl border-2 border-brand-stone/60 bg-gradient-to-br from-brand-night/80 via-purple-900/10 to-brand-ink/60 p-4 sm:p-6 shadow-lg transition-all duration-300 hover:border-purple-500/60 hover:shadow-xl hover:shadow-purple-500/10"
						>
							{editingCombo?.id === combo.id ? (
								<ComboEditForm
									combo={editingCombo}
									services={services}
									onSave={handleSaveCombo}
									onCancel={() => {
										setEditingCombo(null);
										setIsCreatingCombo(false);
									}}
									isNew={isCreatingCombo}
								/>
							) : (
								<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
									<div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
										{/* Header con nombre y badge */}
										<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
											<div className="flex-1 min-w-0">
												<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 mb-2">
													<h3 className="text-xl sm:text-2xl font-black text-brand-light break-words">{combo.name}</h3>
													<span className="w-fit rounded-full bg-purple-500/20 border border-purple-500/40 px-2 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em] text-purple-400">
														Combo Personalizado
													</span>
												</div>
												{combo.description && (
													<p className="text-sm sm:text-base text-brand-light/80 leading-relaxed">{combo.description}</p>
												)}
											</div>
										</div>

										{/* Precio destacado */}
										<div className="rounded-xl border border-brand-stone/40 bg-brand-ink/30 p-3 sm:p-4">
											<p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-brand-light/60 mb-1">Precio Total</p>
											<p className="text-xl sm:text-2xl font-black text-brand-amber break-words">
												{new Intl.NumberFormat('es-CO', {
													style: 'currency',
													currency: 'COP',
													maximumFractionDigits: 0,
												}).format(combo.price)}
											</p>
										</div>

										{/* Servicios incluidos */}
										<div className="rounded-xl border border-brand-stone/40 bg-brand-ink/20 p-3 sm:p-4">
											<p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-brand-light/70 mb-2 sm:mb-3 font-semibold">Servicios incluidos ({combo.services.length}):</p>
											<ul className="space-y-1.5 sm:space-y-2">
												{combo.services.map((serviceName, idx) => (
													<li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-brand-light/80">
														<svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
															<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
														</svg>
														<span className="break-words">{serviceName}</span>
													</li>
												))}
											</ul>
										</div>
									</div>
									
									{/* Botones de acción */}
									<div className="flex gap-2 sm:flex-col">
										<button
											onClick={() => setEditingCombo(combo)}
											className="flex-1 sm:flex-none rounded-lg border-2 border-purple-500/70 bg-purple-500/10 px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em] text-purple-400 transition-all duration-300 hover:bg-purple-500 hover:text-white"
										>
											Editar
										</button>
										<button
											onClick={() => handleDeleteCombo(combo.id)}
											className="flex-1 sm:flex-none rounded-lg border-2 border-red-500/70 bg-red-500/10 px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em] text-red-400 transition-all duration-300 hover:bg-red-500 hover:text-white"
										>
											Eliminar
										</button>
									</div>
								</div>
							)}
						</div>
					))}
					{services.filter((s) => s.category === 'combo').length === 0 && combos.length === 0 && (
						<div className="rounded-2xl border-2 border-dashed border-brand-stone/40 bg-brand-night/30 p-12 text-center">
							<div className="mb-4">
								<svg className="mx-auto h-16 w-16 text-brand-light/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
								</svg>
							</div>
							<p className="text-lg font-semibold text-brand-light/80 mb-2">No hay combos disponibles</p>
							<p className="text-sm text-brand-light/60 mb-6">Crea un combo personalizado o agrega servicios con categoría "combo" desde el tab de Servicios.</p>
						</div>
					)}

					{/* Botón para crear nuevo combo de servicio */}
					<div className="mt-8 rounded-2xl border-2 border-dashed border-brand-stone/40 bg-brand-night/20 p-8 text-center">
						<p className="mb-4 text-sm text-brand-light/60">
							¿Quieres crear un nuevo combo de servicio? Puedes crear un servicio con categoría "combo" desde el tab de Servicios.
						</p>
						<button
							onClick={() => {
								setActiveTab('services');
								handleCreateService();
							}}
							className="rounded-lg border border-brand-amber/60 bg-brand-amber/10 px-6 py-2 text-sm font-semibold uppercase tracking-[0.1em] text-brand-amber transition hover:bg-brand-amber/20"
						>
							Ir a Servicios para crear combo
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

// Componente para subir imágenes
function ImageUploader({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) {
	const [preview, setPreview] = useState<string>(value || '');

	useEffect(() => {
		setPreview(value);
	}, [value]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const base64String = reader.result as string;
				setPreview(base64String);
				onChange(base64String);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="space-y-2">
			{preview && (
				<div className="mb-3 sm:mb-4">
					<img
						src={preview.startsWith('data:') || preview.startsWith('/') ? preview : `/media/${preview}`}
						alt="Preview"
						className="h-24 w-24 sm:h-32 sm:w-32 rounded-lg object-cover border border-brand-stone/60"
						onError={(e) => {
							(e.target as HTMLImageElement).style.display = 'none';
						}}
					/>
				</div>
			)}
			<label className="mb-1 block text-xs uppercase tracking-[0.1em] text-brand-light/80">
				Imagen (ruta o subir archivo)
			</label>
			<input
				type="text"
				value={value && !value.startsWith('data:') ? value : ''}
				onChange={(e) => {
					if (!e.target.value.startsWith('data:')) {
						setPreview(e.target.value);
						onChange(e.target.value);
					}
				}}
				placeholder="/media/tienda/..."
				className="mb-2 w-full rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-3 py-2 sm:px-4 text-sm sm:text-base text-brand-light focus:border-brand-amber focus:outline-none"
			/>
			<input
				type="file"
				accept="image/*"
				onChange={handleFileChange}
				className="w-full rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-3 py-2 sm:px-4 text-xs sm:text-sm text-brand-light file:mr-2 sm:file:mr-4 file:rounded-lg file:border-0 file:bg-brand-amber/20 file:px-2 file:py-1.5 sm:file:px-4 sm:file:py-2 file:text-[10px] sm:file:text-xs file:font-semibold file:uppercase file:tracking-[0.1em] file:text-brand-amber hover:file:bg-brand-amber/30"
			/>
			<p className="text-[10px] sm:text-xs text-brand-light/50">
				Sube una imagen o ingresa una ruta. Las imágenes subidas se guardarán como base64.
			</p>
		</div>
	);
}

function ServiceEditForm({
	service,
	onSave,
	onCancel,
	isNew = false,
}: {
	service: Service;
	onSave: (service: Service, isNew: boolean) => void;
	onCancel: () => void;
	isNew?: boolean;
}) {
	const [formData, setFormData] = useState(service);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData, isNew);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
			<div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
				<div>
					<label className="mb-1 block text-xs uppercase tracking-[0.1em] text-brand-light/80">
						Nombre
					</label>
					<input
						type="text"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						className="w-full rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-3 py-2 sm:px-4 text-sm sm:text-base text-brand-light focus:border-brand-amber focus:outline-none"
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
							setFormData({ ...formData, category: e.target.value as Service['category'] })
						}
						className="w-full rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-3 py-2 sm:px-4 text-sm sm:text-base text-brand-light focus:border-brand-amber focus:outline-none"
						required
					>
						<option value="principal">Principal</option>
						<option value="combo">Combo</option>
						<option value="sin-cita">Sin Cita</option>
					</select>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
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
				<div>
					<label className="mb-1 block text-xs uppercase tracking-[0.1em] text-brand-light/80">
						ID (único)
					</label>
					<input
						type="text"
						value={formData.id}
						onChange={(e) => setFormData({ ...formData, id: e.target.value })}
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

			<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
				<button
					type="submit"
					className="w-full sm:w-auto rounded-lg border border-brand-amber bg-brand-amber px-4 py-2 sm:px-6 text-xs sm:text-sm font-semibold uppercase tracking-[0.1em] text-brand-ink transition hover:bg-brand-amber/90"
				>
					{isNew ? 'Crear' : 'Guardar'}
				</button>
				<button
					type="button"
					onClick={onCancel}
					className="w-full sm:w-auto rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-4 py-2 sm:px-6 text-xs sm:text-sm font-semibold uppercase tracking-[0.1em] text-brand-light transition hover:bg-brand-ink/70"
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
	isNew = false,
}: {
	product: Product;
	onSave: (product: Product, isNew: boolean) => void;
	onCancel: () => void;
	isNew?: boolean;
}) {
	const [formData, setFormData] = useState(product);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData, isNew);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
			<div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
				<div>
					<label className="mb-1 block text-xs uppercase tracking-[0.1em] text-brand-light/80">
						Nombre
					</label>
					<input
						type="text"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						className="w-full rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-3 py-2 sm:px-4 text-sm sm:text-base text-brand-light focus:border-brand-amber focus:outline-none"
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
						className="w-full rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-3 py-2 sm:px-4 text-sm sm:text-base text-brand-light focus:border-brand-amber focus:outline-none"
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
					ID (único)
				</label>
				<input
					type="text"
					value={formData.id}
					onChange={(e) => setFormData({ ...formData, id: e.target.value })}
					className="w-full rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-3 py-2 sm:px-4 text-sm sm:text-base text-brand-light focus:border-brand-amber focus:outline-none"
					required
				/>
			</div>

			<div>
				<label className="mb-1 block text-xs uppercase tracking-[0.1em] text-brand-light/80">
					Descripción
				</label>
				<textarea
					value={formData.description}
					onChange={(e) => setFormData({ ...formData, description: e.target.value })}
					className="w-full rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-3 py-2 sm:px-4 text-sm sm:text-base text-brand-light focus:border-brand-amber focus:outline-none"
					rows={3}
					required
				/>
			</div>

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
					className="w-full rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-3 py-2 sm:px-4 text-sm sm:text-base text-brand-light focus:border-brand-amber focus:outline-none"
					required
				/>
			</div>

			<div>
				<ImageUploader
					value={formData.image || ''}
					onChange={(value) => setFormData({ ...formData, image: value })}
				/>
			</div>

			<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
				<button
					type="submit"
					className="w-full sm:w-auto rounded-lg border border-brand-amber bg-brand-amber px-4 py-2 sm:px-6 text-xs sm:text-sm font-semibold uppercase tracking-[0.1em] text-brand-ink transition hover:bg-brand-amber/90"
				>
					{isNew ? 'Crear' : 'Guardar'}
				</button>
				<button
					type="button"
					onClick={onCancel}
					className="w-full sm:w-auto rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-4 py-2 sm:px-6 text-xs sm:text-sm font-semibold uppercase tracking-[0.1em] text-brand-light transition hover:bg-brand-ink/70"
				>
					Cancelar
				</button>
			</div>
		</form>
	);
}

function ComboEditForm({
	combo,
	services,
	onSave,
	onCancel,
	isNew = false,
}: {
	combo: CustomCombo;
	services: Service[];
	onSave: (combo: CustomCombo, isNew: boolean) => void;
	onCancel: () => void;
	isNew?: boolean;
}) {
	const [formData, setFormData] = useState(combo);
	const [selectedService, setSelectedService] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData, isNew);
	};

	const handleAddService = () => {
		if (selectedService && !formData.services.includes(selectedService)) {
			setFormData({
				...formData,
				services: [...formData.services, selectedService],
			});
			setSelectedService('');
		}
	};

	const handleRemoveService = (serviceName: string) => {
		setFormData({
			...formData,
			services: formData.services.filter((s) => s !== serviceName),
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
			<div>
				<label className="mb-1 block text-xs uppercase tracking-[0.1em] text-brand-light/80">
					Nombre del Combo
				</label>
				<input
					type="text"
					value={formData.name}
					onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					className="w-full rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-3 py-2 sm:px-4 text-sm sm:text-base text-brand-light focus:border-brand-amber focus:outline-none"
					required
				/>
			</div>

			<div>
				<label className="mb-1 block text-xs uppercase tracking-[0.1em] text-brand-light/80">
					Descripción
				</label>
				<textarea
					value={formData.description}
					onChange={(e) => setFormData({ ...formData, description: e.target.value })}
					className="w-full rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-3 py-2 sm:px-4 text-sm sm:text-base text-brand-light focus:border-brand-amber focus:outline-none"
					rows={3}
				/>
			</div>

			<div>
				<label className="mb-1 block text-xs uppercase tracking-[0.1em] text-brand-light/80">
					Precio
				</label>
				<input
					type="number"
					value={formData.price}
					onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
					className="w-full rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-3 py-2 sm:px-4 text-sm sm:text-base text-brand-light focus:border-brand-amber focus:outline-none"
					required
				/>
			</div>

			<div>
				<label className="mb-1 block text-xs uppercase tracking-[0.1em] text-brand-light/80">
					Servicios del Combo
				</label>
				<div className="mb-2 flex flex-col sm:flex-row gap-2">
					<select
						value={selectedService}
						onChange={(e) => setSelectedService(e.target.value)}
						className="flex-1 rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-3 py-2 sm:px-4 text-sm sm:text-base text-brand-light focus:border-brand-amber focus:outline-none"
					>
						<option value="">Seleccionar servicio...</option>
						{services.map((service) => (
							<option key={service.id} value={service.name}>
								{service.name} - {service.price}
							</option>
						))}
					</select>
					<button
						type="button"
						onClick={handleAddService}
						className="w-full sm:w-auto rounded-lg border border-brand-amber bg-brand-amber/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-brand-amber transition hover:bg-brand-amber/30"
					>
						Agregar
					</button>
				</div>
				<div className="space-y-2 rounded-lg border border-brand-stone/60 bg-brand-ink/30 p-3">
					{formData.services.length > 0 ? (
						formData.services.map((serviceName, idx) => (
							<div key={idx} className="flex items-center justify-between gap-2 rounded-lg bg-brand-night/50 p-2">
								<span className="text-xs sm:text-sm text-brand-light break-words flex-1">{serviceName}</span>
								<button
									type="button"
									onClick={() => handleRemoveService(serviceName)}
									className="flex-shrink-0 rounded-lg border border-red-500/60 bg-red-500/10 px-2 py-1 text-xs text-red-400 transition hover:bg-red-500/20"
								>
									Eliminar
								</button>
							</div>
						))
					) : (
						<p className="text-xs text-brand-light/50">No hay servicios agregados</p>
					)}
				</div>
			</div>

			<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
				<button
					type="submit"
					className="w-full sm:w-auto rounded-lg border border-brand-amber bg-brand-amber px-4 py-2 sm:px-6 text-xs sm:text-sm font-semibold uppercase tracking-[0.1em] text-brand-ink transition hover:bg-brand-amber/90"
				>
					{isNew ? 'Crear' : 'Guardar'}
				</button>
				<button
					type="button"
					onClick={onCancel}
					className="w-full sm:w-auto rounded-lg border border-brand-stone/60 bg-brand-ink/50 px-4 py-2 sm:px-6 text-xs sm:text-sm font-semibold uppercase tracking-[0.1em] text-brand-light transition hover:bg-brand-ink/70"
				>
					Cancelar
				</button>
			</div>
		</form>
	);
}
