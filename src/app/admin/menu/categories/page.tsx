import Link from "next/link";
import { db } from "@/lib/db";
import { hasDb } from "@/lib/admin-orders";
import { getAllCategories } from "@/lib/menu-db";
import CategoriesEditor from "@/components/admin/CategoriesEditor";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getAllCategories();
  const counts = hasDb()
    ? Object.fromEntries(
        (
          await db.product.groupBy({
            by: ["categoryId"],
            _count: { _all: true },
          })
        ).map((g) => [g.categoryId, g._count._all])
      )
    : {};

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link href="/admin/menu" className="text-xs uppercase tracking-wider text-muted hover:text-brand-500">
          ← Back to menu
        </Link>
        <h1 className="font-display text-3xl font-extrabold uppercase mt-2">
          Categories
        </h1>
        <p className="text-sm text-muted mt-1">
          {categories.length} {categories.length === 1 ? "category" : "categories"}
        </p>
      </div>

      {!hasDb() && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-sm">
          Database not connected. Showing static categories — editing disabled.
        </div>
      )}

      <CategoriesEditor
        initial={categories.map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description,
          emoji: c.emoji,
          productCount: counts[c.id] ?? 0,
        }))}
      />
    </div>
  );
}
