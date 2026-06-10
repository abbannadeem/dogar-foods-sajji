import Link from "next/link";
import { hasDb } from "@/lib/admin-orders";
import { getAllCategories } from "@/lib/menu-db";
import ProductForm from "@/components/admin/ProductForm";
import { createProductAction } from "@/app/admin/menu/actions";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <Link
          href="/admin/menu"
          className="text-xs uppercase tracking-wider text-muted hover:text-brand-500"
        >
          ← All products
        </Link>
        <h1 className="font-display text-3xl font-extrabold uppercase mt-2">
          New Product
        </h1>
      </div>

      {!hasDb() && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-sm">
          Database not connected. Set <code>DATABASE_URL</code> first.
        </div>
      )}

      <ProductForm
        mode="create"
        categories={categories.map((c) => ({ id: c.id, name: `${c.emoji} ${c.name}` }))}
        submit={createProductAction}
      />
    </div>
  );
}
