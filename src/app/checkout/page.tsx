import type { Metadata } from "next";
import CheckoutPageClient from "@/components/CheckoutPageClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order — Dogar Foods & Sajji.",
};

export default function CheckoutPage() {
  return (
    <>
      <section className="relative bg-black border-b border-border py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 to-transparent" />
        <div className="container-x text-center relative">
          <span className="text-xs uppercase tracking-[0.3em] text-brand-500 font-bold">
            Step 2 of 2
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold mt-2 uppercase">
            <span className="text-brand-500">Checkout</span>
          </h1>
          <p className="text-white/70 mt-2 text-sm">
            Quick form. Order via website + WhatsApp confirmation.
          </p>
        </div>
      </section>
      <CheckoutPageClient />
    </>
  );
}
