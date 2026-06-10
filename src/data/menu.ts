/**
 * Backwards-compat wrapper.
 *
 * Static data lives in `./menu-static.ts`. Server components that need
 * up-to-date data (reflecting admin edits) should import async helpers from
 * `@/lib/menu-db`. Sync consumers (client components, seed scripts, OG image)
 * still get the hardcoded snapshot via the re-exports below.
 */
export {
  PRODUCTS_STATIC as PRODUCTS,
  formatPKR,
  getProductBySlug,
  getProductsByCategory,
  getFeaturedProducts,
} from "./menu-static";
