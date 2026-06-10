/**
 * Server-side analytics queries. All callers must be in the auth-protected /admin tree.
 */
import { db } from "@/lib/db";
import { BRANCHES } from "@/lib/constants";
import { hasDb } from "@/lib/admin-orders";

export type DailySalesPoint = {
  date: string; // YYYY-MM-DD
  label: string; // "Mon 19", etc.
  orders: number;
  revenue: number;
};

export type TopProduct = {
  productId: string;
  productSlug: string;
  productName: string;
  unitsSold: number;
  revenue: number;
};

export type BranchPerf = {
  branchId: string;
  branchName: string;
  orders: number;
  revenue: number;
};

export type StatusBreakdown = Record<string, number>;

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function dateKey(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function shortLabel(d: Date): string {
  return d.toLocaleDateString("en-PK", {
    weekday: "short",
    day: "numeric",
  });
}

export async function getDailySales(days = 7): Promise<DailySalesPoint[]> {
  if (!hasDb()) return [];
  const since = startOfDay(new Date());
  since.setDate(since.getDate() - (days - 1));

  const orders = await db.order.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true, total: true },
  });

  // Build a key-indexed bucket so missing days show as zero.
  const buckets = new Map<string, DailySalesPoint>();
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    buckets.set(dateKey(d), {
      date: dateKey(d),
      label: shortLabel(d),
      orders: 0,
      revenue: 0,
    });
  }
  for (const o of orders) {
    const key = dateKey(o.createdAt);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.orders += 1;
      bucket.revenue += o.total;
    }
  }
  return [...buckets.values()];
}

export async function getTopProducts(limit = 5): Promise<TopProduct[]> {
  if (!hasDb()) return [];
  const groups = await db.orderItem.groupBy({
    by: ["productId", "productSlug", "productName"],
    _sum: { quantity: true, lineTotal: true },
    orderBy: { _sum: { lineTotal: "desc" } },
    take: limit,
  });
  return groups.map((g) => ({
    productId: g.productId,
    productSlug: g.productSlug,
    productName: g.productName,
    unitsSold: g._sum.quantity ?? 0,
    revenue: g._sum.lineTotal ?? 0,
  }));
}

export async function getBranchPerformance(): Promise<BranchPerf[]> {
  if (!hasDb()) return [];
  const groups = await db.order.groupBy({
    by: ["branchId"],
    _count: { _all: true },
    _sum: { total: true },
    orderBy: { _sum: { total: "desc" } },
  });
  return groups.map((g) => ({
    branchId: g.branchId,
    branchName: BRANCHES.find((b) => b.id === g.branchId)?.name ?? g.branchId,
    orders: g._count._all,
    revenue: g._sum.total ?? 0,
  }));
}

export async function getStatusBreakdown(): Promise<StatusBreakdown> {
  if (!hasDb()) return {};
  const groups = await db.order.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  return Object.fromEntries(groups.map((g) => [g.status, g._count._all]));
}

export type Totals = {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  uniqueCustomers: number;
};

export async function getOverallTotals(): Promise<Totals> {
  if (!hasDb()) {
    return { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0, uniqueCustomers: 0 };
  }
  const [agg, distinct] = await Promise.all([
    db.order.aggregate({
      _count: { _all: true },
      _sum: { total: true },
    }),
    db.order.findMany({
      distinct: ["customerPhone"],
      select: { customerPhone: true },
    }),
  ]);
  const totalOrders = agg._count._all;
  const totalRevenue = agg._sum.total ?? 0;
  return {
    totalOrders,
    totalRevenue,
    avgOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
    uniqueCustomers: distinct.length,
  };
}
