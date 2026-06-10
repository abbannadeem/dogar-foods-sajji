import Link from "next/link";
import {
  getDashboardStats,
  getRecentOrders,
  hasDb,
  formatRelative,
} from "@/lib/admin-orders";
import { formatPKR } from "@/data/menu";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [stats, recent] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(8),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold uppercase">
          Dashboard
        </h1>
        <p className="text-sm text-muted mt-1">
          Live overview of orders, revenue, and customers.
        </p>
      </div>

      {!hasDb() && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5">
          <div className="font-bold text-amber-400 uppercase text-xs tracking-wider">
            Database not connected
          </div>
          <p className="text-sm text-white/80 mt-2">
            Set <code className="text-amber-400">DATABASE_URL</code> in your
            environment to persist orders. Orders currently flow to WhatsApp
            only. Setup guide:{" "}
            <Link
              href="https://neon.tech"
              target="_blank"
              className="underline hover:text-amber-300"
            >
              neon.tech
            </Link>
            .
          </p>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard
          label="Today Orders"
          value={String(stats.todayCount)}
          tone="brand"
        />
        <StatCard
          label="Today Revenue"
          value={formatPKR(stats.todayRevenue)}
          tone="emerald"
        />
        <StatCard
          label="Pending"
          value={String(stats.pendingCount)}
          tone="amber"
        />
        <StatCard
          label="This Week"
          value={String(stats.weekCount)}
          sub={formatPKR(stats.weekRevenue)}
          tone="slate"
        />
      </div>

      {/* Recent orders */}
      <section className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display text-lg font-extrabold uppercase">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs uppercase tracking-wider text-brand-500 hover:text-brand-400"
          >
            See all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="p-10 text-center text-muted text-sm">
            {hasDb()
              ? "No orders yet. Once customers place orders, they appear here."
              : "Orders will appear here once the database is connected."}
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((o) => (
              <li
                key={o.id}
                className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto_auto] items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition"
              >
                <div className="min-w-0">
                  <Link
                    href={`/admin/orders/${o.orderNumber}`}
                    className="font-bold text-white hover:text-brand-500 truncate"
                  >
                    {o.orderNumber}
                  </Link>
                  <div className="text-xs text-muted truncate">
                    {o.customerName} · {o.customerPhone} · {o.items.length} item
                    {o.items.length === 1 ? "" : "s"}
                  </div>
                </div>
                <div className="hidden sm:block text-xs text-muted text-right">
                  {formatRelative(o.createdAt)}
                </div>
                <div className="text-right font-bold tabular-nums text-brand-500">
                  {formatPKR(o.total)}
                </div>
                <OrderStatusBadge status={o.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone: "brand" | "emerald" | "amber" | "slate";
}) {
  const toneClass = {
    brand: "from-brand-600/20 border-brand-600/40 text-brand-500",
    emerald: "from-emerald-500/15 border-emerald-500/30 text-emerald-400",
    amber: "from-amber-500/15 border-amber-500/30 text-amber-400",
    slate: "from-white/5 border-border text-white",
  }[tone];
  return (
    <div
      className={`bg-gradient-to-br to-transparent border rounded-2xl p-5 ${toneClass}`}
    >
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted font-bold">
        {label}
      </div>
      <div className="font-display text-2xl sm:text-3xl font-extrabold mt-1 tabular-nums">
        {value}
      </div>
      {sub && (
        <div className="text-xs text-white/70 mt-1 tabular-nums">{sub}</div>
      )}
    </div>
  );
}
