import { useState } from 'react';
import type { CustomCombo } from '../../../data/combos';
import type { Service } from '../../../data/services';

interface ComboEditorProps {
    combos: CustomCombo[];
    services: Service[];
    onSave: (combo: CustomCombo) => void;
    onDelete: (id: string) => void;
}

export default function ComboEditor({ combos, services, onSave, onDelete }: ComboEditorProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [editingCombo, setEditingCombo] = useState<CustomCombo | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrar combos
    const filteredCombos = combos.filter(combo =>
        combo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Seleccionar Combo
    const handleSelect = (combo: CustomCombo) => {
        setSelectedId(combo.id);
        setEditingCombo({ ...combo });
    };

    const handleCreateNew = () => {
        const newCombo: CustomCombo = {
            id: `new-${Date.now()}`,
            name: 'Nuevo Combo Personalizado',
            description: 'Combo especial...',
            price: 0,
            services: [],
            createdAt: Date.now()
        };
        setSelectedId(newCombo.id);
        setEditingCombo(newCombo);
    };

    // Toggle servicio en el combo
    const toggleService = (serviceId: string) => {
        if (!editingCombo) return;

        const currentServices = new Set(editingCombo.services);
        if (currentServices.has(serviceId)) {
            currentServices.delete(serviceId);
        } else {
            currentServices.add(serviceId);
        }

        setEditingCombo({
            ...editingCombo,
            services: Array.from(currentServices)
        });
    };

    if (!editingCombo && combos.length > 0 && !selectedId) {
        handleSelect(combos[0]);
    }

    // Filtrar solo los servicios que existen (por si se borró alguno)
    const getServiceNames = (serviceIds: string[]) => {
        return serviceIds
            .map(id => services.find(s => s.id === id)?.name)
            .filter(Boolean)
            .join(', ');
    };

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6 overflow-hidden">

            {/* 1. Sidebar List */}
            <div className="w-1/3 min-w-[300px] max-w-[400px] overflow-y-auto rounded-2xl border border-brand-stone/30 bg-brand-ink/50 p-4 backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-wider text-brand-light/70">Combos</h3>
                    <button
                        onClick={handleCreateNew}
                        className="rounded-full bg-brand-amber/10 p-1 text-brand-amber hover:bg-brand-amber hover:text-brand-ink transition-colors"
                        title="Crear Nuevo Combo"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                {/* Buscador */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar combo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-brand-ink/50 border border-brand-stone/30 rounded-lg px-3 py-2 text-sm text-brand-light placeholder:text-brand-light/30 focus:border-brand-amber outline-none"
                    />
                </div>

                <div className="space-y-2">
                    {filteredCombos.length === 0 && (
                        <div className="text-center py-6 text-brand-light/30 text-xs uppercase tracking-widest">
                            No se encontraron combos
                        </div>
                    )}
                    {filteredCombos.map(combo => (
                        <button
                            key={combo.id}
                            onClick={() => handleSelect(combo)}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group
                        ${selectedId === combo.id
                                    ? 'border-brand-amber bg-brand-amber/10 shadow-[0_0_15px_rgba(247,148,31,0.1)]'
                                    : 'border-transparent bg-brand-stone/5 hover:bg-brand-stone/20'
                                }
                    `}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className={`font-bold text-base ${selectedId === combo.id ? 'text-brand-amber' : 'text-brand-light'}`}>
                                    {combo.name}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-brand-light/50 truncate max-w-[60%]">{getServiceNames(combo.services)}</span>
                                <span className="text-brand-light/70 font-mono">${combo.price.toLocaleString()}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Editor Form */}
            <div className="flex-1 overflow-y-auto rounded-2xl border border-brand-stone/30 bg-brand-ink/50 p-8 backdrop-blur-sm">
                {editingCombo ? (
                    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="flex justify-between items-start border-b border-brand-stone/30 pb-6">
                            <div>
                                <h2 className="text-3xl font-black uppercase text-brand-light">Editar Combo</h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs font-mono text-brand-light/40 bg-brand-stone/20 px-2 py-1 rounded">ID: {editingCombo.id}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => onDelete(editingCombo.id)}
                                className="text-xs text-red-500 hover:text-red-400 uppercase font-bold tracking-widest border border-red-500/30 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors flex items-center gap-2"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Eliminar
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            {/* Columna Izquierda: Datos Básicos */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-brand-light/60 mb-2 font-bold">Nombre del Combo</label>
                                    <input
                                        type="text"
                                        value={editingCombo.name}
                                        onChange={(e) => setEditingCombo({ ...editingCombo, name: e.target.value })}
                                        className="w-full bg-brand-ink border border-brand-stone/40 rounded-xl p-4 text-brand-light text-lg focus:border-brand-amber focus:ring-1 focus:ring-brand-amber outline-none transition-all placeholder:text-brand-stone/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-brand-light/60 mb-2 font-bold">Precio Total</label>
                                    <input
                                        type="number"
                                        value={editingCombo.price}
                                        onChange={(e) => setEditingCombo({ ...editingCombo, price: Number(e.target.value) })}
                                        className="w-full bg-brand-ink border border-brand-stone/40 rounded-xl p-4 text-brand-light focus:border-brand-amber outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-brand-light/60 mb-2 font-bold">Descripción</label>
                                    <textarea
                                        value={editingCombo.description}
                                        onChange={(e) => setEditingCombo({ ...editingCombo, description: e.target.value })}
                                        rows={4}
                                        className="w-full bg-brand-ink border border-brand-stone/40 rounded-xl p-4 text-brand-light focus:border-brand-amber outline-none resize-none"
                                    />
                                </div>
                            </div>

                            {/* Columna Derecha: Selección de Servicios */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-brand-light/60 mb-2 font-bold">Seleccionar Servicios Incluidos</label>
                                    <div className="bg-brand-ink border border-brand-stone/20 rounded-xl max-h-[400px] overflow-y-auto p-2">
                                        {services.map(service => {
                                            const isSelected = editingCombo.services.includes(service.id);
                                            return (
                                                <button
                                                    key={service.id}
                                                    onClick={() => toggleService(service.id)}
                                                    className={`w-full text-left p-3 rounded-lg border mb-1 flex items-center justify-between transition-all
                                                ${isSelected
                                                            ? 'bg-brand-amber/10 border-brand-amber text-brand-light'
                                                            : 'bg-transparent border-transparent text-brand-stone hover:bg-brand-stone/5'
                                                        }
                                            `}
                                                >
                                                    <span className="text-sm font-medium">{service.name}</span>
                                                    {isSelected && (
                                                        <svg className="h-5 w-5 text-brand-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p className="mt-2 text-xs text-brand-light/40 text-right">
                                        {editingCombo.services.length} servicios seleccionados
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Botón Guardar Flotante */}
                        <div className="pt-6 border-t border-brand-stone/20 flex justify-end sticky bottom-0 bg-brand-ink/0 backdrop-blur-sm pb-2">
                            <button
                                onClick={() => onSave(editingCombo)}
                                className="bg-brand-amber text-brand-ink font-black uppercase tracking-widest py-4 px-10 rounded-xl shadow-[0_0_20px_rgba(247,148,31,0.4)] hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Guardar Combo
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-brand-stone/50 animate-pulse">
                        <svg className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        <p className="uppercase tracking-widest font-bold">Selecciona un combo para editar</p>
                    </div>
                )}
            </div>
        </div>
    );
}
