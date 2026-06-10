"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatPKR } from "@/data/menu";

type DrawerContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

function DrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);
  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}

export function useCartDrawer(): DrawerContextValue {
  const ctx = useContext(DrawerContext);
  if (!ctx) {
    // Provider not yet mounted (during SSR snapshot etc.) — no-ops are safe.
    return { isOpen: false, open: () => {}, close: () => {} };
  }
  return ctx;
}

export default function CartDrawer() {
  return (
    <DrawerProvider>
      <DrawerBody />
    </DrawerProvider>
  );
}

function DrawerBody() {
  const { isOpen, close } = useCartDrawer();
  const { items, subtotal, increment, decrement, remove, count } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-black border-l border-border shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-display text-xl font-extrabold uppercase">
            Your Cart{" "}
            <span className="text-brand-500">
              ({count} {count === 1 ? "item" : "items"})
            </span>
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close cart"
            className="w-10 h-10 grid place-items-center rounded-full text-white hover:bg-white/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex-1 grid place-items-center px-6 text-center">
            <div>
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="font-display text-2xl font-bold">Your cart is empty</h3>
              <p className="text-muted mt-2 text-sm">
                Browse the menu and add your favourites.
              </p>
              <Link
                href="/menu"
                onClick={close}
                className="btn-primary mt-6 inline-flex"
              >
                Browse Menu
              </Link>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto divide-y divide-border">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3 p-4">
                  <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-border bg-surface">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <Link
                        href={`/menu/${item.slug}`}
                        onClick={close}
                        className="font-display font-bold text-white hover:text-brand-500 transition line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(item.productId)}
                        aria-label={`Remove ${item.name}`}
                        className="text-white/40 hover:text-brand-500 shrink-0"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="w-4 h-4"
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
                      {formatPKR(item.price)}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center border border-border rounded-full overflow-hidden">
                        <button
                          type="button"
                          onClick={() => decrement(item.productId)}
                          aria-label="Decrease"
                          className="w-8 h-8 grid place-items-center hover:bg-brand-600/20 transition"
                        >
                          −
                        </button>
                        <span className="px-3 text-sm font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increment(item.productId)}
                          aria-label="Increase"
                          className="w-8 h-8 grid place-items-center hover:bg-brand-600/20 transition"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-sm font-bold tabular-nums">
                        {formatPKR(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="border-t border-border p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-bold tabular-nums">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-lg pt-2 border-t border-border">
                <span className="font-display font-bold">Total</span>
                <span className="font-display font-extrabold text-brand-500 tabular-nums">
                  {formatPKR(subtotal)}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={close}
                className="btn-primary justify-center w-full"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={close}
                className="block text-center text-sm text-muted hover:text-brand-500 transition"
              >
                View full cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
