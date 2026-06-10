"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-context";
import { formatPKR } from "@/data/menu";
import { BRANCHES } from "@/lib/constants";
import type { CheckoutForm, CreateOrderPayload, CreateOrderResponse } from "@/types/cart";

const PAYMENT_OPTIONS: Array<{
  value: CheckoutForm["paymentMethod"];
  label: string;
  hint: string;
}> = [
  { value: "COD", label: "Cash on Delivery", hint: "Pay when food arrives" },
  { value: "JAZZCASH", label: "JazzCash", hint: "Mobile wallet" },
  { value: "EASYPAISA", label: "EasyPaisa", hint: "Mobile wallet" },
  { value: "BANK_TRANSFER", label: "Bank Transfer", hint: "Direct transfer" },
  { value: "SAFEPAY", label: "Card via SafePay", hint: "Visa / Mastercard" },
];

const DELIVERY_FEE = 0; // free in-zone; future: zone-based

export default function CheckoutPageClient() {
  const router = useRouter();
  const { items, subtotal, clear, isHydrated } = useCart();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<CheckoutForm>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    address: "",
    area: "",
    city: "Lahore",
    branchId: BRANCHES[0].id,
    paymentMethod: "COD",
    notes: "",
  });

  if (!isHydrated) {
    return (
      <div className="container-x py-20 text-center">
        <div className="inline-block w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-x py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="font-display text-2xl font-bold">Your cart is empty</h2>
        <p className="text-muted mt-2">Add items before checking out.</p>
        <Link href="/menu" className="btn-primary mt-6 inline-flex">
          Browse Menu
        </Link>
      </div>
    );
  }

  function setField<K extends keyof CheckoutForm>(key: K, value: CheckoutForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    // Lightweight validation
    if (form.customerName.trim().length < 2) {
      toast.error("Please enter your full name");
      return;
    }
    if (!/^[0-9+\s\-()]{8,}$/.test(form.customerPhone)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    if (form.address.trim().length < 6) {
      toast.error("Please enter a complete delivery address");
      return;
    }
    if (form.area.trim().length < 2) {
      toast.error("Please enter your area / locality");
      return;
    }

    setSubmitting(true);
    const total = subtotal + DELIVERY_FEE;
    const payload: CreateOrderPayload = {
      customer: form,
      items,
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as CreateOrderResponse;

      if (!res.ok || !data.ok) {
        const msg = !data.ok ? data.error : "Could not place order. Please try again.";
        toast.error(msg);
        setSubmitting(false);
        return;
      }

      // Open WhatsApp with the prefilled order in a new tab
      window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");

      // Clear cart and route to success page
      clear();
      router.push(`/order/${data.orderNumber}`);
    } catch {
      toast.error("Network error. Please check your connection.");
      setSubmitting(false);
    }
  }

  return (
    <div className="container-x py-10">
      <form
        onSubmit={handleSubmit}
        className="grid lg:grid-cols-[1fr_400px] gap-8 items-start"
        noValidate
      >
        {/* LEFT — form */}
        <div className="space-y-6">
          {/* Contact */}
          <fieldset className="bg-surface border border-border rounded-2xl p-5 sm:p-6">
            <legend className="font-display text-lg font-extrabold uppercase px-2">
              Contact
            </legend>
            <div className="grid sm:grid-cols-2 gap-4 mt-2">
              <Field label="Full name *" htmlFor="customerName">
                <input
                  id="customerName"
                  type="text"
                  required
                  value={form.customerName}
                  onChange={(e) => setField("customerName", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Phone *" htmlFor="customerPhone">
                <input
                  id="customerPhone"
                  type="tel"
                  required
                  placeholder="0300-1234567"
                  value={form.customerPhone}
                  onChange={(e) => setField("customerPhone", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Email (optional)" htmlFor="customerEmail" className="sm:col-span-2">
                <input
                  id="customerEmail"
                  type="email"
                  value={form.customerEmail}
                  onChange={(e) => setField("customerEmail", e.target.value)}
                  className="input"
                />
              </Field>
            </div>
          </fieldset>

          {/* Delivery */}
          <fieldset className="bg-surface border border-border rounded-2xl p-5 sm:p-6">
            <legend className="font-display text-lg font-extrabold uppercase px-2">
              Delivery
            </legend>
            <div className="grid sm:grid-cols-2 gap-4 mt-2">
              <Field label="Address *" htmlFor="address" className="sm:col-span-2">
                <textarea
                  id="address"
                  required
                  rows={2}
                  placeholder="House #, street, landmark"
                  value={form.address}
                  onChange={(e) => setField("address", e.target.value)}
                  className="input resize-none"
                />
              </Field>
              <Field label="Area / Locality *" htmlFor="area">
                <input
                  id="area"
                  type="text"
                  required
                  placeholder="e.g. Tajpura, Garhi Shahu, Susan Road"
                  value={form.area}
                  onChange={(e) => setField("area", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="City" htmlFor="city">
                <select
                  id="city"
                  value={form.city}
                  onChange={(e) => setField("city", e.target.value)}
                  className="input"
                >
                  <option>Lahore</option>
                  <option>Faisalabad</option>
                  <option>Other</option>
                </select>
              </Field>
              <Field label="Nearest branch" htmlFor="branchId" className="sm:col-span-2">
                <select
                  id="branchId"
                  value={form.branchId}
                  onChange={(e) => setField("branchId", e.target.value)}
                  className="input"
                >
                  {BRANCHES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} — {b.city}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </fieldset>

          {/* Payment */}
          <fieldset className="bg-surface border border-border rounded-2xl p-5 sm:p-6">
            <legend className="font-display text-lg font-extrabold uppercase px-2">
              Payment
            </legend>
            <div className="grid sm:grid-cols-2 gap-3 mt-2">
              {PAYMENT_OPTIONS.map((opt) => {
                const active = form.paymentMethod === opt.value;
                return (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                      active
                        ? "border-brand-600 bg-brand-600/10"
                        : "border-border hover:border-brand-600/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.value}
                      checked={active}
                      onChange={() => setField("paymentMethod", opt.value)}
                      className="mt-1 accent-brand-600"
                    />
                    <span>
                      <span className="font-bold text-white block">
                        {opt.label}
                      </span>
                      <span className="text-xs text-muted">{opt.hint}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            <Field label="Order notes (optional)" htmlFor="notes" className="mt-4">
              <textarea
                id="notes"
                rows={2}
                placeholder="Less spicy, no onions, etc."
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
                className="input resize-none"
              />
            </Field>
          </fieldset>
        </div>

        {/* RIGHT — summary */}
        <aside className="bg-surface border border-border rounded-2xl p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-xl font-extrabold uppercase mb-4">
            Your Order
          </h2>
          <ul className="space-y-3 mb-4 max-h-[260px] overflow-y-auto pr-1">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-3 text-sm">
                <div className="relative w-12 h-12 shrink-0 rounded-md overflow-hidden border border-border bg-black">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white truncate">
                    {item.name}
                  </div>
                  <div className="text-xs text-muted">
                    {item.quantity} × {formatPKR(item.price)}
                  </div>
                </div>
                <div className="font-bold tabular-nums">
                  {formatPKR(item.price * item.quantity)}
                </div>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 text-sm border-t border-border pt-3">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-bold tabular-nums">{formatPKR(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd className="tabular-nums">
                {DELIVERY_FEE === 0 ? "Free" : formatPKR(DELIVERY_FEE)}
              </dd>
            </div>
            <div className="border-t border-border pt-2 flex justify-between text-lg">
              <dt className="font-display font-bold">Total</dt>
              <dd className="font-display font-extrabold text-brand-500 tabular-nums">
                {formatPKR(subtotal + DELIVERY_FEE)}
              </dd>
            </div>
          </dl>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary justify-center w-full mt-6 disabled:opacity-50"
          >
            {submitting ? "Placing order..." : "Place Order"}
          </button>

          <p className="text-xs text-muted mt-3 text-center">
            By placing this order you agree to our{" "}
            <Link href="/terms" className="underline hover:text-brand-500">
              terms
            </Link>{" "}
            &{" "}
            <Link href="/privacy" className="underline hover:text-brand-500">
              privacy
            </Link>
            .
          </p>
        </aside>
      </form>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: var(--background);
          border: 1px solid var(--border);
          color: var(--foreground);
          font-size: 0.875rem;
        }
        :global(.input:focus) {
          outline: none;
          border-color: var(--brand-600);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  className = "",
  children,
}: {
  label: string;
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className={`block ${className}`}>
      <span className="text-xs uppercase tracking-wider text-muted font-bold block mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
