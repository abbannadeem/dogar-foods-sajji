/**
 * One-time seed of categories + products from the legacy hardcoded data.
 * Run with:  npx prisma db seed
 * Or:        npx tsx prisma/seed.ts
 *
 * Idempotent: uses upsert so re-running is safe.
 */
import { PrismaClient, BadgeKind } from "@prisma/client";
import { CATEGORIES } from "../src/data/categories";
import { PRODUCTS } from "../src/data/menu";

const db = new PrismaClient();

const BADGE_MAP: Record<string, BadgeKind> = {
  Bestseller: "BESTSELLER",
  New: "NEW",
  Spicy: "SPICY",
  "Chef's Choice": "CHEFS_CHOICE",
};

async function main() {
  console.log("→ Seeding categories...");
  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    await db.category.upsert({
      where: { id: c.id },
      update: {
        name: c.name,
        description: c.description,
        emoji: c.emoji,
        displayOrder: i,
      },
      create: {
        id: c.id,
        name: c.name,
        description: c.description,
        emoji: c.emoji,
        displayOrder: i,
      },
    });
  }
  console.log(`  ✓ ${CATEGORIES.length} categories upserted`);

  console.log("→ Seeding products...");
  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i];
    const badge: BadgeKind = p.badge ? (BADGE_MAP[p.badge] ?? "NONE") : "NONE";
    await db.product.upsert({
      where: { id: p.id },
      update: {
        slug: p.slug,
        name: p.name,
        categoryId: p.category,
        description: p.description,
        longDescription: p.longDescription ?? null,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        image: p.image,
        badge,
        servings: p.servings ?? null,
        spiceLevel: p.spiceLevel ?? null,
        available: p.available,
        displayOrder: i,
      },
      create: {
        id: p.id,
        slug: p.slug,
        name: p.name,
        categoryId: p.category,
        description: p.description,
        longDescription: p.longDescription ?? null,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        image: p.image,
        badge,
        servings: p.servings ?? null,
        spiceLevel: p.spiceLevel ?? null,
        available: p.available,
        displayOrder: i,
      },
    });
  }
  console.log(`  ✓ ${PRODUCTS.length} products upserted`);
  console.log("\nDone. Visit /admin/menu to manage.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
