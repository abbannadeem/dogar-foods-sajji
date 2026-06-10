import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { PRODUCTS, getProductBySlug, formatPKR } from "@/data/menu";
import { CATEGORY_MAP } from "@/data/categories";
import { PRIMARY_WHATSAPP } from "@/lib/constants";
import ProductCard from "@/components/ProductCard";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Not Found" };
  return {
    title: product.name,
    description: product.description,
  };
}

const SPICE_LABEL: Record<1 | 2 | 3, string> = {
  1: "Mild",
  2: "Medium",
  3: "Hot",
};

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = CATEGORY_MAP[product.category];
  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const hasImage = product.image?.startsWith("http");

  const waMsg = encodeURIComponent(
    `Salaam! I'd like to order: ${product.name} (${formatPKR(product.price)}).`
  );

  return (
    <article>
      <div className="container-x py-6 md:py-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs sm:text-sm text-muted mb-6 flex items-center gap-2 flex-wrap"
        >
          <Link href="/" className="hover:text-brand-500 transition">
            Home
          </Link>
          <span className="text-muted-2">/</span>
          <Link href="/menu" className="hover:text-brand-500 transition">
            Menu
          </Link>
          <span className="text-muted-2">/</span>
          <Link
            href={`/menu?category=${category.id}`}
            className="hover:text-brand-500 transition"
          >
            {category.name}
          </Link>
          <span className="text-muted-2">/</span>
          <span className="text-white truncate max-w-[12rem] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Main grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT — image + thumb strip */}
          <div className="md:sticky md:top-28 md:self-start">
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-brand-900/40 to-black shadow-warm">
              {hasImage ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-[10rem]">
                  {category.emoji}
                </div>
              )}
              {/* Rim light */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/5" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent" />

              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-brand-600/95 text-white text-[11px] font-bold rounded-md uppercase tracking-[0.08em] backdrop-blur-sm ring-1 ring-brand-500/60 shadow-sm">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumb strip (placeholders for now — same image) */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`relative aspect-square rounded-xl overflow-hidden border ${
                    i === 0
                      ? "border-brand-600 ring-2 ring-brand-600/30"
                      : "border-border opacity-70 hover:opacity-100 transition"
                  } bg-gradient-to-br from-brand-900/40 to-black`}
                >
                  {hasImage ? (
                    <Image
                      src={product.image}
                      alt=""
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-3xl">
                      {category.emoji}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — details */}
          <div>
            <Link
              href={`/menu?category=${category.id}`}
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-brand-500 font-bold hover:text-brand-400 transition"
            >
              <span className="h-px w-6 bg-brand-500/50" />
              {category.name}
            </Link>

            <h1 className="font-display text-4xl sm:text-5xl font-extrabold mt-3 uppercase text-white leading-[1.05]">
              {product.name}
            </h1>

            <div className="mt-5 flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-extrabold text-brand-500 tabular-nums">
                {formatPKR(product.price)}
              </span>
              {product.servings && (
                <span className="text-sm text-muted">· {product.servings}</span>
              )}
            </div>

            <p className="mt-6 text-white/85 leading-relaxed max-w-prose text-base sm:text-[17px]">
              {product.longDescription ?? product.description}
            </p>

            {/* Spice chili row */}
            {product.spiceLevel && (
              <div className="mt-6 flex items-center gap-3 text-sm">
                <span className="text-muted">Spice level</span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={`h-2 w-6 rounded-full ${
                        i <= product.spiceLevel!
                          ? "bg-brand-500"
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white/80 font-semibold">
                  {SPICE_LABEL[product.spiceLevel]}
                </span>
              </div>
            )}

            {/* Trust chips */}
            <div className="mt-6 flex flex-wrap gap-2">
              <Chip label="100% Halal" />
              <Chip label="Made to Order" />
              <Chip label="Fresh Daily" />
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                disabled
                className="btn-primary opacity-50 cursor-not-allowed"
                title="Cart coming in Phase 2"
              >
                Add to Cart (Phase 2)
              </button>
              <a
                href={`https://wa.me/${PRIMARY_WHATSAPP}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Order on WhatsApp
              </a>
            </div>

            {/* Specs */}
            <details className="mt-8 group border border-border rounded-2xl bg-surface/60 overflow-hidden">
              <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between text-sm font-bold uppercase tracking-wider text-white hover:bg-surface transition">
                <span>Details & Specs</span>
                <span
                  aria-hidden="true"
                  className="text-brand-500 transition-transform group-open:rotate-180"
                >
                  ▾
                </span>
              </summary>
              <div className="px-5 pb-5 pt-1 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <Spec label="Category" value={category.name} />
                <Spec
                  label="Spice Level"
                  value={
                    product.spiceLevel
                      ? `${SPICE_LABEL[product.spiceLevel]} (${product.spiceLevel}/3)`
                      : "Not spicy"
                  }
                />
                <Spec label="Allergens" value="Dairy, gluten (check on order)" />
                <Spec label="Prep Time" value="20–35 min" />
                {product.servings && (
                  <Spec label="Serving" value={product.servings} />
                )}
                <Spec label="Availability" value={product.available ? "Available now" : "Currently unavailable"} />
              </div>
            </details>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <TrustBadge title="100% Halal" sub="Certified meat sources" />
          <TrustBadge title="Fast Delivery" sub="Within 45 min in-zone" />
          <TrustBadge title="24/7 Phone" sub="12 PM – 4 AM daily" />
          <TrustBadge title="Money-Back" sub="Quality guarantee" />
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <div className="text-[11px] uppercase tracking-[0.3em] text-brand-500 font-bold">
                  More from {category.name}
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold mt-2 uppercase text-white">
                  You May Also Like
                </h2>
              </div>
              <Link
                href={`/menu?category=${category.id}`}
                className="hidden sm:inline text-sm font-bold text-brand-500 hover:text-brand-400 transition whitespace-nowrap"
              >
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white/85 bg-surface border border-border">
      {label}
    </span>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 pb-2">
      <span className="text-muted text-xs uppercase tracking-wider">
        {label}
      </span>
      <span className="text-white/90 text-right">{value}</span>
    </div>
  );
}

function TrustBadge({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 border-l-2 border-l-brand-600 hover:border-l-brand-500 transition">
      <div className="font-display font-bold text-white text-sm">{title}</div>
      <div className="text-xs text-muted mt-1">{sub}</div>
    </div>
  );
}
