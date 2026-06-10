"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/data/categories";
import { PRODUCTS } from "@/data/menu";
import ProductCard from "./ProductCard";

export default function MenuPageClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "all";
  const [active, setActive] = useState<string>(initialCategory);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let items = PRODUCTS;
    if (active !== "all") items = items.filter((p) => p.category === active);
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return items;
  }, [active, query]);

  const activeCategoryName =
    active === "all"
      ? null
      : CATEGORIES.find((c) => c.id === active)?.name.replace(" Corner", "");

  return (
    <>
      {/* Sticky filter bar — offset matches header (~68 mobile / ~92 sm+) */}
      <div className="bg-black/95 backdrop-blur-md border-b border-border sticky top-[68px] sm:top-[92px] z-30">
        <div className="container-x py-3 sm:py-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <div className="relative md:w-72 shrink-0">
              <span
                aria-hidden="true"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none"
              >
                ⌕
              </span>
              <input
                type="search"
                placeholder="Search dishes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-full border border-border focus:border-brand-600 focus:ring-2 focus:ring-brand-600/30 focus:outline-none text-sm bg-surface text-white placeholder:text-muted-2 transition"
                aria-label="Search the menu"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
              <Chip
                active={active === "all"}
                onClick={() => setActive("all")}
                label="All"
              />
              {CATEGORIES.map((c) => (
                <Chip
                  key={c.id}
                  active={active === c.id}
                  onClick={() => setActive(c.id)}
                  label={c.name.replace(" Corner", "")}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container-x py-8 md:py-10">
        <div
          key={`${active}-${query}-${filtered.length}`}
          className="mb-6 text-sm text-muted animate-in fade-in slide-in-from-bottom-1 duration-300"
        >
          Showing{" "}
          <strong className="text-brand-500 tabular-nums">
            {filtered.length}
          </strong>{" "}
          {filtered.length === 1 ? "dish" : "dishes"}
          {activeCategoryName && (
            <>
              {" "}
              in{" "}
              <span className="text-white/90 font-semibold">
                {activeCategoryName}
              </span>
            </>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-3xl bg-surface/40">
            <div className="text-5xl mb-4 opacity-70">🍽️</div>
            <p className="font-display text-xl font-bold text-white">
              No dishes match.
            </p>
            <p className="text-muted mt-1.5 text-sm">
              Try a different search or clear the filter.
            </p>
            <button
              onClick={() => {
                setActive("all");
                setQuery("");
              }}
              className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-brand-500 hover:text-brand-400 transition"
            >
              Reset filters →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
        active
          ? "bg-brand-600 text-white shadow-warm ring-1 ring-brand-500"
          : "bg-surface text-white/75 hover:text-white hover:border-brand-600/60 border border-border"
      }`}
    >
      {label}
    </button>
  );
}
