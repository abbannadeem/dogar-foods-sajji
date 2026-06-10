"use client";

import { useCart } from "@/lib/cart-context";
import { useCartDrawer } from "@/components/CartDrawer";

export default function CartIcon({
  className = "",
}: {
  className?: string;
}) {
  const { count } = useCart();
  const { open } = useCartDrawer();

  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Open cart (${count} item${count === 1 ? "" : "s"})`}
      className={`relative inline-grid place-items-center w-11 h-11 rounded-full hover:bg-white/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
      </svg>
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 min-w-[20px] h-[20px] px-1 grid place-items-center text-[10px] font-bold rounded-full bg-brand-600 text-white border-2 border-black"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
