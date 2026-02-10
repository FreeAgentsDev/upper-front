import { useState, useEffect } from 'react';
import type { Service } from '../../data/services';
import { services as initialServices } from '../../data/services';
import { storageService } from '../../services/storage';

interface DynamicServicesByCategoryProps {
	category: 'principal' | 'combo' | 'sin-cita';
	categoryLabel: string;
	gridCols?: string;
}

export default function DynamicServicesByCategory({ category, categoryLabel, gridCols = 'lg:grid-cols-3' }: DynamicServicesByCategoryProps) {
	const [services, setServices] = useState<Service[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Cargar servicios desde localStorage o usar los iniciales
		const loadedServices = storageService.getServices(initialServices);
		const filtered = loadedServices.filter(s => s.category === category);
		setServices(filtered);
		setLoading(false);

		// Escuchar cambios en tiempo real desde el admin
		const handleStorageUpdate = () => {
			const updatedServices = storageService.getServices(initialServices);
			const filtered = updatedServices.filter(s => s.category === category);
			setServices(filtered);
		};

		window.addEventListener('storage-update', handleStorageUpdate);
		return () => window.removeEventListener('storage-update', handleStorageUpdate);
	}, [category]);

	if (loading) {
		return (
			<div className={`grid gap-6 sm:gap-8 md:grid-cols-2 ${gridCols}`}>
				{[1, 2, 3].map((i) => (
					<div key={i} className="card-enhanced p-6 sm:p-8 animate-pulse">
						<div className="h-4 bg-brand-stone/30 rounded w-1/3 mb-4"></div>
						<div className="h-8 bg-brand-stone/30 rounded w-2/3 mb-4"></div>
						<div className="h-20 bg-brand-stone/30 rounded mb-4"></div>
						<div className="h-8 bg-brand-stone/30 rounded"></div>
					</div>
				))}
			</div>
		);
	}

	if (services.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-brand-light/70">No hay servicios disponibles en esta categoría</p>
			</div>
		);
	}

	return (
		<div className={`grid gap-6 sm:gap-8 md:grid-cols-2 ${gridCols}`}>
			{services.map((service, index) => (
				<article
					key={service.id}
					className="group card-enhanced h-full animate-slide-up hover:shadow-2xl hover:shadow-brand-amber/20 transition-all duration-300"
					style={{ animationDelay: `${index * 0.1}s` }}
				>
					{service.image ? (
						// Layout con imagen (2 columnas)
						<div className="flex flex-col sm:flex-row h-full">
							<div className="relative w-full sm:w-1/2 aspect-square sm:aspect-auto bg-brand-stone/20">
								<img
									src={service.image}
									alt={service.name}
									className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
									loading="lazy"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-brand-ink/60 via-transparent to-transparent sm:hidden"></div>
							</div>
							<div className="flex-1 p-6 sm:p-7 md:p-8 flex flex-col justify-between">
								<div>
									<p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-brand-amber/90 font-bold">
										{service.duration}
									</p>
									<h3 className="mt-4 text-xl sm:text-2xl font-black text-brand-light leading-tight group-hover:text-brand-amber transition-colors duration-300">
										{service.name}
									</h3>
									<p className="mt-4 text-sm text-brand-light/75 leading-relaxed">{service.summary}</p>

									<ul className="mt-6 space-y-2 sm:space-y-3">
										{service.features.map((feature, idx) => (
											<li key={idx} className="flex items-start gap-2 sm:gap-3">
												<span className="mt-[6px] h-2 w-2 sm:h-2.5 sm:w-2.5 flex-none rounded-full bg-brand-amber shadow-lg shadow-brand-amber/50"></span>
												<span className="text-xs sm:text-sm text-brand-light/70 leading-relaxed">{feature}</span>
											</li>
										))}
									</ul>
								</div>

								<div className="mt-6 pt-6 border-t border-brand-stone/30">
									<div className="flex items-center justify-between gap-2">
										<p className="text-lg sm:text-xl font-black text-brand-amber">{service.price}</p>
										<a
											href="https://wa.me/573000000000?text=Hola%20Upper%20Barber%20Cuts,%20quiero%20reservar%20una%20cita."
											target="_blank"
											rel="noreferrer"
											className="group/btn inline-flex items-center gap-1.5 rounded-full border-2 border-brand-amber/70 bg-brand-amber/10 px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-brand-amber transition-all duration-300 hover:border-brand-amber hover:bg-brand-amber hover:text-brand-ink"
										>
											<span>Reservar</span>
											<svg className="h-3 w-3 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
											</svg>
										</a>
									</div>
								</div>
							</div>
						</div>
					) : (
						// Layout sin imagen (3 columnas)
						<div className="p-6 sm:p-7 md:p-8 h-full flex flex-col">
							<div>
								<p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-brand-amber/90 font-bold">
									{service.duration}
								</p>
								<h3 className="mt-4 text-xl sm:text-2xl font-black text-brand-light leading-tight group-hover:text-brand-amber transition-colors duration-300">
									{service.name}
								</h3>
								<p className="mt-4 text-sm text-brand-light/75 leading-relaxed">{service.summary}</p>
							</div>

							<ul className="mt-6 space-y-2 sm:space-y-3 flex-grow">
								{service.features.map((feature, idx) => (
									<li key={idx} className="flex items-start gap-2 sm:gap-3">
										<span className="mt-[6px] h-2 w-2 sm:h-2.5 sm:w-2.5 flex-none rounded-full bg-brand-amber shadow-lg shadow-brand-amber/50"></span>
										<span className="text-xs sm:text-sm text-brand-light/70 leading-relaxed">{feature}</span>
									</li>
								))}
							</ul>

							<div className="mt-6 pt-6 border-t border-brand-stone/30 mt-auto">
								<div className="flex items-center justify-between gap-2">
									<p className="text-lg sm:text-xl font-black text-brand-amber">{service.price}</p>
									<a
										href="https://wa.me/573000000000?text=Hola%20Upper%20Barber%20Cuts,%20quiero%20reservar%20una%20cita."
										target="_blank"
										rel="noreferrer"
										className="group/btn inline-flex items-center gap-1.5 rounded-full border-2 border-brand-amber/70 bg-brand-amber/10 px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-brand-amber transition-all duration-300 hover:border-brand-amber hover:bg-brand-amber hover:text-brand-ink"
									>
										<span>Reservar</span>
										<svg className="h-3 w-3 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
										</svg>
									</a>
								</div>
							</div>
						</div>
					)}
				</article>
			))}
		</div>
	);
}
