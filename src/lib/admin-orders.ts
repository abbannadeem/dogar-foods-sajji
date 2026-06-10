/**
 * Server-side helpers for the admin panel. Centralized DB queries.
 * All callers must already be auth-protected (via middleware or layout).
 */

import { db } from "@/lib/db";
import type { Order, OrderStatus, Prisma } from "@prisma/client";

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: true };
}>;

export function hasDb(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function startOfDay(d = new Date()): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeek(d = new Date()): Date {
  const x = startOfDay(d);
  const day = x.getDay(); // 0 = Sun
  // Pakistan week feels Sun-Sat; that's already what we get.
  x.setDate(x.getDate() - day);
  return x;
}

export async function getDashboardStats() {
  if (!hasDb()) {
    return {
      todayCount: 0,
      todayRevenue: 0,
      weekCount: 0,
      weekRevenue: 0,
      pendingCount: 0,
      totalCount: 0,
    };
  }

  const todayStart = startOfDay();
  const weekStart = startOfWeek();

  const [todayAgg, weekAgg, pendingCount, totalCount] = await Promise.all([
    db.order.aggregate({
      _count: { _all: true },
      _sum: { total: true },
      where: { createdAt: { gte: todayStart } },
    }),
    db.order.aggregate({
      _count: { _all: true },
      _sum: { total: true },
      where: { createdAt: { gte: weekStart } },
    }),
    db.order.count({ where: { status: "PENDING" } }),
    db.order.count(),
  ]);

  return {
    todayCount: todayAgg._count._all,
    todayRevenue: todayAgg._sum.total ?? 0,
    weekCount: weekAgg._count._all,
    weekRevenue: weekAgg._sum.total ?? 0,
    pendingCount,
    totalCount,
  };
}

export async function getRecentOrders(limit = 8): Promise<OrderWithItems[]> {
  if (!hasDb()) return [];
  return db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: limit,
  });
}

export type OrdersQuery = {
  search?: string;
  status?: OrderStatus | "ALL";
  limit?: number;
};

export async function getOrders(q: OrdersQuery = {}): Promise<OrderWithItems[]> {
  if (!hasDb()) return [];

  const where: Prisma.OrderWhereInput = {};
  if (q.status && q.status !== "ALL") {
    where.status = q.status;
  }
  if (q.search && q.search.trim()) {
    const s = q.search.trim();
    where.OR = [
      { orderNumber: { contains: s, mode: "insensitive" } },
      { customerName: { contains: s, mode: "insensitive" } },
      { customerPhone: { contains: s } },
      { area: { contains: s, mode: "insensitive" } },
    ];
  }

  return db.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: q.limit ?? 100,
  });
}

export async function getOrderByNumber(
  orderNumber: string
): Promise<OrderWithItems | null> {
  if (!hasDb()) return null;
  return db.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
}

export type CustomerRow = {
  customerPhone: string;
  customerName: string;
  orders: number;
  lifetimeValue: number;
  lastOrder: Date;
  email: string | null;
};

export async function getCustomers(): Promise<CustomerRow[]> {
  if (!hasDb()) return [];

  // Group by phone. We use a raw groupBy because Prisma doesn't aggregate strings.
  const groups = await db.order.groupBy({
    by: ["customerPhone"],
    _count: { _all: true },
    _sum: { total: true },
    _max: { createdAt: true, customerName: true, customerEmail: true },
    orderBy: { _max: { createdAt: "desc" } },
  });

  return groups.map((g) => ({
    customerPhone: g.customerPhone,
    customerName: g._max.customerName ?? "Unknown",
    email: g._max.customerEmail ?? null,
    orders: g._count._all,
    lifetimeValue: g._sum.total ?? 0,
    lastOrder: g._max.createdAt ?? new Date(0),
  }));
}

export async function getCustomerOrders(phone: string): Promise<OrderWithItems[]> {
  if (!hasDb()) return [];
  return db.order.findMany({
    where: { customerPhone: phone },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
}

export async function updateOrderStatus(
  orderNumber: string,
  status: OrderStatus
): Promise<Order | null> {
  if (!hasDb()) return null;
  return db.order.update({
    where: { orderNumber },
    data: { status },
  });
}

export function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatRelative(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(date);
}
