import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { hasDb } from "@/lib/admin-orders";
import { formatPKR } from "@/data/menu-static";
import { getAllCategories } from "@/lib/menu-db";
import MenuRowActions from "@/components/admin/MenuRowActions";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const cat = sp.category ?? "ALL";

  const categories = await getAllCategories();
  const products = hasDb()
    ? await db.product.findMany({
        where: {
          ...(cat !== "ALL" ? { categoryId: cat } : {}),
          ...(q
            ? {
                OR: [
                  { name: { contains: q, mode: "insensitive" } },
                  { slug: { contains: q, mode: "insensitive" } },
                ],
              }
            : {}),
        },
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
        include: { category: true },
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-extrabold uppercase">
            Menu
          </h1>
          <p className="text-sm text-muted mt-1">
            {products.length} {products.length === 1 ? "product" : "products"} ·{" "}
            <Link href="/admin/menu/categories" className="hover:text-brand-500 underline">
              Manage categories ({categories.length})
            </Link>
          </p>
        </div>
        <Link href="/admin/menu/new" className="btn-primary text-sm">
          + Add Product
        </Link>
      </div>

      {!hasDb() && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-sm space-y-2">
          <div className="font-bold text-amber-400 uppercase text-xs tracking-wider">
            Database not connected
          </div>
          <p className="text-white/80">
            Menu management needs a database. The public site is currently
            serving the hardcoded fallback (27 products from{" "}
            <code className="text-amber-400">src/data/menu-static.ts</code>).
            Once you set <code className="text-amber-400">DATABASE_URL</code>{" "}
            and run <code className="text-amber-400">npx prisma db push</code>{" "}
            + <code className="text-amber-400">npx prisma db seed</code>, you
            can edit products here.
          </p>
        </div>
      )}

      {/* Filter bar */}
      <form className="bg-surface border border-border rounded-2xl p-3 flex flex-wrap items-center gap-2">
        <input
          type="search"
          name="q"
          placeholder="Search by name or slug..."
          defaultValue={q}
          className="flex-1 min-w-[200px] px-4 py-2 rounded-lg bg-background border border-border focus:border-brand-600 focus:outline-none text-sm"
        />
        <select
          name="category"
          defaultValue={cat}
          className="px-3 py-2 rounded-lg bg-background border border-border focus:border-brand-600 focus:outline-none text-sm"
        >
          <option value="ALL">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.emoji} {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-3 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold uppercase tracking-wider transition"
        >
          Apply
        </button>
      </form>

      {/* Table */}
      <section className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[80px_1.5fr_1fr_0.7fr_0.5fr_0.5fr_auto] gap-3 px-5 py-3 text-[10px] uppercase tracking-[0.18em] font-bold text-muted border-b border-border">
          <div></div>
          <div>Product</div>
          <div>Category</div>
          <div className="text-right">Price</div>
          <div className="text-center">Badge</div>
          <div className="text-center">Status</div>
          <div></div>
        </div>

        {products.length === 0 ? (
          <div className="p-12 text-center text-muted text-sm">
            {hasDb() ? (
              <>
                No products found.{" "}
                <Link href="/admin/menu/new" className="text-brand-500 hover:underline">
                  Add the first one →
                </Link>
              </>
            ) : (
              "Products will appear here once DB is connected."
            )}
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {products.map((p) => (
              <li
                key={p.id}
                className="grid grid-cols-[64px_1fr_auto] md:grid-cols-[80px_1.5fr_1fr_0.7fr_0.5fr_0.5fr_auto] gap-3 items-center px-5 py-3 hover:bg-white/[0.02] transition"
              >
                <div className="relative w-16 h-16 rounded-md overflow-hidden border border-border bg-black">
                  {p.image && p.image.startsWith("http") ? (
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-2xl">
                      🍽️
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/admin/menu/${p.id}/edit`}
                    className="font-bold text-white hover:text-brand-500 truncate block"
                  >
                    {p.name}
                  </Link>
                  <div className="text-[11px] text-muted truncate">/{p.slug}</div>
                </div>
                <div className="hidden md:block text-sm text-white/80 truncate">
                  {p.category.emoji} {p.category.name}
                </div>
                <div className="hidden md:block text-right text-sm font-bold tabular-nums text-brand-500">
                  {formatPKR(p.price)}
                </div>
                <div className="hidden md:block text-center text-[10px] uppercase tracking-wider font-bold text-muted">
                  {p.badge === "NONE" ? "—" : p.badge.replace("_", " ")}
                </div>
                <div className="hidden md:block text-center">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      p.available ? "bg-emerald-500" : "bg-red-500"
                    }`}
                    title={p.available ? "Available" : "Hidden"}
                  />
                </div>
                <MenuRowActions
                  id={p.id}
                  available={p.available}
                />
                {/* Mobile sub-row */}
                <div className="md:hidden col-span-3 -mt-1.5 text-xs text-muted flex items-center gap-3">
                  <span>{p.category.emoji} {p.category.name}</span>
                  <span className="font-bold text-brand-500">{formatPKR(p.price)}</span>
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      p.available ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
