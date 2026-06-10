import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/data/categories";
import { PRODUCTS } from "@/data/menu";
import type { CategoryId } from "@/types";

const CATEGORY_IMAGES: Record<CategoryId, string> = {
  sajji:
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&q=80&auto=format&fit=crop",
  karahi:
    "https://images.unsplash.com/photo-1633945274309-2c16c9682a8c?w=1200&q=80&auto=format&fit=crop",
  bbq:
    "https://images.unsplash.com/photo-1621851709622-e19c9a4f0cc5?w=1200&q=80&auto=format&fit=crop",
  tandoor:
    "https://images.unsplash.com/photo-1627947063935-55577ec3c2e1?w=1200&q=80&auto=format&fit=crop",
  handi:
    "https://images.unsplash.com/photo-1652545296821-09a023a9fd08?w=1200&q=80&auto=format&fit=crop",
  fish:
    "https://images.unsplash.com/photo-1556814901-18c866c057da?w=1200&q=80&auto=format&fit=crop",
  rice:
    "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200&q=80&auto=format&fit=crop",
  sides:
    "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=1200&q=80&auto=format&fit=crop",
};

function countFor(id: CategoryId) {
  return PRODUCTS.filter((p) => p.category === id).length;
}

export default function CategoryStrip() {
  return (
    <section className="container-x py-16 md:py-20">
      <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-brand-500 font-bold">
            Our Menu
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black mt-2 uppercase leading-[1.05]">
            Eight Ways <br className="hidden sm:block" />
            to Taste the Heat
          </h2>
        </div>
        <p className="text-muted max-w-sm text-sm leading-relaxed">
          Hand-crafted, slow-cooked, zero shortcuts — each corner of our menu
          carries its own story from the flame.
        </p>
      </div>

      {/* Mobile: horizontal scroll. Desktop: grid. */}
      <div className="-mx-4 px-4 lg:mx-0 lg:px-0 overflow-x-auto lg:overflow-visible scrollbar-hide">
        <div className="flex lg:grid lg:grid-cols-4 gap-4 snap-x snap-mandatory lg:snap-none pb-2 lg:pb-0">
          {CATEGORIES.map((c) => {
            const count = countFor(c.id);
            return (
              <Link
                key={c.id}
                href={`/menu?category=${c.id}`}
                className="group relative shrink-0 w-[220px] sm:w-[260px] lg:w-auto snap-start aspect-[16/10] rounded-2xl overflow-hidden border border-border hover:border-brand-600 transition-all duration-300 hover:scale-[1.03] hover:shadow-warm"
              >
                <Image
                  src={CATEGORY_IMAGES[c.id]}
                  alt={`${c.name} category`}
                  fill
                  sizes="(min-width: 1024px) 280px, 260px"
                  quality={80}
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Dark gradient overlay bottom -> top */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="font-display text-lg sm:text-xl font-extrabold uppercase text-white leading-tight tracking-tight">
                    {c.name.replace(" Corner", "")}
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-brand-400 font-bold mt-1">
                    {count} {count === 1 ? "dish" : "dishes"}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
