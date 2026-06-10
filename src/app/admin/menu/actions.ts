"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { BadgeKind } from "@prisma/client";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base || "item";
  let n = 1;
  // simple bounded loop
  for (let attempt = 0; attempt < 50; attempt++) {
    const existing = await db.product.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    n++;
    slug = `${base}-${n}`;
  }
  return `${base}-${Date.now()}`;
}

function asInt(v: FormDataEntryValue | null, fallback = 0): number {
  if (typeof v !== "string") return fallback;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

function asStr(v: FormDataEntryValue | null, max = 5000): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

function asOptStr(v: FormDataEntryValue | null, max = 5000): string | null {
  const s = asStr(v, max);
  return s.length === 0 ? null : s;
}

function asBadge(v: FormDataEntryValue | null): BadgeKind {
  const s = typeof v === "string" ? v.toUpperCase() : "";
  switch (s) {
    case "BESTSELLER":
    case "NEW":
    case "SPICY":
    case "CHEFS_CHOICE":
      return s as BadgeKind;
    default:
      return "NONE";
  }
}

function asSpice(v: FormDataEntryValue | null): number | null {
  if (typeof v !== "string" || v === "") return null;
  const n = parseInt(v, 10);
  if (n === 1 || n === 2 || n === 3) return n;
  return null;
}

function revalidateMenu(slug?: string) {
  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  if (slug) revalidatePath(`/menu/${slug}`);
}

// ────────── PRODUCT ──────────

export type ProductFormResult = { ok: true; id: string } | { ok: false; error: string };

export async function createProductAction(formData: FormData): Promise<ProductFormResult> {
  const name = asStr(formData.get("name"), 200);
  const categoryId = asStr(formData.get("categoryId"), 60);
  const price = asInt(formData.get("price"));

  if (name.length < 2) return { ok: false, error: "Name is required" };
  if (!categoryId) return { ok: false, error: "Category is required" };
  if (price <= 0) return { ok: false, error: "Price must be greater than 0" };

  const cat = await db.category.findUnique({ where: { id: categoryId } });
  if (!cat) return { ok: false, error: "Invalid category" };

  const baseSlug = slugify(asStr(formData.get("slug"), 80) || name);
  const slug = await uniqueSlug(baseSlug);
  const id = `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

  try {
    const created = await db.product.create({
      data: {
        id,
        slug,
        name,
        categoryId,
        description: asStr(formData.get("description"), 500),
        longDescription: asOptStr(formData.get("longDescription"), 2000),
        price,
        oldPrice: asInt(formData.get("oldPrice")) || null,
        image: asStr(formData.get("image"), 800),
        badge: asBadge(formData.get("badge")),
        servings: asOptStr(formData.get("servings"), 100),
        spiceLevel: asSpice(formData.get("spiceLevel")),
        available: formData.get("available") === "on",
        displayOrder: asInt(formData.get("displayOrder")),
      },
    });
    revalidateMenu(created.slug);
    return { ok: true, id: created.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to create product" };
  }
}

export async function updateProductAction(id: string, formData: FormData): Promise<ProductFormResult> {
  const name = asStr(formData.get("name"), 200);
  const categoryId = asStr(formData.get("categoryId"), 60);
  const price = asInt(formData.get("price"));

  if (name.length < 2) return { ok: false, error: "Name is required" };
  if (!categoryId) return { ok: false, error: "Category is required" };
  if (price <= 0) return { ok: false, error: "Price must be greater than 0" };

  const cat = await db.category.findUnique({ where: { id: categoryId } });
  if (!cat) return { ok: false, error: "Invalid category" };

  const existing = await db.product.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Product not found" };

  let slug = existing.slug;
  const slugInput = asStr(formData.get("slug"), 80);
  if (slugInput && slugInput !== existing.slug) {
    slug = await uniqueSlug(slugify(slugInput), existing.id);
  }

  try {
    const updated = await db.product.update({
      where: { id },
      data: {
        slug,
        name,
        categoryId,
        description: asStr(formData.get("description"), 500),
        longDescription: asOptStr(formData.get("longDescription"), 2000),
        price,
        oldPrice: asInt(formData.get("oldPrice")) || null,
        image: asStr(formData.get("image"), 800),
        badge: asBadge(formData.get("badge")),
        servings: asOptStr(formData.get("servings"), 100),
        spiceLevel: asSpice(formData.get("spiceLevel")),
        available: formData.get("available") === "on",
        displayOrder: asInt(formData.get("displayOrder")),
      },
    });
    revalidateMenu(existing.slug);
    if (existing.slug !== updated.slug) revalidateMenu(updated.slug);
    return { ok: true, id: updated.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to update product" };
  }
}

export async function deleteProductAction(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) return { ok: false, error: "Product not found" };
    await db.product.delete({ where: { id } });
    revalidateMenu(existing.slug);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to delete" };
  }
}

export async function toggleAvailabilityAction(id: string): Promise<{ ok: true; available: boolean } | { ok: false; error: string }> {
  try {
    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) return { ok: false, error: "Product not found" };
    const updated = await db.product.update({
      where: { id },
      data: { available: !existing.available },
    });
    revalidateMenu(existing.slug);
    return { ok: true, available: updated.available };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to toggle" };
  }
}

export async function redirectToProducts() {
  redirect("/admin/menu");
}

// ────────── CATEGORY ──────────

export async function upsertCategoryAction(formData: FormData): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const idInput = asStr(formData.get("id"), 60);
  const name = asStr(formData.get("name"), 100);
  const description = asStr(formData.get("description"), 300);
  const emoji = asStr(formData.get("emoji"), 8) || "🍽️";
  const displayOrder = asInt(formData.get("displayOrder"));

  if (name.length < 2) return { ok: false, error: "Name is required" };

  let id = idInput || slugify(name);
  if (!id) return { ok: false, error: "ID could not be generated" };

  try {
    const saved = await db.category.upsert({
      where: { id },
      update: { name, description, emoji, displayOrder },
      create: { id, name, description, emoji, displayOrder },
    });
    revalidateMenu();
    revalidatePath("/admin/menu/categories");
    return { ok: true, id: saved.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to save category" };
  }
}

export async function deleteCategoryAction(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const products = await db.product.count({ where: { categoryId: id } });
    if (products > 0) {
      return {
        ok: false,
        error: `Cannot delete — ${products} product${products === 1 ? "" : "s"} still use this category. Move or delete them first.`,
      };
    }
    await db.category.delete({ where: { id } });
    revalidateMenu();
    revalidatePath("/admin/menu/categories");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to delete" };
  }
}
