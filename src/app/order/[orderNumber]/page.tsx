import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatPKR } from "@/data/menu";
import { BRANCHES } from "@/lib/constants";

type Params = { orderNumber: string };

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Order ${orderNumber}`,
    description: "Your order has been placed.",
    robots: { index: false },
  };
}

async function tryFetchOrder(orderNumber: string) {
  if (!process.env.DATABASE_URL) return null;
  try {
    return await db.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });
  } catch {
    return null;
  }
}

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { orderNumber } = await params;
  const order = await tryFetchOrder(orderNumber);
  const branch = order
    ? BRANCHES.find((b) => b.id === order.branchId)
    : BRANCHES[0];

  return (
    <div className="container-x py-12 max-w-3xl mx-auto">
      {/* Success block */}
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 grid place-items-center mb-5">
          <svg
            viewBox="0 0 24 24"
            className="w-10 h-10 text-emerald-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase">
          Order <span className="text-brand-500">Placed!</span>
        </h1>
        <p className="text-white/80 mt-3 max-w-md mx-auto">
          Thank you! Your order has been recorded and a WhatsApp message was opened
          so the branch can confirm details.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border">
          <span className="text-xs uppercase tracking-wider text-muted">
            Order #
          </span>
          <span className="font-display font-extrabold text-brand-500 tabular-nums">
            {orderNumber}
          </span>
        </div>
      </div>

      {/* Order details (only if DB available) */}
      {order ? (
        <section className="mt-10 bg-surface border border-border rounded-2xl p-6">
          <h2 className="font-display text-xl font-extrabold uppercase mb-4">
            Summary
          </h2>
          <dl className="grid sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
            <DT label="Name" value={order.customerName} />
            <DT label="Phone" value={order.customerPhone} />
            <DT label="Address" value={order.address} />
            <DT label="Area" value={`${order.area}, ${order.city}`} />
            <DT label="Branch" value={branch?.name ?? order.branchId} />
            <DT label="Payment" value={order.paymentMethod.replace(/_/g, " ")} />
          </dl>

          <ul className="mt-6 divide-y divide-border border-y border-border">
            {order.items.map((it) => (
              <li
                key={it.id}
                className="flex justify-between py-3 text-sm tabular-nums"
              >
                <span className="text-white">
                  {it.productName} × {it.quantity}
                </span>
                <span className="font-bold">{formatPKR(it.lineTotal)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Subtotal" value={formatPKR(order.subtotal)} />
            <Row
              label="Delivery"
              value={order.deliveryFee === 0 ? "Free" : formatPKR(order.deliveryFee)}
            />
            <Row
              label="Total"
              value={formatPKR(order.total)}
              emphasis
            />
          </dl>
        </section>
      ) : (
        <section className="mt-10 bg-surface border border-border rounded-2xl p-6 text-center">
          <p className="text-muted text-sm">
            Order details were sent via WhatsApp. Save the order number above for
            reference.
          </p>
        </section>
      )}

      {/* What's next */}
      <section className="mt-8 grid sm:grid-cols-3 gap-3">
        <Step n="1" title="We Confirm" sub="Branch calls you within 5 min" />
        <Step n="2" title="We Cook" sub="Fresh, made to order" />
        <Step n="3" title="We Deliver" sub="Hot at your door, 45 min" />
      </section>

      <div className="mt-10 text-center space-x-3">
        <Link href="/menu" className="btn-secondary">
          Order More
        </Link>
        <Link href="/" className="text-sm text-muted hover:text-brand-500">
          Back home
        </Link>
      </div>
    </div>
  );
}

function DT({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted font-bold">
        {label}
      </dt>
      <dd className="text-white mt-0.5">{value}</dd>
    </div>
  );
}

function Row({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`flex justify-between ${
        emphasis ? "border-t border-border pt-3 text-lg" : ""
      }`}
    >
      <span className={emphasis ? "font-display font-bold" : "text-muted"}>
        {label}
      </span>
      <span
        className={
          emphasis
            ? "font-display font-extrabold text-brand-500 tabular-nums"
            : "tabular-nums"
        }
      >
        {value}
      </span>
    </div>
  );
}

function Step({ n, title, sub }: { n: string; title: string; sub: string }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 text-center">
      <div className="w-10 h-10 mx-auto rounded-full bg-brand-600 text-white grid place-items-center font-display font-extrabold">
        {n}
      </div>
      <div className="mt-3 font-display font-bold uppercase text-white text-sm">
        {title}
      </div>
      <div className="text-xs text-muted mt-1">{sub}</div>
    </div>
  );
}
