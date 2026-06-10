import Link from "next/link";
import { hasDb } from "@/lib/admin-orders";
import {
  getDailySales,
  getTopProducts,
  getBranchPerformance,
  getStatusBreakdown,
  getOverallTotals,
} from "@/lib/admin-analytics";
import { formatPKR } from "@/data/menu-static";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  CONFIRMED: "#3b82f6",
  PREPARING: "#f97316",
  ON_THE_WAY: "#06b6d4",
  DELIVERED: "#10b981",
  CANCELLED: "#ef4444",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  ON_THE_WAY: "On the way",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export default async function AnalyticsPage() {
  const [daily, top, branches, breakdown, totals] = await Promise.all([
    getDailySales(7),
    getTopProducts(5),
    getBranchPerformance(),
    getStatusBreakdown(),
    getOverallTotals(),
  ]);

  const maxRevenue = Math.max(1, ...daily.map((d) => d.revenue));
  const statusTotal = Object.values(breakdown).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold uppercase">
          Analytics
        </h1>
        <p className="text-sm text-muted mt-1">
          Sales trends, top items, and branch performance.
        </p>
      </div>

      {!hasDb() && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-sm">
          Database not connected. Analytics will populate once orders flow into Postgres.
        </div>
      )}

      {/* Overall stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Stat label="All-time orders" value={String(totals.totalOrders)} />
        <Stat label="All-time revenue" value={formatPKR(totals.totalRevenue)} />
        <Stat label="Avg. order value" value={formatPKR(totals.avgOrderValue)} />
        <Stat label="Unique customers" value={String(totals.uniqueCustomers)} />
      </div>

      {/* Sales chart */}
      <section className="bg-surface border border-border rounded-2xl p-5">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="font-display text-lg font-extrabold uppercase">
              Last 7 days
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Revenue per day · {daily.reduce((s, d) => s + d.orders, 0)} orders total
            </p>
          </div>
        </div>
        {daily.length === 0 ? (
          <div className="text-center text-muted text-sm py-8">
            No sales data yet.
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2 items-end h-48">
            {daily.map((d) => {
              const heightPct = (d.revenue / maxRevenue) * 100;
              return (
                <div
                  key={d.date}
                  className="flex flex-col items-center justify-end h-full gap-2"
                  title={`${d.label}: ${d.orders} orders, ${formatPKR(d.revenue)}`}
                >
                  <div className="text-[10px] tabular-nums text-muted text-center">
                    {d.revenue > 0 ? formatPKR(d.revenue) : "—"}
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-brand-700 to-brand-500 rounded-t-md transition-all"
                    style={{ height: `${Math.max(2, heightPct)}%` }}
                  />
                  <div className="text-[10px] uppercase tracking-wider text-muted text-center font-bold">
                    {d.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top products */}
        <section className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="font-display text-lg font-extrabold uppercase">
              Top Products
            </h2>
            <p className="text-xs text-muted mt-0.5">By total revenue</p>
          </div>
          {top.length === 0 ? (
            <div className="p-8 text-center text-muted text-sm">No data yet.</div>
          ) : (
            <ul className="divide-y divide-border">
              {top.map((p, idx) => {
                const max = Math.max(1, ...top.map((x) => x.revenue));
                const pct = (p.revenue / max) * 100;
                return (
                  <li key={p.productId} className="px-5 py-3.5">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <Link
                        href={`/menu/${p.productSlug}`}
                        target="_blank"
                        className="flex items-center gap-2 min-w-0 hover:text-brand-500 transition"
                      >
                        <span className="text-[11px] uppercase tracking-wider text-muted font-bold w-6 tabular-nums">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-white truncate">
                          {p.productName}
                        </span>
                      </Link>
                      <span className="font-bold text-brand-500 tabular-nums shrink-0">
                        {formatPKR(p.revenue)}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted ml-8 tabular-nums">
                      {p.unitsSold} sold
                    </div>
                    <div className="ml-8 mt-1.5 h-1 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-600 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Branch performance */}
        <section className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="font-display text-lg font-extrabold uppercase">
              Branch Performance
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Where the orders come from
            </p>
          </div>
          {branches.length === 0 ? (
            <div className="p-8 text-center text-muted text-sm">No data yet.</div>
          ) : (
            <ul className="divide-y divide-border">
              {branches.map((b) => {
                const max = Math.max(1, ...branches.map((x) => x.revenue));
                const pct = (b.revenue / max) * 100;
                return (
                  <li key={b.branchId} className="px-5 py-3.5">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <span className="font-bold text-white truncate">
                        {b.branchName}
                      </span>
                      <span className="font-bold text-brand-500 tabular-nums shrink-0">
                        {formatPKR(b.revenue)}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted">
                      {b.orders} {b.orders === 1 ? "order" : "orders"}
                    </div>
                    <div className="mt-1.5 h-1 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Status breakdown */}
      <section className="bg-surface border border-border rounded-2xl p-5">
        <h2 className="font-display text-lg font-extrabold uppercase mb-4">
          Order Status Mix
        </h2>
        {statusTotal === 0 ? (
          <div className="text-center text-muted text-sm py-4">No data yet.</div>
        ) : (
          <>
            <div className="h-3 rounded-full overflow-hidden flex">
              {Object.entries(breakdown).map(([status, count]) => {
                const pct = (count / statusTotal) * 100;
                return (
                  <div
                    key={status}
                    style={{
                      width: `${pct}%`,
                      background: STATUS_COLORS[status] ?? "#666",
                    }}
                    title={`${STATUS_LABELS[status]}: ${count}`}
                  />
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(breakdown).map(([status, count]) => (
                <div key={status} className="text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: STATUS_COLORS[status] ?? "#666" }}
                    />
                    <span className="text-muted uppercase tracking-wider font-bold">
                      {STATUS_LABELS[status] ?? status}
                    </span>
                  </div>
                  <div className="font-bold text-white tabular-nums ml-4.5 mt-0.5">
                    {count}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5">
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted font-bold">
        {label}
      </div>
      <div className="font-display text-2xl sm:text-3xl font-extrabold mt-1 tabular-nums">
        {value}
      </div>
    </div>
  );
}
