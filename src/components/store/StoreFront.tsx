import { useMemo, useState } from 'react';
import type { Product } from '../../data/products';

type CartItem = Product & { quantity: number };

const WHATSAPP_NUMBER = '573000000000';

const currency = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

interface StoreFrontProps {
  products: Product[];
}

export default function StoreFront({ products }: StoreFrontProps) {
  const [cart, setCart] = useState<CartItem[]>([]);

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

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article
            key={product.id}
            className="flex h-full flex-col justify-between rounded-3xl border border-brand-stone/60 bg-brand-night/80 p-6 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-brand-amber/60 hover:shadow-brand-amber/20"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand-amber/80">
                {product.category}
              </p>
              <h3 className="mt-3 text-lg font-black text-brand-light">{product.name}</h3>
              <p className="mt-3 text-sm text-brand-light/70">{product.description}</p>
            </div>
            <div className="mt-6 flex items-end justify-between">
              <p className="text-lg font-semibold text-brand-amber">{currency.format(product.price)}</p>
              <button
                type="button"
                onClick={() => handleAddToCart(product)}
                className="rounded-full border border-brand-amber/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-amber transition hover:bg-brand-amber hover:text-brand-ink"
              >
                Añadir
              </button>
            </div>
          </article>
        ))}
      </div>
      <aside className="h-max rounded-3xl border border-brand-stone/60 bg-brand-stone/30 p-6 backdrop-blur">
        <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-amber">
          Carrito Upper
        </h2>
        {cart.length === 0 ? (
          <p className="mt-6 text-sm text-brand-light/70">
            Agrega tus productos favoritos y envíalos por WhatsApp para coordinar pago y entrega.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-brand-stone/60 bg-brand-ink/60 p-4 backdrop-blur"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-brand-light">{item.name}</p>
                    <p className="text-xs text-brand-light/60">{currency.format(item.price)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="text-xs uppercase tracking-[0.3em] text-brand-light/40 transition hover:text-red-400"
                  >
                    Quitar
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleDecrease(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-amber/40 text-brand-amber transition hover:bg-brand-amber hover:text-brand-ink"
                    >
                      -
                    </button>
                    <span className="text-sm font-semibold text-brand-light">{item.quantity}</span>
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
        <div className="mt-6 border-t border-brand-stone/60 pt-4">
          <div className="flex items-center justify-between text-sm text-brand-light/70">
            <span>Total estimado</span>
            <span className="text-lg font-semibold text-brand-amber">
              {currency.format(total)}
            </span>
          </div>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="mt-5 block rounded-full border border-brand-amber bg-brand-amber px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.3em] text-brand-ink transition hover:bg-transparent hover:text-brand-amber"
          >
            Finalizar por WhatsApp
          </a>
          <p className="mt-3 text-[11px] leading-relaxed text-brand-light/50">
            El pedido se confirma por WhatsApp. Los precios pueden variar según disponibilidad. Nuestro equipo te
            contactará para coordinar pago, envío o recogida en el local.
          </p>
        </div>
      </aside>
    </div>
  );
}


