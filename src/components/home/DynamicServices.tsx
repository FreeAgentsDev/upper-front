import { useState, useEffect } from 'react';
import type { Service } from '../../data/services';
import { services as initialServices } from '../../data/services';
import { storageService } from '../../services/storage';

export default function DynamicServices() {
	const [services, setServices] = useState<Service[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Cargar servicios desde localStorage o usar los iniciales
		const loadedServices = storageService.getServices(initialServices);
		setServices(loadedServices.slice(0, 3)); // Primeros 3 para la landing
		setLoading(false);

		// Escuchar cambios en tiempo real desde el admin
		const handleStorageUpdate = () => {
			const updatedServices = storageService.getServices(initialServices);
			setServices(updatedServices.slice(0, 3));
		};

		window.addEventListener('storage-update', handleStorageUpdate);
		return () => window.removeEventListener('storage-update', handleStorageUpdate);
	}, []);

	if (loading) {
		return (
			<div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{[1, 2, 3].map((i) => (
					<div key={i} className="card-enhanced p-5 sm:p-6 lg:p-7 animate-pulse">
						<div className="h-4 bg-brand-stone/30 rounded w-1/3 mb-4"></div>
						<div className="h-8 bg-brand-stone/30 rounded w-2/3 mb-4"></div>
						<div className="h-16 bg-brand-stone/30 rounded mb-4"></div>
						<div className="space-y-2">
							<div className="h-3 bg-brand-stone/30 rounded"></div>
							<div className="h-3 bg-brand-stone/30 rounded"></div>
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="mt-8 sm:mt-12 lg:mt-16 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{services.map((service, index) => (
				<article key={service.id} className="group card-enhanced animate-slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
					{index === 0 && (
						<div className="relative aspect-[4/3] overflow-hidden">
							<img
								src="/media/otros/img-20250807-wa0147.webp"
								alt="Ambiente Upper Barber Cuts"
								className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/50 to-transparent"></div>
						</div>
					)}
					<div className="p-5 sm:p-6 lg:p-7">
						<p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-brand-amber/90 font-bold">{service.duration}</p>
						<h3 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-black text-brand-light leading-tight">{service.name}</h3>
						<p className="mt-3 sm:mt-4 text-xs sm:text-sm text-brand-light/75 leading-relaxed">{service.summary}</p>
						<ul className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 text-xs sm:text-sm text-brand-light/70">
							{service.features.map((feature, idx) => (
								<li key={idx} className="flex items-start gap-2 sm:gap-3">
									<span className="mt-[6px] h-2 w-2 sm:h-2.5 sm:w-2.5 flex-none rounded-full bg-brand-amber shadow-lg shadow-brand-amber/50"></span>
									<span className="leading-relaxed">{feature}</span>
								</li>
							))}
						</ul>
						<p className="mt-5 sm:mt-7 text-sm sm:text-base font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-brand-amber">{service.price}</p>
					</div>
				</article>
			))}
		</div>
	);
}
