import Link from "next/link";
import { getCustomers, hasDb, formatRelative } from "@/lib/admin-orders";
import { formatPKR } from "@/data/menu";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold uppercase">
          Customers
        </h1>
        <p className="text-sm text-muted mt-1">
          {customers.length} {customers.length === 1 ? "customer" : "customers"}{" "}
          who have placed orders
        </p>
      </div>

      {!hasDb() && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-sm">
          Database not connected. Customers are derived from saved orders.
        </div>
      )}

      <section className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.4fr_1fr_0.6fr_0.8fr_1fr] gap-3 px-5 py-3 text-[10px] uppercase tracking-[0.18em] font-bold text-muted border-b border-border">
          <div>Customer</div>
          <div>Phone</div>
          <div className="text-right">Orders</div>
          <div className="text-right">Lifetime Value</div>
          <div className="text-right">Last Order</div>
        </div>
        {customers.length === 0 ? (
          <div className="p-12 text-center text-muted text-sm">
            No customers yet.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {customers.map((c) => (
              <li
                key={c.customerPhone}
                className="grid grid-cols-[1fr_auto] md:grid-cols-[1.4fr_1fr_0.6fr_0.8fr_1fr] gap-3 items-center px-5 py-3.5 hover:bg-white/[0.02] transition"
              >
                <div className="min-w-0">
                  <Link
                    href={`/admin/customers/${encodeURIComponent(c.customerPhone)}`}
                    className="font-bold text-white hover:text-brand-500 truncate"
                  >
                    {c.customerName}
                  </Link>
                  {c.email && (
                    <div className="text-xs text-muted truncate">{c.email}</div>
                  )}
                </div>
                <a
                  href={`tel:${c.customerPhone}`}
                  className="hidden md:block text-sm text-muted hover:text-brand-500 truncate"
                >
                  {c.customerPhone}
                </a>
                <div className="hidden md:block text-right text-sm tabular-nums">
                  {c.orders}
                </div>
                <div className="text-right text-sm font-bold tabular-nums text-brand-500">
                  {formatPKR(c.lifetimeValue)}
                </div>
                <div className="hidden md:block text-right text-xs text-muted">
                  {formatRelative(c.lastOrder)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
