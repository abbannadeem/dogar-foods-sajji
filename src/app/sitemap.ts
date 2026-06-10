import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/menu-db";
import { SITE } from "@/lib/constants";

const BASE = `https://${SITE.domain}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/menu`, changeFrequency: "daily", priority: 0.95 },
    { url: `${BASE}/branches`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const productPages: MetadataRoute.Sitemap = products
    .filter((p) => p.available)
    .map((p) => ({
      url: `${BASE}/menu/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticPages, ...productPages];
}
