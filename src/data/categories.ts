/**
 * Backwards-compat wrapper. Static categories live in `./categories-static.ts`.
 * Server components that want DB-backed values use `@/lib/menu-db`.
 */
import { CATEGORIES_STATIC } from "./categories-static";
import type { Category } from "@/types";

export const CATEGORIES = CATEGORIES_STATIC;

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES_STATIC.map((c) => [c.id, c])
);
