import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCustomerOrders, formatRelative, formatDate } from "@/lib/admin-orders";
import { formatPKR } from "@/data/menu";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";

export const dynamic = "force-dynamic";

type Params = { phone: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { phone } = await params;
  const decoded = decodeURIComponent(phone);
  return {
    title: `Customer ${decoded}`,
    robots: { index: false, follow: false },
  };
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { phone } = await params;
  const decoded = decodeURIComponent(phone);
  const orders = await getCustomerOrders(decoded);
  if (orders.length === 0) notFound();

  const customer = orders[0];
  const lifetimeValue = orders.reduce((sum, o) => sum + o.total, 0);
  const avg = Math.round(lifetimeValue / orders.length);
  const firstOrder = orders[orders.length - 1];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <Link
          href="/admin/customers"
          className="text-xs uppercase tracking-wider text-muted hover:text-brand-500"
        >
          ← All customers
        </Link>
        <h1 className="font-display text-3xl font-extrabold uppercase mt-2">
          {customer.customerName}
        </h1>
        <div className="text-sm text-muted mt-1 space-x-3">
          <a
            href={`tel:${customer.customerPhone}`}
            className="text-brand-500 hover:underline"
          >
            📞 {customer.customerPhone}
          </a>
          <a
            href={`https://wa.me/${customer.customerPhone.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400 hover:underline"
          >
            💬 WhatsApp
          </a>
          {customer.customerEmail && (
            <a
              href={`mailto:${customer.customerEmail}`}
              className="hover:text-white"
            >
              📧 {customer.customerEmail}
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Orders" value={String(orders.length)} />
        <Stat label="Lifetime value" value={formatPKR(lifetimeValue)} />
        <Stat label="Avg. order" value={formatPKR(avg)} />
      </div>

      <div className="text-xs text-muted">
        Customer since {formatDate(firstOrder.createdAt)}
      </div>

      <section className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-display text-lg font-extrabold uppercase">
            Order History
          </h2>
        </div>
        <ul className="divide-y divide-border">
          {orders.map((o) => (
            <li
              key={o.id}
              className="grid grid-cols-[1fr_auto_auto] gap-3 items-center px-5 py-3.5 hover:bg-white/[0.02] transition"
            >
              <div className="min-w-0">
                <Link
                  href={`/admin/orders/${o.orderNumber}`}
                  className="font-bold text-white hover:text-brand-500 block truncate"
                >
                  {o.orderNumber}
                </Link>
                <div className="text-[11px] text-muted truncate">
                  {o.items.length} items · {o.area}, {o.city} ·{" "}
                  {formatRelative(o.createdAt)}
                </div>
              </div>
              <div className="text-right font-bold tabular-nums text-brand-500">
                {formatPKR(o.total)}
              </div>
              <OrderStatusBadge status={o.status} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted font-bold">
        {label}
      </div>
      <div className="font-display text-xl font-extrabold mt-1 tabular-nums">
        {value}
      </div>
    </div>
  );
}
