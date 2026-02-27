import { useState, useRef } from 'react';
import type { CustomCombo } from '../../../data/combos';
import type { Service } from '../../../data/services';
import { apiService } from '../../../services/api';

interface ComboEditorProps {
    combos: CustomCombo[];
    services: Service[];
    onSave: (combo: CustomCombo) => void;
    onDelete: (id: string) => void;
}

export default function ComboEditor({ combos, services, onSave, onDelete }: ComboEditorProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [editingCombo, setEditingCombo] = useState<CustomCombo | null>(null);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showMobileEditor, setShowMobileEditor] = useState(false);

    // Filtrar combos
    const filteredCombos = combos.filter(combo =>
        combo.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name));

    // Seleccionar Combo
    const handleSelect = (combo: CustomCombo) => {
        setSelectedId(combo.id);
        setEditingCombo({ ...combo });
        setPendingFile(null);
        setShowMobileEditor(true);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && editingCombo) {
            setPendingFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditingCombo({ ...editingCombo, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!editingCombo) return;
        if (editingCombo.services.length === 0) {
            alert('Debes seleccionar al menos un servicio para crear un combo.');
            return;
        }
        let comboToSave = { ...editingCombo };

        if (pendingFile) {
            setUploading(true);
            try {
                const oldImageUrl = combos.find(c => c.id === editingCombo.id)?.image;
                const uploadedUrl = await apiService.uploadImage(pendingFile, oldImageUrl);
                comboToSave = { ...comboToSave, image: uploadedUrl };
                setPendingFile(null);
            } catch (err) {
                console.error('Error subiendo imagen:', err);
                setUploading(false);
                return;
            }
            setUploading(false);
        }

        onSave(comboToSave);
        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            setShowMobileEditor(false);
        }
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
        setShowMobileEditor(true);
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
        // Auto-seleccionar el primero si no hay nada seleccionado (solo en desktop)
        if (typeof window !== 'undefined' && window.innerWidth > 1024) {
            handleSelect(combos[0]);
            setShowMobileEditor(false);
        }
    }

    // Filtrar solo los servicios que existen (por si se borró alguno)
    const getServiceNames = (serviceIds: string[]) => {
        return serviceIds
            .map(id => services.find(s => s.id === id)?.name)
            .filter(Boolean)
            .join(', ');
    };

    return (
        <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-140px)] gap-6 lg:overflow-hidden min-h-screen lg:min-h-0">

            {/* 1. Sidebar List */}
            <div className={`
                ${showMobileEditor ? 'hidden lg:flex' : 'flex'}
                w-full lg:w-1/3 lg:min-w-[300px] lg:max-w-[400px] flex-col rounded-2xl border border-brand-stone/30 bg-brand-ink/50 p-4 backdrop-blur-sm
            `}>
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-wider text-brand-light/70">Combos</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={handleCreateNew}
                            className="rounded-full bg-brand-amber text-brand-ink p-1.5 hover:bg-brand-amber/80 transition-colors"
                            title="Crear Nuevo Combo"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
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

                <div className="flex-1 lg:overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {filteredCombos.length === 0 && (
                        <div className="text-center py-6 text-brand-light/30 text-[10px] uppercase tracking-widest">
                            No se encontraron combos
                        </div>
                    )}
                    {filteredCombos.map(combo => (
                        <button
                            key={combo.id}
                            onClick={() => handleSelect(combo)}
                            className={`w-full text-left p-3 sm:p-4 rounded-xl border transition-all duration-200 group
                        ${selectedId === combo.id
                                    ? 'border-brand-amber bg-brand-amber/10 shadow-[0_0_15px_rgba(247,148,31,0.1)]'
                                    : 'border-transparent bg-brand-stone/5 hover:bg-brand-stone/20'
                                }
                    `}
                        >
                            <div className="flex justify-between items-center mb-0.5 sm:mb-1">
                                <span className={`font-bold text-sm sm:text-base ${selectedId === combo.id ? 'text-brand-amber' : 'text-brand-light'}`}>
                                    {combo.name}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] sm:text-xs">
                                <span className="text-brand-light/50 truncate max-w-[60%]">{getServiceNames(combo.services)}</span>
                                <span className="text-brand-light/70 font-mono">${combo.price.toLocaleString()}</span>
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
                {editingCombo ? (
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

                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-brand-stone/30 pb-6">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-black uppercase text-brand-light">Detalles del Combo</h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[10px] font-mono text-brand-light/40 bg-brand-stone/20 px-2 py-0.5 rounded">ID: {editingCombo.id}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    if (confirm('¿Deseas eliminar este combo?')) {
                                        onDelete(editingCombo.id);
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                            {/* Columna Izquierda: Datos Básicos */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-brand-light/60 mb-2 font-bold">Nombre del Combo</label>
                                    <input
                                        type="text"
                                        value={editingCombo.name}
                                        onChange={(e) => setEditingCombo({ ...editingCombo, name: e.target.value })}
                                        className="w-full bg-brand-ink/80 border border-brand-stone/40 rounded-xl p-3 sm:p-4 text-brand-light text-base sm:text-lg focus:border-brand-amber focus:ring-1 focus:ring-brand-amber outline-none transition-all placeholder:text-brand-stone/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-brand-light/60 mb-2 font-bold">Precio Total (COP)</label>
                                    <input
                                        type="number"
                                        value={editingCombo.price}
                                        onChange={(e) => setEditingCombo({ ...editingCombo, price: Number(e.target.value) })}
                                        className="w-full bg-brand-ink/80 border border-brand-stone/40 rounded-xl p-3 sm:p-4 text-sm text-brand-light focus:border-brand-amber outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-brand-light/60 mb-2 font-bold">Descripción</label>
                                    <textarea
                                        value={editingCombo.description}
                                        onChange={(e) => setEditingCombo({ ...editingCombo, description: e.target.value })}
                                        rows={4}
                                        className="w-full bg-brand-ink/80 border border-brand-stone/40 rounded-xl p-3 sm:p-4 text-sm text-brand-light focus:border-brand-amber outline-none resize-none"
                                    />
                                </div>

                                {/* Imagen del Combo */}
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-brand-light/60 mb-2 font-bold">Imagen del Combo</label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`relative w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden
                                            ${editingCombo.image ? 'border-brand-amber/50 bg-brand-ink' : 'border-brand-stone/30 bg-brand-stone/5 hover:bg-brand-stone/10 hover:border-brand-amber'}`}
                                    >
                                        {editingCombo.image ? (
                                            <>
                                                <img src={editingCombo.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/media/image.png'; }} />
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-white font-bold uppercase tracking-widest text-[10px]">Cambiar Imagen</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center p-6">
                                                <svg className="h-10 w-10 mx-auto text-brand-stone mb-3 group-hover:text-brand-amber transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-brand-light/60 text-xs font-medium uppercase tracking-wider">Subir foto</p>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                                </div>
                            </div>

                            {/* Columna Derecha: Selección de Servicios */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-brand-light/60 mb-2 font-bold">Servicios Incluidos</label>
                                    <div className="bg-brand-ink/50 border border-brand-stone/20 rounded-xl max-h-[300px] sm:max-h-[400px] overflow-y-auto p-2">
                                        {services.map(service => {
                                            const isSelected = editingCombo.services.includes(service.id);
                                            return (
                                                <button
                                                    key={service.id}
                                                    onClick={() => toggleService(service.id)}
                                                    className={`w-full text-left p-2.5 sm:p-3 rounded-lg border mb-1 flex items-center justify-between transition-all
                                                ${isSelected
                                                            ? 'bg-brand-amber/10 border-brand-amber text-brand-light'
                                                            : 'bg-transparent border-transparent text-brand-stone hover:bg-brand-stone/5'
                                                        }
                                            `}
                                                >
                                                    <span className="text-[11px] sm:text-xs font-medium">{service.name}</span>
                                                    {isSelected && (
                                                        <svg className="h-4 w-4 text-brand-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p className="mt-2 text-[10px] text-brand-light/40 text-right">
                                        {editingCombo.services.length} servicios seleccionados
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Botón Guardar Flotante */}
                        <div className="pt-6 border-t border-brand-stone/20 flex justify-end sticky bottom-0 bg-brand-ink/0 backdrop-blur-sm pb-2">
                            <button
                                onClick={handleSave}
                                disabled={editingCombo.services.length === 0 || uploading}
                                className={`w-full sm:w-auto font-black uppercase tracking-widest py-3 sm:py-4 px-8 sm:px-10 rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm
                                    ${editingCombo.services.length === 0 || uploading
                                        ? 'bg-brand-stone/30 text-brand-light/20 cursor-not-allowed'
                                        : 'bg-brand-amber text-brand-ink shadow-[0_0_20px_rgba(247,148,31,0.4)] hover:scale-105 active:scale-95'
                                    }
                                `}
                            >
                                {uploading ? (
                                    <>
                                        <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Subiendo imagen...
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {editingCombo.services.length === 0 ? 'Selecciona Servicios' : 'Guardar Combo'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-brand-stone/50 animate-pulse">
                        <svg className="h-12 w-12 sm:h-16 sm:w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        <p className="uppercase tracking-widest font-bold text-[10px] sm:text-xs">Selecciona un combo para editar</p>
                    </div>
                )}
            </div>
        </div>
    );
}
