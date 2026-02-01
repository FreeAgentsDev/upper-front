import { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import AdminLayout from './layout/AdminLayout';
import ServiceEditor from './editors/ServiceEditor';
import ProductEditor from './editors/ProductEditor';
import ComboEditor from './editors/ComboEditor';

export default function AdminPanel() {
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
		loading
	} = useAdmin();

	// 2. View State
	const [activeTab, setActiveTab] = useState<'services' | 'products' | 'combos'>('services');

	// 3. Logic to handle logout (simple for now)
	const handleLogout = () => {
		localStorage.removeItem('admin_authenticated');
		window.location.href = '/admin/login';
	};

	if (loading) {
		return <div className="flex h-screen items-center justify-center bg-brand-ink text-brand-amber animate-pulse font-bold tracking-widest uppercase">Cargando Panel...</div>;
	}

	return (
		<AdminLayout
			activeTab={activeTab}
			onTabChange={setActiveTab}
			onLogout={handleLogout}
		>
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
