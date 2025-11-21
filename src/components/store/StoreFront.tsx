import { useMemo, useState } from 'react';
import type { Product, ProductCategory } from '../../data/products';

type CartItem = Product & { quantity: number };

const WHATSAPP_NUMBER = '573000000000';

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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showComboModal, setShowComboModal] = useState(false);
  const [comboName, setComboName] = useState('');
  const [comboDescription, setComboDescription] = useState('');
  const [showCartView, setShowCartView] = useState(false);

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

  // Filtrar productos por categoría y búsqueda
  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((product) => {
        const nameMatch = product.name.toLowerCase().includes(searchLower);
        const descMatch = product.description.toLowerCase().includes(searchLower);
        const categoryMatch = categoryLabels[product.category].toLowerCase().includes(searchLower);
        return nameMatch || descMatch || categoryMatch;
      });
    }
    
    return filtered;
  }, [products, selectedCategory, searchTerm]);

  // Agrupar productos por categoría para el filtro
  const productsByCategory = useMemo(() => {
    const grouped: Record<ProductCategory, Product[]> = {
      cuidado: [],
      styling: [],
      herramientas: [],
      maquinaria: [],
    };
    products.forEach((product) => {
      grouped[product.category].push(product);
    });
    return grouped;
  }, [products]);

  const categories: ProductCategory[] = ['cuidado', 'styling', 'herramientas', 'maquinaria'];

  // Vista del carrito para móviles
  const CartViewMobile = () => (
    <div className="lg:hidden">
      {/* Header del carrito */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowCartView(false)}
          className="flex items-center gap-2 rounded-full border border-brand-stone/60 bg-brand-night/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-light transition hover:bg-brand-stone/40"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-brand-amber">
            Carrito Upper
          </h2>
          <p className="mt-1 text-xs text-brand-light/50 text-center">
            {cart.length === 0
              ? 'Tu carrito está vacío'
              : `${cart.length} ${cart.length === 1 ? 'producto' : 'productos'}`}
          </p>
        </div>
        <div className="w-24"></div>
      </div>

      {cart.length === 0 ? (
        <div className="rounded-2xl border border-brand-stone/40 bg-brand-ink/40 p-12 text-center">
          <svg className="mx-auto h-16 w-16 text-brand-light/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-base text-brand-light/60 mb-6">
            Tu carrito está vacío
          </p>
          <button
            type="button"
            onClick={() => setShowCartView(false)}
            className="rounded-full border-2 border-brand-amber bg-brand-amber px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-brand-ink transition hover:bg-brand-amber/90"
          >
            Ver Productos
          </button>
        </div>
      ) : (
        <>
          {/* Lista de productos */}
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-brand-stone/60 bg-brand-night/80 p-4 backdrop-blur"
              >
                <div className="flex items-start gap-4">
                  {/* Imagen del producto */}
                  {item.image && (
                    <img
                      src={item.image.startsWith('data:') ? item.image : item.image}
                      alt={item.name}
                      className="h-20 w-20 flex-shrink-0 rounded-xl object-cover border border-brand-stone/60"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-brand-light truncate">{item.name}</h3>
                    <p className="mt-1 text-sm text-brand-amber font-semibold">
                      {currency.format(item.price)} c/u
                    </p>
                    {/* Controles de cantidad */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleDecrease(item.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-amber/40 bg-brand-amber/10 text-brand-amber transition hover:bg-brand-amber hover:text-brand-ink"
                        >
                          −
                        </button>
                        <span className="min-w-[2.5rem] text-center text-base font-bold text-brand-light">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-amber/40 bg-brand-amber/10 text-brand-amber transition hover:bg-brand-amber hover:text-brand-ink"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-brand-amber">
                          {currency.format(item.price * item.quantity)}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          className="mt-1 text-xs uppercase tracking-[0.2em] text-brand-light/40 transition hover:text-red-400"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total y botón de checkout */}
          <div className="sticky bottom-0 space-y-4 rounded-2xl border-2 border-brand-stone/60 bg-brand-night/95 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-brand-stone/40 pb-4">
              <span className="text-base font-semibold text-brand-light/70">Total estimado</span>
              <span className="text-3xl font-black text-brand-amber">
                {currency.format(total)}
              </span>
            </div>
            <p className="text-xs text-brand-light/50 text-center">
              El pedido se confirma por WhatsApp. Los precios pueden variar según disponibilidad.
            </p>
            <button
              type="button"
              onClick={() => window.open(whatsappLink, '_blank')}
              className="w-full rounded-full border-2 border-[#25D366] bg-[#25D366] px-6 py-4 text-base font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-[#25D366]/50 transition-all duration-200 hover:scale-105 hover:shadow-[#25D366]/70"
            >
              Enviar por WhatsApp
            </button>
          </div>
        </>
      )}
    </div>
  );

  // Si estamos en vista de carrito móvil, mostrar solo eso
  if (showCartView) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <CartViewMobile />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10">
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
          className={`rounded-full border px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition-all ${
            selectedCategory === 'all'
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
              className={`rounded-full border px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition-all ${
                selectedCategory === category
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

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        {/* Grid de productos */}
        <div className="grid gap-5 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-2">
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
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/90 via-brand-ink/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6">
                    <span className="inline-block rounded-full border border-brand-amber/60 bg-brand-amber/20 px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-brand-amber backdrop-blur-sm">
                      {categoryLabels[product.category]}
                    </span>
                  </div>
                  {/* Botón de detalles sobre la imagen */}
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
                  {/* Botón de detalles sobre el placeholder */}
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
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-brand-light/70">
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

        {/* Carrito lateral - Solo en desktop */}
        <aside className="hidden lg:block sticky top-6 h-max space-y-6 rounded-3xl border border-brand-stone/60 bg-brand-night/90 p-6 backdrop-blur-xl">
          <div>
            <h2 className="text-base sm:text-lg font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-brand-amber">
              Carrito Upper
            </h2>
            <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-brand-light/50">
              {cart.length === 0
                ? 'Tu carrito está vacío'
                : `${cart.length} ${cart.length === 1 ? 'producto' : 'productos'}`}
            </p>
          </div>

          {cart.length === 0 ? (
            <div className="rounded-2xl border border-brand-stone/40 bg-brand-ink/40 p-8 text-center">
              <p className="text-sm text-brand-light/60">
                Agrega tus productos favoritos y envíalos por WhatsApp para coordinar pago y entrega.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-brand-stone/60 bg-brand-ink/60 p-4 backdrop-blur"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-brand-light truncate">{item.name}</p>
                      <p className="mt-1 text-xs text-brand-light/60">
                        {currency.format(item.price)} c/u
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="flex-shrink-0 text-xs uppercase tracking-[0.2em] text-brand-light/40 transition hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleDecrease(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-amber/40 text-brand-amber transition hover:bg-brand-amber hover:text-brand-ink"
                      >
                        −
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-semibold text-brand-light">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-amber/40 text-brand-amber transition hover:bg-brand-amber hover:text-brand-ink"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-brand-amber">
                      {currency.format(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <div className="space-y-4 border-t border-brand-stone/60 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-brand-light/70">Total estimado</span>
                <span className="text-2xl font-black text-brand-amber">
                  {currency.format(total)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowComboModal(true)}
                className="group border-glow block w-full rounded-full border-2 border-brand-amber/60 bg-brand-amber/10 px-6 py-3 text-center text-xs font-bold uppercase tracking-[0.3em] text-brand-amber backdrop-blur transition-all duration-200 hover:bg-brand-amber/20 hover:scale-105"
              >
                Crear Combo de Servicios
              </button>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="btn-premium block rounded-full border-2 border-brand-amber bg-brand-amber px-6 py-4 text-center text-xs font-bold uppercase tracking-[0.3em] text-brand-ink shadow-lg shadow-brand-amber/50 transition-all duration-200 hover:scale-110 hover:shadow-[0_0_25px_rgba(247,148,31,0.8)]"
              >
                Finalizar por WhatsApp
              </a>
              <p className="text-[11px] leading-relaxed text-brand-light/50">
                El pedido se confirma por WhatsApp. Los precios pueden variar según disponibilidad.
                Nuestro equipo te contactará para coordinar pago, envío o recogida en el local.
              </p>
            </div>
          )}
        </aside>

      </div>

      {/* Botón flotante del carrito para móviles */}
      {cart.length > 0 && (
        <button
          type="button"
          onClick={() => setShowCartView(true)}
          className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-amber shadow-2xl shadow-brand-amber/50 transition-all hover:scale-110 hover:shadow-brand-amber/70 active:scale-95 lg:hidden"
          aria-label="Ver carrito"
        >
          <svg className="h-6 w-6 text-brand-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        </button>
      )}

      {/* Modal de Detalles */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
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

      {/* Modal de Crear Combo */}
      {showComboModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowComboModal(false)}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-brand-ink/90 backdrop-blur-sm" />

          {/* Modal Content */}
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
                    alert('¡Combo creado exitosamente! Puedes verlo en la página de servicios.');
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
