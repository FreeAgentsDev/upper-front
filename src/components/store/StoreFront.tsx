import { useMemo, useState, useEffect } from 'react';
import type { Product, ProductCategory } from '../../data/products';

type CartItem = Product & { quantity: number };

const WHATSAPP_NUMBER = '573000000000';
const CART_STORAGE_KEY = 'upper-cart-storage';

const currency = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const categoryLabels: Record<ProductCategory, string> = {
  cuidado: 'Cuidado',
  styling: 'Styling',
  herramientas: 'Herramientas',
  maquinaria: 'Maquinaria',
};

const categoryIcons: Record<ProductCategory, string> = {
  cuidado: '✨',
  styling: '💇',
  herramientas: '🔧',
  maquinaria: '⚡',
};

interface StoreFrontProps {
  products: Product[];
}

export default function StoreFront({ products }: StoreFrontProps) {
  // Inicializar carrito desde localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.error("Error loading cart", e);
        return [];
      }
    }
    return [];
  });

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showComboModal, setShowComboModal] = useState(false);
  const [comboName, setComboName] = useState('');
  const [comboDescription, setComboDescription] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false); // Estado para el Drawer

  // Persistir carrito al cambiar
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // Abrir carrito automáticamente al agregar (opcional, buena UX)
    setIsCartOpen(true);
  };

  const handleRemove = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleDecrease = (productId: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart],
  );

  const whatsappLink = useMemo(() => {
    if (cart.length === 0) return `https://wa.me/${WHATSAPP_NUMBER}`;

    const lines = cart.map(
      (item) => `• ${item.name} x${item.quantity} - ${currency.format(item.price * item.quantity)} `,
    );
    const message = [
      'Hola Upper Barber Cuts 👋',
      'Quiero confirmar el siguiente pedido de tienda:',
      ...lines,
      '',
      `Total estimado: ${currency.format(total)}`,
      '',
      '¿Me ayudas con la disponibilidad y pago? Gracias.',
    ].join('\n');

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, [cart, total]);

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let filtered = products;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((product) => {
        const nameMatch = product.name?.toLowerCase().includes(searchLower);
        const descMatch = product.description?.toLowerCase().includes(searchLower);
        const categoryLabel = categoryLabels[product.category as ProductCategory] || product.category;
        const categoryMatch = categoryLabel?.toLowerCase().includes(searchLower);
        return nameMatch || descMatch || categoryMatch;
      });
    }
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
  }, [products, selectedCategory, searchTerm]);


  // Agrupar productos para contadores
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {
      cuidado: [],
      styling: [],
      herramientas: [],
      maquinaria: [],
    };
    if (!products) return grouped;
    products.forEach((product) => {
      const cat = product.category || 'other';
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
      grouped[cat].push(product);
    });
    return grouped;
  }, [products]);


  const categories: ProductCategory[] = ['cuidado', 'styling', 'herramientas', 'maquinaria'];

  return (

    <div className="mx-auto max-w-7xl space-y-10 pb-24">
      {/* Barra de búsqueda */}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border-2 border-brand-stone/60 bg-brand-night/60 px-6 py-4 pl-14 text-sm text-brand-light placeholder:text-brand-light/40 focus:border-brand-amber focus:outline-none focus:ring-2 focus:ring-brand-amber/20 transition"
          />
          <svg
            className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-light/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-light/40 transition hover:text-brand-amber"
              aria-label="Limpiar búsqueda"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="mt-3 text-xs text-brand-light/60">
            {filteredProducts.length === 0
              ? 'No se encontraron productos'
              : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}`}
          </p>
        )}
      </div>

      {/* Filtros de categoría */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`rounded-full border px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition-all ${selectedCategory === 'all'
            ? 'border-brand-amber bg-brand-amber text-brand-ink'
            : 'border-brand-stone/60 bg-brand-night/60 text-brand-light/70 hover:border-brand-amber/60 hover:text-brand-amber'
            }`}
        >
          Todos
        </button>
        {categories.map((category) => {
          const count = productsByCategory[category].length;
          if (count === 0) return null;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition-all ${selectedCategory === category
                ? 'border-brand-amber bg-brand-amber text-brand-ink'
                : 'border-brand-stone/60 bg-brand-night/60 text-brand-light/70 hover:border-brand-amber/60 hover:text-brand-amber'
                }`}
            >
              <span className="mr-2">{categoryIcons[category]}</span>
              {categoryLabels[category]} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid de productos (Ahora ocupa todo el ancho) */}
      <div className="grid gap-5 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (


          <article
            key={product.id}
            className="group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-brand-stone/60 bg-brand-night/80 shadow-2xl shadow-black/40 transition-all duration-200 hover:-translate-y-2 hover:border-brand-amber/80 hover:shadow-[0_0_40px_rgba(247,148,31,0.4)]"
          >
            {/* Imagen principal */}
            {product.image ? (
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-ink">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = '/media/image.png'; }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/90 via-brand-ink/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6">
                  <span className="inline-block rounded-full border border-brand-amber/60 bg-brand-amber/20 px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-brand-amber backdrop-blur-sm">
                    {categoryLabels[product.category]}
                  </span>
                </div>
                {/* Botón de detalles */}
                <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                    className="group/btn btn-premium w-full rounded-full border-2 border-brand-amber bg-brand-amber/95 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-brand-ink shadow-lg shadow-brand-amber/50 transition-all duration-200 hover:bg-brand-amber hover:shadow-[0_0_25px_rgba(247,148,31,0.8)] hover:scale-105"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>Ver Detalles</span>
                      <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-brand-stone/40 to-brand-night">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl opacity-20">{categoryIcons[product.category]}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6">
                  <span className="inline-block rounded-full border border-brand-amber/60 bg-brand-amber/20 px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-brand-amber backdrop-blur-sm">
                    {categoryLabels[product.category]}
                  </span>
                </div>
                <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                    className="group/btn btn-premium w-full rounded-full border-2 border-brand-amber bg-brand-amber/95 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-brand-ink shadow-lg shadow-brand-amber/50 transition-all duration-200 hover:bg-brand-amber hover:shadow-[0_0_25px_rgba(247,148,31,0.8)] hover:scale-105"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>Ver Detalles</span>
                      <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Contenido */}
            <div className="flex flex-1 flex-col p-4 sm:p-5 lg:p-6">
              <h3 className="text-lg sm:text-xl font-black text-brand-light leading-tight">{product.name}</h3>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-brand-light/70 line-clamp-2">
                {product.description}
              </p>

              <div className="mt-4 sm:mt-6 space-y-3 border-t border-brand-stone/40 pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <p className="text-xl sm:text-2xl font-black text-brand-amber">
                    {currency.format(product.price)}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="w-full sm:w-auto group/btn btn-premium flex items-center justify-center gap-2 rounded-full border-2 border-brand-amber bg-brand-amber px-4 py-2 sm:px-6 sm:py-3 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-brand-ink shadow-lg shadow-brand-amber/50 transition-all duration-200 hover:scale-110 hover:shadow-[0_0_25px_rgba(247,148,31,0.8)]"
                  >
                    <span>Añadir</span>
                    <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>


      {/* --------- BOTÓN FLOTANTE (Visible siempre si hay items) --------- */}
      {cart.length > 0 && (
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-4 right-20 sm:bottom-6 sm:right-24 z-[50] flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-brand-amber shadow-[0_0_30px_rgba(247,148,31,0.5)] transition-all hover:scale-110 hover:shadow-[0_0_50px_rgba(247,148,31,0.7)] active:scale-95 animate-bounce-subtle"
          aria-label="Ver carrito"
        >
          <svg className="h-6 w-6 sm:h-7 sm:w-7 text-brand-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-red-600 border-2 border-brand-ink text-[10px] sm:text-xs font-bold text-white shadow-lg">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        </button>
      )}

      {/* --------- DRAWER CARRITO (Slide-over) --------- */}
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Panel */}
      <div className={`
        fixed inset-y-0 right-0 z-[70] w-full max-w-md transform bg-brand-night border-l border-brand-stone/40 shadow-2xl transition-transform duration-300 ease-in-out
        ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex h-full flex-col">
          {/* Header Drawer */}
          <div className="flex items-center justify-between border-b border-brand-stone/60 px-6 py-6 bg-brand-ink/50">
            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-brand-amber">Tu Carrito</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="rounded-full p-2 text-brand-light/60 hover:bg-brand-stone/40 hover:text-brand-light transition"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Listado Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                <svg className="h-16 w-16 mb-4 text-brand-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="uppercase tracking-widest font-bold text-sm">Tu carrito está vacío</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 rounded-xl border border-brand-stone/40 bg-brand-ink/40">
                  {item.image && (
                    <img src={item.image} alt="" className="h-16 w-16 rounded-lg object-cover bg-brand-stone/20" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-brand-light truncate">{item.name}</h4>
                    <p className="text-xs text-brand-amber font-mono mt-1">{currency.format(item.price)}</p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleDecrease(item.id)} className="h-6 w-6 rounded border border-brand-stone text-brand-stone hover:border-brand-amber hover:text-brand-amber flex items-center justify-center">-</button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => handleAddToCart(item)} className="h-6 w-6 rounded border border-brand-stone text-brand-stone hover:border-brand-amber hover:text-brand-amber flex items-center justify-center">+</button>
                      </div>
                      <button onClick={() => handleRemove(item.id)} className="text-xs text-red-400 hover:text-red-300 uppercase tracking-wider">Eliminar</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Drawer */}
          {cart.length > 0 && (
            <div className="border-t border-brand-stone/60 p-6 bg-brand-ink/50 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-brand-light/60 uppercase tracking-widest">Total Estimado</span>
                <span className="text-3xl font-black text-brand-amber">{currency.format(total)}</span>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3 rounded-lg border border-brand-stone/40 text-brand-light/60 hover:text-brand-light hover:border-brand-light/60 text-xs font-bold uppercase tracking-[0.2em] transition"
              >
                Seguir Comprando
              </button>

              <button
                onClick={() => setShowComboModal(true)}
                className="w-full py-3 rounded-lg border border-brand-amber/30 text-brand-amber text-xs font-bold uppercase tracking-[0.2em] hover:bg-brand-amber/10 transition"
              >
                🎁 Crear Combo
              </button>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="block w-full py-4 rounded-lg bg-green-600 text-white text-center text-sm font-bold uppercase tracking-[0.2em] hover:bg-green-500 shadow-lg shadow-green-600/20 transition-all hover:scale-[1.02]"
              >
                Completar por WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalles (Mantiene la lógica existente) */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          onClick={() => setSelectedProduct(null)}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-brand-ink/90 backdrop-blur-sm" />

          {/* Modal Content */}
          <div
            className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-brand-stone/60 bg-brand-night/95 shadow-2xl shadow-black/60"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-stone/60 bg-brand-night/95 p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-brand-light">
                Detalles del Producto
              </h2>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-stone/60 bg-brand-ink/60 text-brand-light/70 transition hover:border-brand-amber/60 hover:bg-brand-amber/20 hover:text-brand-amber"
              >
                ✕
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="grid gap-8 p-8 md:grid-cols-2">
              {/* Imagen */}
              <div className="space-y-4">
                {selectedProduct.image ? (
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-brand-stone/60 bg-brand-ink">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="h-full w-full object-cover"
                      onError={(e) => { e.currentTarget.src = '/media/image.png'; }}
                    />

                  </div>
                ) : (
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-brand-stone/60 bg-gradient-to-br from-brand-stone/40 to-brand-night">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-8xl opacity-20">
                        {categoryIcons[selectedProduct.category]}
                      </span>
                    </div>
                  </div>
                )}
                <div className="rounded-2xl border border-brand-stone/60 bg-brand-ink/40 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-brand-amber/80">
                    Categoría
                  </p>
                  <p className="mt-2 text-lg font-semibold text-brand-light">
                    {categoryLabels[selectedProduct.category]}
                  </p>
                </div>
              </div>

              {/* Información */}
              <div className="flex flex-col space-y-6">
                <div>
                  <h3 className="text-3xl font-black text-brand-light">{selectedProduct.name}</h3>
                  <p className="mt-4 text-4xl font-black text-brand-amber">
                    {currency.format(selectedProduct.price)}
                  </p>
                </div>

                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-amber/80">
                    Descripción
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-brand-light/80">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null); // Cerrar modal al agregar
                    }}
                    className="group/btn flex items-center justify-center gap-2 rounded-full border-2 border-brand-amber bg-brand-amber px-8 py-4 text-sm font-bold uppercase tracking-[0.3em] text-brand-ink transition-all hover:bg-transparent hover:text-brand-amber"
                  >
                    <span>Agregar al Carrito</span>
                    <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="rounded-full border border-brand-stone/60 bg-brand-night/60 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand-light/70 transition-all hover:border-brand-amber/60 hover:bg-brand-amber/10 hover:text-brand-amber"
                  >
                    Volver a la Tienda
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Crear Combo (Mantiene la lógica existente pero adaptada al drawer behavior) */}
      {showComboModal && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          onClick={() => setShowComboModal(false)}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-brand-ink/95 backdrop-blur-md" />

          {/* Modal Combo Content (Reutilizado logicamente pero asegurando z-index alto) */}
          <div
            className="relative z-10 w-full max-w-2xl rounded-3xl border border-brand-stone/60 bg-brand-night/95 shadow-2xl shadow-black/60"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="flex items-center justify-between border-b border-brand-stone/60 p-6">
              <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-brand-light">
                Crear Combo de Servicios
              </h2>
              <button
                type="button"
                onClick={() => setShowComboModal(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-stone/60 bg-brand-ink/60 text-brand-light/70 transition hover:border-brand-amber/60 hover:bg-brand-amber/20 hover:text-brand-amber"
              >
                ✕
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-brand-light">
                  Nombre del Combo
                </label>
                <input
                  type="text"
                  value={comboName}
                  onChange={(e) => setComboName(e.target.value)}
                  placeholder="Ej: Mi Combo Personalizado"
                  className="w-full rounded-xl border border-brand-stone/60 bg-brand-ink/40 px-4 py-3 text-sm text-brand-light placeholder:text-brand-light/40 focus:border-brand-amber focus:outline-none focus:ring-2 focus:ring-brand-amber/20 transition"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-brand-light">
                  Descripción (opcional)
                </label>
                <textarea
                  value={comboDescription}
                  onChange={(e) => setComboDescription(e.target.value)}
                  placeholder="Describe tu combo personalizado..."
                  rows={3}
                  className="w-full rounded-xl border border-brand-stone/60 bg-brand-ink/40 px-4 py-3 text-sm text-brand-light placeholder:text-brand-light/40 focus:border-brand-amber focus:outline-none focus:ring-2 focus:ring-brand-amber/20 transition resize-none"
                />
              </div>

              <div className="rounded-2xl border border-brand-stone/60 bg-brand-ink/40 p-4">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-amber">
                  Servicios Incluidos
                </p>
                <ul className="space-y-2">
                  {cart.map((item) => (
                    <li key={item.id} className="flex items-center justify-between text-sm text-brand-light/80">
                      <span>
                        {item.name} {item.quantity > 1 && `x${item.quantity}`}
                      </span>
                      <span className="text-brand-amber">
                        {currency.format(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center justify-between border-t border-brand-stone/60 pt-4">
                  <span className="text-sm font-semibold text-brand-light">Total del Combo</span>
                  <span className="text-xl font-black text-brand-amber">
                    {currency.format(total)}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    if (!comboName.trim()) {
                      alert('Por favor ingresa un nombre para el combo');
                      return;
                    }

                    const combo = {
                      id: `combo-${Date.now()}`,
                      name: comboName.trim(),
                      description: comboDescription.trim(),
                      services: cart.map((item) => `${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ''}`),
                      price: total,
                      createdAt: Date.now(),
                    };

                    const stored = localStorage.getItem('upper-custom-combos');
                    const combos = stored ? JSON.parse(stored) : [];
                    combos.push(combo);
                    localStorage.setItem('upper-custom-combos', JSON.stringify(combos));

                    setShowComboModal(false);
                    setComboName('');
                    setComboDescription('');
                    setCart([]);
                    window.location.reload(); // Para asegurar que se vea la actualización si es necesario
                    alert('¡Combo creado exitosamente!');
                  }}
                  className="flex-1 rounded-full border-2 border-brand-amber bg-brand-amber px-6 py-4 text-center text-xs font-bold uppercase tracking-[0.3em] text-brand-ink transition-all hover:bg-transparent hover:text-brand-amber"
                >
                  Crear Combo
                </button>
                <button
                  type="button"
                  onClick={() => setShowComboModal(false)}
                  className="rounded-full border border-brand-stone/60 bg-brand-night/60 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-light/70 transition-all hover:border-brand-amber/60 hover:bg-brand-amber/10 hover:text-brand-amber"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
