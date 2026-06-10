import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getOrderByNumber, formatDate } from "@/lib/admin-orders";
import { formatPKR } from "@/data/menu";
import { BRANCHES } from "@/lib/constants";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export const dynamic = "force-dynamic";

type Params = { orderNumber: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Order ${orderNumber}`,
    robots: { index: false, follow: false },
  };
}

const PAYMENT_LABELS: Record<string, string> = {
  COD: "Cash on Delivery",
  JAZZCASH: "JazzCash",
  EASYPAISA: "EasyPaisa",
  BANK_TRANSFER: "Bank Transfer",
  SAFEPAY: "Card via SafePay",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  const branch = BRANCHES.find((b) => b.id === order.branchId);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/admin/orders"
            className="text-xs uppercase tracking-wider text-muted hover:text-brand-500"
          >
            ← All orders
          </Link>
          <h1 className="font-display text-3xl font-extrabold uppercase mt-2">
            {order.orderNumber}
          </h1>
          <div className="text-xs text-muted mt-1">
            Placed {formatDate(order.createdAt)}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <OrderStatusBadge status={order.status} />
          <OrderStatusSelect
            orderNumber={order.orderNumber}
            current={order.status}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* LEFT — items + customer */}
        <div className="space-y-6">
          <section className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="font-display text-lg font-extrabold uppercase">
                Items
              </h2>
            </div>
            <ul className="divide-y divide-border">
              {order.items.map((it) => (
                <li
                  key={it.id}
                  className="flex justify-between gap-3 px-5 py-4"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/menu/${it.productSlug}`}
                      target="_blank"
                      className="font-bold text-white hover:text-brand-500 truncate"
                    >
                      {it.productName}
                    </Link>
                    <div className="text-xs text-muted mt-0.5 tabular-nums">
                      {it.quantity} × {formatPKR(it.unitPrice)}
                    </div>
                  </div>
                  <div className="font-bold tabular-nums shrink-0">
                    {formatPKR(it.lineTotal)}
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-border p-5 space-y-2 text-sm">
              <Row label="Subtotal" value={formatPKR(order.subtotal)} />
              <Row
                label="Delivery"
                value={
                  order.deliveryFee === 0
                    ? "Free"
                    : formatPKR(order.deliveryFee)
                }
              />
              <div className="border-t border-border pt-2 flex justify-between text-lg">
                <span className="font-display font-bold">Total</span>
                <span className="font-display font-extrabold text-brand-500 tabular-nums">
                  {formatPKR(order.total)}
                </span>
              </div>
            </div>
          </section>

          {order.notes && (
            <section className="bg-surface border border-border rounded-2xl p-5">
              <h3 className="text-xs uppercase tracking-wider text-muted font-bold mb-2">
                Order Notes
              </h3>
              <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
                {order.notes}
              </p>
            </section>
          )}
        </div>

        {/* RIGHT — meta */}
        <aside className="space-y-4">
          <section className="bg-surface border border-border rounded-2xl p-5">
            <h3 className="text-xs uppercase tracking-wider text-muted font-bold mb-3">
              Customer
            </h3>
            <div className="space-y-1.5 text-sm">
              <div className="font-bold text-white">{order.customerName}</div>
              <a
                href={`tel:${order.customerPhone}`}
                className="block text-brand-500 hover:underline"
              >
                📞 {order.customerPhone}
              </a>
              <a
                href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="block text-emerald-400 hover:underline"
              >
                💬 WhatsApp
              </a>
              {order.customerEmail && (
                <a
                  href={`mailto:${order.customerEmail}`}
                  className="block text-muted hover:text-white"
                >
                  📧 {order.customerEmail}
                </a>
              )}
              <Link
                href={`/admin/customers/${encodeURIComponent(order.customerPhone)}`}
                className="inline-block mt-2 text-xs uppercase tracking-wider text-muted hover:text-brand-500"
              >
                View order history →
              </Link>
            </div>
          </section>

          <section className="bg-surface border border-border rounded-2xl p-5">
            <h3 className="text-xs uppercase tracking-wider text-muted font-bold mb-3">
              Delivery
            </h3>
            <div className="space-y-1.5 text-sm">
              <div className="text-white whitespace-pre-wrap">{order.address}</div>
              <div className="text-muted">
                {order.area}, {order.city}
              </div>
              <div className="text-xs text-muted mt-2 pt-2 border-t border-border">
                Routed to <span className="text-brand-500 font-bold">{branch?.name ?? order.branchId}</span>
              </div>
            </div>
          </section>

          <section className="bg-surface border border-border rounded-2xl p-5">
            <h3 className="text-xs uppercase tracking-wider text-muted font-bold mb-3">
              Payment
            </h3>
            <div className="text-sm text-white">
              {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
