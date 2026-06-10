import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { hasDb } from "@/lib/admin-orders";
import { getAllCategories } from "@/lib/menu-db";
import ProductForm, { type ProductFormInitial } from "@/components/admin/ProductForm";
import { updateProductAction } from "@/app/admin/menu/actions";

export const dynamic = "force-dynamic";

type Params = { id: string };

export default async function EditProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;

  if (!hasDb()) {
    return (
      <div className="space-y-6">
        <Link href="/admin/menu" className="text-xs uppercase tracking-wider text-muted hover:text-brand-500">
          ← All products
        </Link>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-sm">
          Database not connected. Cannot edit products.
        </div>
      </div>
    );
  }

  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    getAllCategories(),
  ]);

  if (!product) notFound();

  const initial: ProductFormInitial = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    categoryId: product.categoryId,
    description: product.description,
    longDescription: product.longDescription,
    price: product.price,
    oldPrice: product.oldPrice,
    image: product.image,
    badge: product.badge,
    servings: product.servings,
    spiceLevel: product.spiceLevel,
    available: product.available,
    displayOrder: product.displayOrder,
  };

  const submitFn = updateProductAction.bind(null, product.id);

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
          Edit · {product.name}
        </h1>
        <div className="text-xs text-muted mt-1">ID: {product.id}</div>
      </div>

      <ProductForm
        mode="edit"
        initial={initial}
        categories={categories.map((c) => ({ id: c.id, name: `${c.emoji} ${c.name}` }))}
        submit={submitFn}
      />
    </div>
  );
}
