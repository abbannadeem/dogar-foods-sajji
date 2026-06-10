import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { formatPKR } from "@/data/menu";

const BADGE_STYLES: Record<string, string> = {
  Bestseller: "bg-brand-600/95 text-white ring-1 ring-brand-500/50",
  New: "bg-emerald-600/95 text-white ring-1 ring-emerald-400/50",
  Spicy: "bg-black/80 text-brand-400 ring-1 ring-brand-500/70",
  "Chef's Choice": "bg-accent-500/95 text-black ring-1 ring-accent-400/50",
};

const CATEGORY_EMOJI: Record<string, string> = {
  sajji: "🍗",
  karahi: "🥘",
  handi: "🍲",
  bbq: "🍢",
  tandoor: "🔥",
  fish: "🐟",
  rice: "🍚",
  sides: "🫓",
};

function SpiceDots({ level }: { level: 1 | 2 | 3 }) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Spice level ${level} of 3`}
      title={`Spice level ${level} of 3`}
    >
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-3 rounded-full transition ${
            i <= level
              ? i === 3
                ? "bg-brand-500"
                : i === 2
                  ? "bg-brand-500/80"
                  : "bg-brand-500/60"
              : "bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const hasImage = product.image?.startsWith("http");

  return (
    <Link
      href={`/menu/${product.slug}`}
      className="group block bg-surface rounded-2xl overflow-hidden border border-border hover:border-brand-600 hover:shadow-warm transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-border bg-gradient-to-br from-brand-900/50 to-black">
        {hasImage ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-6xl opacity-60 group-hover:scale-105 transition-transform duration-700">
            {CATEGORY_EMOJI[product.category] ?? "🍽️"}
          </div>
        )}

        {/* gradient overlay for text contrast on hover */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {product.badge && (
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.08em] backdrop-blur-sm shadow-sm ${
              BADGE_STYLES[product.badge] ?? "bg-brand-600 text-white"
            }`}
          >
            {product.badge}
          </span>
        )}

        {product.spiceLevel && product.spiceLevel >= 2 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-black/65 backdrop-blur-sm px-2 py-1.5 ring-1 ring-white/10">
            <SpiceDots level={product.spiceLevel} />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg font-bold text-white group-hover:text-brand-500 transition leading-tight">
          {product.name}
        </h3>
        <p className="text-sm text-muted mt-1.5 line-clamp-2 leading-snug">
          {product.description}
        </p>
        <div className="mt-3.5 flex items-end justify-between gap-2">
          <div>
            <span className="text-lg font-extrabold text-brand-500">
              {formatPKR(product.price)}
            </span>
            {product.servings && (
              <div className="text-[11px] text-muted-2 mt-0.5">
                {product.servings}
              </div>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white/80 group-hover:text-brand-500 transition">
            View
            <span
              aria-hidden="true"
              className="inline-block translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
            >
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
