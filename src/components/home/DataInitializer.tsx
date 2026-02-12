import { useEffect } from 'react';
import { storageService } from '../../services/storage';
import { services as initialServices } from '../../data/services';
import { products as initialProducts } from '../../data/products';

/**
 * Componente invisible que inicializa los datos en localStorage
 * si no existen. Esto asegura que la landing page siempre tenga datos
 * para mostrar, incluso antes de usar el panel admin.
 */
export default function DataInitializer() {
	useEffect(() => {
		// Solo inicializar si no hay datos en localStorage
		const storedServices = localStorage.getItem('admin_services');
		const storedProducts = localStorage.getItem('admin_products');

		if (!storedServices) {
			storageService.saveServices(initialServices);
			console.log('✅ Servicios iniciales cargados en localStorage');
		}

		if (!storedProducts) {
			storageService.saveProducts(initialProducts);
			console.log('✅ Productos iniciales cargados en localStorage');
		}
	}, []);

	return null; // No renderiza nada
}
