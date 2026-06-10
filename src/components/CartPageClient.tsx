"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatPKR } from "@/data/menu";

export default function CartPageClient() {
  const {
    items,
    subtotal,
    increment,
    decrement,
    remove,
    setQty,
    clear,
    isHydrated,
  } = useCart();

  // SSR-safe loading state
  if (!isHydrated) {
    return (
      <div className="container-x py-20 text-center">
        <div className="inline-block w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-x py-20 text-center">
        <div className="text-7xl mb-4">🛒</div>
        <h2 className="font-display text-3xl font-extrabold uppercase">
          Cart is <span className="text-brand-500">Empty</span>
        </h2>
        <p className="text-muted mt-3 max-w-md mx-auto">
          Looks like you haven&apos;t added anything yet. Browse the menu and add
          your favourites.
        </p>
        <Link href="/menu" className="btn-primary mt-6 inline-flex">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-10">
      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        {/* LEFT — items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold uppercase">
              {items.length} item{items.length === 1 ? "" : "s"}
            </h2>
            <button
              type="button"
              onClick={() => {
                if (confirm("Remove all items from cart?")) clear();
              }}
              className="text-xs uppercase tracking-wider text-muted hover:text-brand-500 transition"
            >
              Clear all
            </button>
          </div>

          <ul className="bg-surface border border-border rounded-2xl divide-y divide-border overflow-hidden">
            {items.map((item) => (
              <li key={item.productId} className="p-4 sm:p-5 flex gap-4">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden border border-border bg-black">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-3">
                    <Link
                      href={`/menu/${item.slug}`}
                      className="font-display text-lg font-bold text-white hover:text-brand-500 transition leading-tight line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(item.productId)}
                      aria-label={`Remove ${item.name}`}
                      className="text-white/40 hover:text-brand-500 shrink-0 p-1"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-sm text-brand-500 font-bold mt-1">
                    {formatPKR(item.price)} each
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
                    <div className="inline-flex items-center border border-border rounded-full overflow-hidden">
                      <button
                        type="button"
                        onClick={() => decrement(item.productId)}
                        aria-label="Decrease quantity"
                        className="w-9 h-9 grid place-items-center hover:bg-brand-600/20 transition text-lg"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10);
                          if (!Number.isNaN(v)) setQty(item.productId, v);
                        }}
                        aria-label={`Quantity for ${item.name}`}
                        className="w-12 text-center bg-transparent text-sm font-bold tabular-nums focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() => increment(item.productId)}
                        aria-label="Increase quantity"
                        className="w-9 h-9 grid place-items-center hover:bg-brand-600/20 transition text-lg"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-lg font-extrabold text-white tabular-nums">
                      {formatPKR(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/menu"
            className="mt-5 inline-flex items-center gap-2 text-sm text-muted hover:text-brand-500 transition"
          >
            ← Continue shopping
          </Link>
        </div>

        {/* RIGHT — summary */}
        <aside className="bg-surface border border-border rounded-2xl p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-xl font-extrabold uppercase mb-4">
            Order Summary
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-bold tabular-nums">{formatPKR(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd className="text-muted text-xs">Calculated at checkout</dd>
            </div>
            <div className="border-t border-border pt-3 flex justify-between text-lg">
              <dt className="font-display font-bold">Total</dt>
              <dd className="font-display font-extrabold text-brand-500 tabular-nums">
                {formatPKR(subtotal)}
              </dd>
            </div>
          </dl>

          <Link
            href="/checkout"
            className="btn-primary justify-center w-full mt-6"
          >
            Proceed to Checkout
          </Link>

          <div className="mt-5 text-center text-xs text-muted space-y-1">
            <div>✓ 100% Halal · Made fresh to order</div>
            <div>✓ Cash on Delivery available</div>
            <div>✓ Order on WhatsApp also available</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
