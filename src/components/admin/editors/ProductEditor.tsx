import { useState, useRef } from 'react';
import type { Product } from '../../../data/products';
import { apiService } from '../../../services/api';


interface ProductEditorProps {
    products: Product[];
    onSave: (product: Product) => void;
    onDelete: (id: string) => void;
}

export default function ProductEditor({ products, onSave, onDelete }: ProductEditorProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<'all' | 'cuidado' | 'styling' | 'herramientas' | 'maquinaria'>('all');
    const [showMobileEditor, setShowMobileEditor] = useState(false);


    // Filtrar productos
    const filteredProducts = products.filter(product => {
        const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
        const productText = `${product.name} ${product.description}`.toLowerCase();

        const matchesSearch = searchTerms.every(term => productText.includes(term));
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    }).sort((a, b) => a.name.localeCompare(b.name));

    // Seleccionar Producto
    const handleSelect = (product: Product) => {
        setSelectedId(product.id);
        setEditingProduct({ ...product });
        setPendingFile(null);
        setShowMobileEditor(true);
    };

    const handleCreateNew = () => {
        const newProduct: Product = {
            id: `new-${Date.now()}`,
            name: 'Nuevo Producto',
            description: 'Descripción del producto...',
            price: 0,
            category: 'cuidado',
            image: '' // Imagen vacía por defecto
        };
        setSelectedId(newProduct.id);
        setEditingProduct(newProduct);
        setShowMobileEditor(true);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && editingProduct) {
            setPendingFile(file);
            // Preview local inmediato con Base64
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditingProduct({ ...editingProduct, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!editingProduct) return;
        let productToSave = { ...editingProduct };

        if (pendingFile) {
            setUploading(true);
            try {
                const oldImageUrl = products.find(p => p.id === editingProduct.id)?.image;
                const uploadedUrl = await apiService.uploadImage(pendingFile, oldImageUrl);
                productToSave = { ...productToSave, image: uploadedUrl };
                setPendingFile(null);
            } catch (err) {
                console.error('Error subiendo imagen:', err);
                setUploading(false);
                return;
            }
            setUploading(false);
        }

        onSave(productToSave);
        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            setShowMobileEditor(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Auto-seleccionar el primero si no hay nada
    if (!editingProduct && products.length > 0 && !selectedId) {
        if (typeof window !== 'undefined' && window.innerWidth > 1024) {
            handleSelect(products[0]);
            setShowMobileEditor(false);
        }
    }

    return (
        <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-140px)] gap-6 lg:overflow-hidden min-h-screen lg:min-h-0">

            {/* 1. Sidebar List */}
            <div className={`
                ${showMobileEditor ? 'hidden lg:flex' : 'flex'}
                w-full lg:w-1/3 lg:min-w-[300px] lg:max-w-[400px] flex-col rounded-2xl border border-brand-stone/30 bg-brand-ink/50 p-4 backdrop-blur-sm
            `}>
                <div className="mb-4 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-black uppercase tracking-wider text-brand-light/70">Productos</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={handleCreateNew}
                            className="rounded-full bg-brand-amber text-brand-ink p-1.5 hover:bg-brand-amber/80 transition-colors"
                            title="Crear Nuevo Producto"
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
                        placeholder="Buscar producto..."
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
                        <option value="cuidado">Cuidado</option>
                        <option value="styling">Styling</option>
                        <option value="herramientas">Herramientas</option>
                        <option value="maquinaria">Maquinaria</option>
                    </select>
                </div>

                <div className="flex-1 lg:overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {filteredProducts.length === 0 && (
                        <div className="text-center py-8 text-brand-light/30 text-xs">
                            No se encontraron productos
                        </div>
                    )}
                    {filteredProducts.map(product => (
                        <button
                            key={product.id}
                            onClick={() => handleSelect(product)}
                            className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group flex gap-3
                        ${selectedId === product.id
                                    ? 'border-brand-amber bg-brand-amber/10 shadow-[0_0_15px_rgba(247,148,31,0.1)]'
                                    : 'border-transparent bg-brand-stone/5 hover:bg-brand-stone/20'
                                }
                    `}
                        >
                            {/* Thumbnail */}
                            <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-lg bg-brand-stone/20 overflow-hidden">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt=""
                                        className="h-full w-full object-cover"
                                        onError={(e) => { e.currentTarget.src = '/media/image.png'; }}
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-brand-light/20">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-start mb-0.5">
                                    <span className={`font-bold text-xs sm:text-sm truncate pr-2 ${selectedId === product.id ? 'text-brand-amber' : 'text-brand-light'}`}>
                                        {product.name}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] sm:text-xs">
                                    <span className="text-brand-light/50 capitalize truncate">{product.category}</span>
                                    <span className="text-brand-light/70 font-mono">${product.price.toLocaleString()}</span>
                                </div>
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
                {editingProduct ? (
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
                                <h2 className="text-2xl sm:text-3xl font-black uppercase text-brand-light">Detalles del Producto</h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[10px] font-mono text-brand-light/40 bg-brand-stone/20 px-2 py-0.5 rounded">ID: {editingProduct.id}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    if (confirm('¿Deseas eliminar este producto?')) {
                                        onDelete(editingProduct.id);
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
                            {/* Columna Izquierda: Datos */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-brand-light/60 mb-2 font-bold">Nombre del Producto</label>
                                    <input
                                        type="text"
                                        value={editingProduct.name}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                        className="w-full bg-brand-ink/80 border border-brand-stone/40 rounded-xl p-3 sm:p-4 text-brand-light text-base sm:text-lg focus:border-brand-amber focus:ring-1 focus:ring-brand-amber outline-none transition-all placeholder:text-brand-stone/50"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-brand-light/60 mb-2 font-bold">Categoría</label>
                                        <select
                                            value={editingProduct.category}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                                            className="w-full bg-brand-ink/80 border border-brand-stone/40 rounded-xl p-3 sm:p-4 text-sm text-brand-light focus:border-brand-amber outline-none"
                                        >
                                            <option value="cuidado">Cuidado</option>
                                            <option value="styling">Styling</option>
                                            <option value="herramientas">Herramientas</option>
                                            <option value="maquinaria">Maquinaria</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-brand-light/60 mb-2 font-bold">Precio (COP)</label>
                                        <input
                                            type="number"
                                            value={editingProduct.price}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                                            className="w-full bg-brand-ink/80 border border-brand-stone/40 rounded-xl p-3 sm:p-4 text-sm text-brand-light focus:border-brand-amber outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-brand-light/60 mb-2 font-bold">Descripción</label>
                                    <textarea
                                        value={editingProduct.description}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                        rows={4}
                                        className="w-full bg-brand-ink/80 border border-brand-stone/40 rounded-xl p-3 sm:p-4 text-sm text-brand-light focus:border-brand-amber outline-none resize-none"
                                    />
                                </div>
                            </div>

                            {/* Columna Derecha: Imagen */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-brand-light/60 mb-2 font-bold">Imagen del Producto</label>

                                    <div
                                        onClick={triggerFileInput}
                                        className={`
                                    relative w-full aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden
                                    ${editingProduct.image
                                                ? 'border-brand-amber/50 bg-brand-ink'
                                                : 'border-brand-stone/30 bg-brand-stone/5 hover:bg-brand-stone/10 hover:border-brand-amber'
                                            }
                                `}
                                    >
                                        {editingProduct.image ? (
                                            <>
                                                <img
                                                    src={editingProduct.image}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.currentTarget.src = '/media/image.png'; }}
                                                />
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

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />

                                    <div className="mt-4">
                                        <label className="block text-[10px] uppercase tracking-widest text-brand-light/40 mb-2 font-bold">O usa una URL externa</label>
                                        <input
                                            type="text"
                                            value={editingProduct.image || ''}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                                            placeholder="https://"
                                            className="w-full bg-brand-ink/50 border border-brand-stone/20 rounded-lg p-2.5 text-xs text-brand-light focus:border-brand-amber outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botón Guardar Flotante */}
                        <div className="pt-6 border-t border-brand-stone/20 flex justify-end sticky bottom-0 bg-brand-ink/0 backdrop-blur-sm pb-2">
                            <button
                                onClick={handleSave}
                                disabled={uploading}
                                className="w-full sm:w-auto bg-brand-amber text-brand-ink font-black uppercase tracking-widest py-3 sm:py-4 px-8 sm:px-10 rounded-xl shadow-[0_0_20px_rgba(247,148,31,0.4)] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                                        Guardar Producto
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-brand-stone/50 animate-pulse">
                        <svg className="h-12 w-12 sm:h-16 sm:w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <p className="uppercase tracking-widest font-bold text-[10px] sm:text-xs">Selecciona un producto para editar</p>
                    </div>
                )}
            </div>
        </div>
    );
}
