"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { useCart } from "@/lib/cart-context";
import { useCartDrawer } from "@/components/CartDrawer";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80&auto=format&fit=crop";

export default function AddToCartButton({
  product,
  variant = "primary",
  size = "md",
  showOpenDrawer = true,
  className = "",
  children,
}: {
  product: Product;
  variant?: "primary" | "icon";
  size?: "sm" | "md" | "lg";
  showOpenDrawer?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const { add } = useCart();
  const { open } = useCartDrawer();
  const [busy, setBusy] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);

    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image:
        product.image && product.image.startsWith("http")
          ? product.image
          : FALLBACK_IMG,
    });

    toast.success(`${product.name} added to cart`, {
      action: showOpenDrawer
        ? {
            label: "View cart",
            onClick: () => open(),
          }
        : undefined,
      duration: 2500,
    });

    setTimeout(() => setBusy(false), 400);
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleAdd}
        disabled={busy}
        aria-label={`Add ${product.name} to cart`}
        className={`grid place-items-center w-10 h-10 rounded-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white transition shadow-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${className}`}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    );
  }

  const sizeClasses =
    size === "sm"
      ? "text-xs px-3 py-2"
      : size === "lg"
        ? "text-base px-6 py-3"
        : "text-sm px-5 py-2.5";

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={busy}
      className={`btn-primary justify-center disabled:opacity-50 ${sizeClasses} ${className}`}
    >
      {busy ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="w-4 h-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
            <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          Adding...
        </span>
      ) : (
        children ?? "Add to Cart"
      )}
    </button>
  );
}
