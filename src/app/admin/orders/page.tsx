import Link from "next/link";
import { Suspense } from "react";
import { getOrders, hasDb, formatRelative } from "@/lib/admin-orders";
import { formatPKR } from "@/data/menu";
import OrderStatusBadge, { ORDER_STATUSES } from "@/components/admin/OrderStatusBadge";
import type { OrderStatus } from "@prisma/client";
import OrdersFilterBar from "@/components/admin/OrdersFilterBar";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const search = sp.q?.trim();
  const status = (sp.status?.toUpperCase() ?? "ALL") as OrderStatus | "ALL";
  const orders = await getOrders({
    search,
    status: ORDER_STATUSES.includes(status as OrderStatus) ? (status as OrderStatus) : "ALL",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-extrabold uppercase">
            Orders
          </h1>
          <p className="text-sm text-muted mt-1">
            {orders.length} {orders.length === 1 ? "order" : "orders"} found
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="bg-surface border border-border rounded-2xl p-4 h-16" />
        }
      >
        <OrdersFilterBar
          initialSearch={search ?? ""}
          initialStatus={(status as string) ?? "ALL"}
        />
      </Suspense>

      {!hasDb() && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-sm">
          Database not connected. Set <code>DATABASE_URL</code> to see persisted orders.
        </div>
      )}

      <section className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.2fr_1.2fr_1fr_0.7fr_1fr_auto] gap-3 px-5 py-3 text-[10px] uppercase tracking-[0.18em] font-bold text-muted border-b border-border">
          <div>Order</div>
          <div>Customer</div>
          <div>Area</div>
          <div className="text-right">Items</div>
          <div className="text-right">Total</div>
          <div>Status</div>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center text-muted text-sm">
            No orders match your filters.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {orders.map((o) => (
              <li
                key={o.id}
                className="grid grid-cols-[1fr_auto] md:grid-cols-[1.2fr_1.2fr_1fr_0.7fr_1fr_auto] gap-3 items-center px-5 py-3.5 hover:bg-white/[0.02] transition"
              >
                <div className="min-w-0">
                  <Link
                    href={`/admin/orders/${o.orderNumber}`}
                    className="font-bold text-white hover:text-brand-500 block truncate"
                  >
                    {o.orderNumber}
                  </Link>
                  <div className="text-[11px] text-muted truncate">
                    {formatRelative(o.createdAt)}
                  </div>
                </div>
                <div className="hidden md:block min-w-0">
                  <div className="text-sm text-white truncate">
                    {o.customerName}
                  </div>
                  <a
                    href={`tel:${o.customerPhone}`}
                    className="text-xs text-muted hover:text-brand-500 truncate"
                  >
                    {o.customerPhone}
                  </a>
                </div>
                <div className="hidden md:block text-xs text-muted truncate">
                  {o.area}, {o.city}
                </div>
                <div className="hidden md:block text-sm text-right tabular-nums text-white/80">
                  {o.items.length}
                </div>
                <div className="hidden md:block text-right font-bold tabular-nums text-brand-500">
                  {formatPKR(o.total)}
                </div>
                <div>
                  <OrderStatusBadge status={o.status} />
                </div>
                {/* Mobile-only sub-line under order column */}
                <div className="md:hidden text-xs text-muted col-span-2 -mt-1.5">
                  {o.customerName} · {o.customerPhone}{" "}
                  <span className="text-brand-500 font-bold ml-2">
                    {formatPKR(o.total)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
