import Link from "next/link";
import { getFeaturedProducts } from "@/lib/menu-db";
import ProductCard from "./ProductCard";

export default async function FeaturedItems() {
  const products = await getFeaturedProducts(6);
  if (products.length === 0) return null;

  return (
    <section className="container-x py-16 md:py-20">
      <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-brand-500 font-bold">
            Most Loved
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black mt-2 uppercase leading-[1.05] tracking-tight">
            What&apos;s Flying <br className="hidden sm:block" />
            Off the Grill
          </h2>
        </div>
        <Link
          href="/menu"
          className="group inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-brand-500 font-bold hover:text-brand-400 transition"
        >
          See full menu
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
