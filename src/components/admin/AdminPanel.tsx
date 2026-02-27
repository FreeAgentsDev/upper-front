import { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { getToken, clearToken } from '../../services/api';
import AdminLayout from './layout/AdminLayout';
import ServiceEditor from './editors/ServiceEditor';
import ProductEditor from './editors/ProductEditor';
import ComboEditor from './editors/ComboEditor';

export default function AdminPanel() {
	// 0. Auth check
	const [authChecked, setAuthChecked] = useState(false);

	useEffect(() => {
		if (!getToken()) {
			window.location.href = '/admin/login';
			return;
		}
		setAuthChecked(true);
	}, []);

	// 1. Controller (Hook)
	const {
		services,
		products,
		combos,
		addService,
		updateService,
		deleteService,
		addProduct,
		updateProduct,
		deleteProduct,
		addCombo,
		updateCombo,
		deleteCombo,
		loading,
		error
	} = useAdmin();

	// 2. View State
	const [activeTab, setActiveTab] = useState<'services' | 'products' | 'combos'>('services');

	// 3. Logic to handle logout
	const handleLogout = () => {
		clearToken();
		window.location.href = '/admin/login';
	};

	if (!authChecked || loading) {
		return <div className="flex h-screen items-center justify-center bg-brand-ink text-brand-amber animate-pulse font-bold tracking-widest uppercase">Cargando Panel...</div>;
	}

	return (
		<AdminLayout
			activeTab={activeTab}
			onTabChange={setActiveTab}
			onLogout={handleLogout}
		>
			{/* ALERTA DE ERROR */}
			{/* Muestra un error si la API falla */}
			{error && (
				<div className="mx-6 mt-4 p-4 bg-red-900/50 border border-red-500 text-red-100 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
					<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
					<div>
						<p className="font-bold">Error de Conexión</p>
						<p className="text-sm opacity-90">{error}</p>
					</div>
				</div>
			)}
			{/* SERVICIOS */}
			{activeTab === 'services' && (
				<ServiceEditor
					services={services}
					onSave={(service) => {
						if (service.id.startsWith('new-')) {
							const cleanService = { ...service, id: service.name.toLowerCase().replace(/\s+/g, '-') };
							addService(cleanService);
						} else {
							updateService(service);
						}
					}}
					onDelete={deleteService}
				/>
			)}

			{/* PRODUCTOS */}
			{activeTab === 'products' && (
				<ProductEditor
					products={products}
					onSave={(product) => {
						if (product.id.startsWith('new-')) {
							const cleanProduct = { ...product, id: `upper-${product.name.toLowerCase().replace(/\s+/g, '-')}` };
							addProduct(cleanProduct);
						} else {
							updateProduct(product);
						}
					}}
					onDelete={deleteProduct}
				/>
			)}

			{/* COMBOS */}
			{activeTab === 'combos' && (
				<ComboEditor
					combos={combos}
					services={services} // Necesita ver los servicios para seleccionarlos
					onSave={(combo) => {
						if (combo.id.startsWith('new-')) {
							const cleanCombo = { ...combo, id: `combo-${Date.now()}` };
							addCombo(cleanCombo);
						} else {
							updateCombo(combo);
						}
					}}
					onDelete={deleteCombo}
				/>
			)}

		</AdminLayout>
	);
}
