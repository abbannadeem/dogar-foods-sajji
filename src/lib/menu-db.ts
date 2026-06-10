/**
 * Single source of truth for the menu. Prefers the database when available,
 * falls back to the hardcoded constants in src/data/* so local dev and
 * un-configured deployments still work.
 *
 * The hardcoded constants live in src/data/menu-static.ts and src/data/categories-static.ts
 * (renamed from the old src/data/menu.ts so we can re-export from the same names).
 */
import { db } from "@/lib/db";
import { PRODUCTS_STATIC, formatPKR } from "@/data/menu-static";
import { CATEGORIES_STATIC } from "@/data/categories-static";
import type { Product, Category } from "@/types";

function hasDb(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

const BADGE_DB_TO_UI: Record<string, Product["badge"]> = {
  BESTSELLER: "Bestseller",
  NEW: "New",
  SPICY: "Spicy",
  CHEFS_CHOICE: "Chef's Choice",
};

export async function getAllCategories(): Promise<Category[]> {
  if (!hasDb()) return CATEGORIES_STATIC;
  try {
    const rows = await db.category.findMany({
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });
    if (rows.length === 0) return CATEGORIES_STATIC;
    return rows.map((c) => ({
      id: c.id as Category["id"],
      name: c.name,
      description: c.description,
      emoji: c.emoji,
    }));
  } catch {
    return CATEGORIES_STATIC;
  }
}

export async function getCategoryMap(): Promise<Record<string, Category>> {
  const list = await getAllCategories();
  return Object.fromEntries(list.map((c) => [c.id, c]));
}

export async function getAllProducts(): Promise<Product[]> {
  if (!hasDb()) return PRODUCTS_STATIC;
  try {
    const rows = await db.product.findMany({
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });
    if (rows.length === 0) return PRODUCTS_STATIC;
    return rows.map(rowToProduct);
  } catch {
    return PRODUCTS_STATIC;
  }
}

export async function getAvailableProducts(): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.available);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!hasDb()) return PRODUCTS_STATIC.find((p) => p.slug === slug) ?? null;
  try {
    const row = await db.product.findUnique({ where: { slug } });
    if (!row) return PRODUCTS_STATIC.find((p) => p.slug === slug) ?? null;
    return rowToProduct(row);
  } catch {
    return PRODUCTS_STATIC.find((p) => p.slug === slug) ?? null;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!hasDb()) return PRODUCTS_STATIC.find((p) => p.id === id) ?? null;
  try {
    const row = await db.product.findUnique({ where: { id } });
    if (!row) return PRODUCTS_STATIC.find((p) => p.id === id) ?? null;
    return rowToProduct(row);
  } catch {
    return PRODUCTS_STATIC.find((p) => p.id === id) ?? null;
  }
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const all = await getAvailableProducts();
  return all.filter((p) => p.category === categoryId);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const all = await getAvailableProducts();
  return all.filter((p) => p.badge).slice(0, limit);
}

function rowToProduct(row: {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  description: string;
  longDescription: string | null;
  price: number;
  oldPrice: number | null;
  image: string;
  badge: string;
  servings: string | null;
  spiceLevel: number | null;
  available: boolean;
}): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.categoryId as Product["category"],
    description: row.description,
    longDescription: row.longDescription ?? undefined,
    price: row.price,
    oldPrice: row.oldPrice ?? undefined,
    image: row.image,
    badge: BADGE_DB_TO_UI[row.badge],
    servings: row.servings ?? undefined,
    spiceLevel:
      row.spiceLevel === 1 || row.spiceLevel === 2 || row.spiceLevel === 3
        ? row.spiceLevel
        : undefined,
    available: row.available,
  };
}

export { formatPKR };
