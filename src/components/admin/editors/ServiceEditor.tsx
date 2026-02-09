import { useState } from 'react';
import type { Service } from '../../../data/services';

interface ServiceEditorProps {
    services: Service[];
    onSave: (service: Service) => void;
    onDelete: (id: string) => void;
}

export default function ServiceEditor({ services, onSave, onDelete }: ServiceEditorProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<'all' | 'principal' | 'combo' | 'sin-cita'>('all');
    const [showMobileEditor, setShowMobileEditor] = useState(false);

    // Filtrar servicios
    const filteredServices = services.filter(service => {
        const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
        const serviceText = `${service.name} ${service.summary}`.toLowerCase();

        const matchesSearch = searchTerms.every(term => serviceText.includes(term));
        const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
        return matchesSearch && matchesCategory;
    }).sort((a, b) => a.name.localeCompare(b.name));

    // Seleccionar un servicio para editar
    const handleSelect = (service: Service) => {
        setSelectedId(service.id);
        setEditingService({ ...service });
        setShowMobileEditor(true);
    };

    const handleCreateNew = () => {
        const newService: Service = {
            id: `new-${Date.now()}`,
            name: 'Nuevo Servicio',
            summary: 'Descripción del servicio...',
            duration: '30 min',
            price: '$0',
            priceNumber: 0,
            category: 'principal',
            features: ['Característica 1']
        };
        setSelectedId(newService.id);
        setEditingService(newService);
        setShowMobileEditor(true);
    };

    if (!editingService && services.length > 0 && !selectedId) {
        // Auto-seleccionar el primero si no hay nada seleccionado (solo en desktop)
        if (typeof window !== 'undefined' && window.innerWidth > 1024) {
            handleSelect(services[0]);
            setShowMobileEditor(false);
        }
    }

    return (
        <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-140px)] gap-6 lg:overflow-hidden min-h-screen lg:min-h-0">

            {/* 1. Sidebar List (Lista de Servicios) */}
            <div className={`
                ${showMobileEditor ? 'hidden lg:flex' : 'flex'}
                w-full lg:w-1/3 lg:min-w-[300px] lg:max-w-[400px] flex-col rounded-2xl border border-brand-stone/30 bg-brand-ink/50 p-4 backdrop-blur-sm
            `}>
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-wider text-brand-light/70">Servicios</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={handleCreateNew}
                            className="rounded-full bg-brand-amber text-brand-ink p-1.5 hover:bg-brand-amber/80 transition-colors"
                            title="Crear Nuevo Servicio"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Buscador y Filtros */}
                <div className="mb-4 space-y-2">
                    <input
                        type="text"
                        placeholder="Buscar servicio..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-brand-ink/50 border border-brand-stone/30 rounded-lg px-3 py-2 text-sm text-brand-light placeholder:text-brand-light/30 focus:border-brand-amber outline-none"
                    />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value as any)}
                        className="w-full bg-brand-ink/50 border border-brand-stone/30 rounded-lg px-3 py-2 text-sm text-brand-light/70 focus:border-brand-amber outline-none"
                    >
                        <option value="all">Todas las Categorías</option>
                        <option value="principal">Principales</option>
                        <option value="combo">Combos</option>
                        <option value="sin-cita">Sin Cita</option>
                    </select>
                </div>

                <div className="flex-1 lg:overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {filteredServices.length === 0 && (
                        <div className="text-center py-8 text-brand-light/30 text-xs">
                            No se encontraron servicios
                        </div>
                    )}
                    {filteredServices.map(service => (
                        <button
                            key={service.id}
                            onClick={() => handleSelect(service)}
                            className={`w-full text-left p-3 sm:p-4 rounded-xl border transition-all duration-200 group
                        ${selectedId === service.id
                                    ? 'border-brand-amber bg-brand-amber/10 shadow-[0_0_15px_rgba(247,148,31,0.1)]'
                                    : 'border-transparent bg-brand-stone/5 hover:bg-brand-stone/20'
                                }
                    `}
                        >
                            <div className="flex justify-between items-center mb-0.5 sm:mb-1">
                                <span className={`font-bold text-sm sm:text-base ${selectedId === service.id ? 'text-brand-amber' : 'text-brand-light'}`}>
                                    {service.name}
                                </span>
                                {service.category === 'principal' && <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-brand-amber" title="Servicio Principal" />}
                            </div>
                            <div className="flex justify-between items-center text-[10px] sm:text-xs">
                                <span className="text-brand-light/50">{service.duration}</span>
                                <span className="text-brand-light/70 font-mono">{service.price}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Editor Form */}
            <div className={`
                ${showMobileEditor ? 'block' : 'hidden lg:block'}
                flex-1 overflow-y-auto rounded-2xl border border-brand-stone/30 bg-brand-ink/50 p-4 sm:p-6 lg:p-8 backdrop-blur-sm
            `}>
                {editingService ? (
                    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-4xl mx-auto">

                        {/* Mobile Back Button */}
                        <button
                            onClick={() => setShowMobileEditor(false)}
                            className="lg:hidden flex items-center gap-2 text-brand-light/60 hover:text-brand-light text-xs font-bold uppercase tracking-widest mb-4"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Volver a la lista
                        </button>

                        {/* Header del Formulario */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-brand-stone/30 pb-6">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase text-brand-light">Detalles del Servicio</h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[10px] font-mono text-brand-light/40 bg-brand-stone/20 px-2 py-0.5 rounded">ID: {editingService.id}</span>
                                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border ${editingService.category === 'principal' ? 'border-brand-amber text-brand-amber' : 'border-brand-stone text-brand-stone'
                                        }`}>
                                        {editingService.category}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    if (confirm('¿Deseas eliminar este servicio?')) {
                                        onDelete(editingService.id);
                                        setShowMobileEditor(false);
                                    }
                                }}
                                className="text-[10px] text-red-500 hover:text-red-400 uppercase font-bold tracking-widest border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors flex items-center gap-2"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Eliminar
                            </button>
                        </div>

                        {/* Form Fields Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

                            {/* Columna Izquierda: Datos Básicos */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-brand-light/60 mb-2 font-bold">Nombre del Servicio</label>
                                    <input
                                        type="text"
                                        value={editingService.name}
                                        onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                                        className="w-full bg-brand-ink/80 border border-brand-stone/40 rounded-xl p-3 sm:p-4 text-brand-light text-base sm:text-lg focus:border-brand-amber focus:ring-1 focus:ring-brand-amber outline-none transition-all placeholder:text-brand-stone/50"
                                        placeholder="Ej: Corte Clásico"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-brand-light/60 mb-2 font-bold">Categoría</label>
                                    <select
                                        value={editingService.category}
                                        onChange={(e) => setEditingService({ ...editingService, category: e.target.value as any })}
                                        className="w-full bg-brand-ink/80 border border-brand-stone/40 rounded-xl p-3 sm:p-4 text-sm text-brand-light focus:border-brand-amber outline-none"
                                    >
                                        <option value="principal">Servicio Principal</option>
                                        <option value="combo">Combo</option>
                                        <option value="sin-cita">Sin Cita</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-brand-light/60 mb-2 font-bold">Duración</label>
                                        <input
                                            type="text"
                                            value={editingService.duration}
                                            onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                                            className="w-full bg-brand-ink/80 border border-brand-stone/40 rounded-xl p-3 sm:p-4 text-sm text-brand-light focus:border-brand-amber outline-none"
                                            placeholder="Ej: 30 min"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Columna Derecha: Precios y Detalles */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-brand-light/60 mb-2 font-bold">Precio (Texto)</label>
                                        <input
                                            type="text"
                                            value={editingService.price}
                                            onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                                            className="w-full bg-brand-ink/80 border border-brand-stone/40 rounded-xl p-3 sm:p-4 text-sm text-brand-light focus:border-brand-amber outline-none"
                                            placeholder="Ej: $25.000"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-brand-light/60 mb-2 font-bold">Precio (Numérico)</label>
                                        <input
                                            type="number"
                                            value={editingService.priceNumber}
                                            onChange={(e) => setEditingService({ ...editingService, priceNumber: Number(e.target.value) })}
                                            className="w-full bg-brand-ink/80 border border-brand-stone/40 rounded-xl p-3 sm:p-4 text-sm text-brand-light focus:border-brand-amber outline-none"
                                            placeholder="Ej: 25000"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-brand-light/60 mb-2 font-bold">Descripción Corta</label>
                                    <textarea
                                        value={editingService.summary}
                                        onChange={(e) => setEditingService({ ...editingService, summary: e.target.value })}
                                        rows={4}
                                        className="w-full bg-brand-ink/80 border border-brand-stone/40 rounded-xl p-3 sm:p-4 text-sm text-brand-light focus:border-brand-amber outline-none resize-none"
                                        placeholder="Describe el servicio..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Botón Guardar Flotante */}
                        <div className="pt-6 border-t border-brand-stone/20 flex justify-end sticky bottom-0 bg-brand-ink/0 backdrop-blur-sm pb-2">
                            <button
                                onClick={() => {
                                    onSave(editingService);
                                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                                        setShowMobileEditor(false);
                                    }
                                }}
                                className="w-full sm:w-auto bg-brand-amber text-brand-ink font-black uppercase tracking-widest py-3 sm:py-4 px-8 sm:px-10 rounded-xl shadow-[0_0_20px_rgba(247,148,31,0.4)] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2 text-xs sm:text-sm"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-brand-stone/50 animate-pulse">
                        <svg className="h-12 w-12 sm:h-16 sm:w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <p className="uppercase tracking-widest font-bold text-[10px] sm:text-xs">Selecciona un servicio para editar</p>
                    </div>
                )}
            </div>
        </div>
    );
}
