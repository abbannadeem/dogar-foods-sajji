"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Category = "Orders" | "Delivery" | "Payment" | "Catering";
type Faq = {
  id: string;
  category: Category;
  q: string;
  a: string;
};

const FAQS: Faq[] = [
  {
    id: "hours",
    category: "Orders",
    q: "What are your operating hours?",
    a: "All three branches — Tajpura, Garhi Shahu and Faisalabad — are open daily from 12:00 PM to 4:00 AM, including weekends and most public holidays. Yes, that includes the late-night Sajji run.",
  },
  {
    id: "halal",
    category: "Orders",
    q: "Is everything halal?",
    a: "100% halal. All meat is sourced from certified halal Baloch-owned farms we have worked with since 2019 and prepared in line with Islamic guidelines.",
  },
  {
    id: "customize",
    category: "Orders",
    q: "Can I customise spice level or skip ingredients?",
    a: "Yes — mention spice level, allergies or special requests in the order notes, or just tell the staff when you call. We mark it on the order ticket before it hits the kitchen.",
  },
  {
    id: "delivery-zones",
    category: "Delivery",
    q: "Do you deliver, and where?",
    a: "Yes. We deliver within a fixed radius around each branch in Lahore (Tajpura, Garhi Shahu, surrounding areas) and Faisalabad (Susan Road and surrounding sectors). Enter your address at checkout to confirm.",
  },
  {
    id: "delivery-time",
    category: "Delivery",
    q: "How long does delivery take?",
    a: "Most orders arrive within 45 minutes. Friday and Saturday evenings can push to 60–75 minutes during the dinner rush. Sajji takes a little longer because we will not pull it off the flame early.",
  },
  {
    id: "delivery-charges",
    category: "Delivery",
    q: "Are there delivery charges?",
    a: "A small flat delivery fee applies, shown clearly at checkout based on your zone. Free delivery on orders above the threshold shown at checkout.",
  },
  {
    id: "payment",
    category: "Payment",
    q: "What payment methods do you accept?",
    a: "Cash on Delivery (COD), JazzCash, EasyPaisa, bank transfer, and credit/debit cards via SafePay. In-store you can pay by card or cash.",
  },
  {
    id: "refund",
    category: "Payment",
    q: "What is your refund policy?",
    a: "If something is wrong with your order, call the branch within one hour of delivery. We will either replace the item or refund — your choice. We do not argue about food.",
  },
  {
    id: "loyalty",
    category: "Payment",
    q: "Do you have a loyalty programme?",
    a: "Yes. Sign up for an account and you earn points on every order, redeemable for discounts. Walk-in customers can ask the counter for the loyalty card.",
  },
  {
    id: "catering-min",
    category: "Catering",
    q: "Do you cater weddings and large events?",
    a: "Yes — weddings, mehndis, corporate events, milad gatherings. We have done plates for 50 up to 1,500. Sajji, karahi, biryani, BBQ stations — full setups available.",
  },
  {
    id: "catering-notice",
    category: "Catering",
    q: "How much notice do you need for catering?",
    a: "Minimum 24 hours for small orders (under 50 plates). For weddings and 200+ guests, we ask for 5–7 days so the meat and spice sourcing can be locked in. Contact us via WhatsApp on the contact page.",
  },
  {
    id: "catering-staff",
    category: "Catering",
    q: "Can you bring staff and live setup to the venue?",
    a: "Yes. We can run live Sajji and BBQ stations at your venue with our own pit, staff and serving plates. Pricing depends on guest count and distance — ask for a quote.",
  },
];

const CHIPS: Array<"All" | Category> = [
  "All",
  "Orders",
  "Delivery",
  "Payment",
  "Catering",
];

export default function FAQPage() {
  const [active, setActive] = useState<"All" | Category>("All");

  const filtered = useMemo(
    () => (active === "All" ? FAQS : FAQS.filter((f) => f.category === active)),
    [active]
  );

  return (
    <>
      {/* HERO */}
      <section className="relative bg-black border-b border-border py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 via-transparent to-transparent" />
        <div className="container-x relative">
          <div className="max-w-2xl">
            <span className="text-[11px] uppercase tracking-[0.32em] text-brand-500 font-bold">
              Help Center
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black mt-3 leading-[1.05]">
              Questions, <span className="text-brand-500">answered</span>
            </h1>
            <p className="text-white/75 mt-5 text-base sm:text-lg max-w-xl">
              Everything about ordering, delivery, payment and catering. If
              your question is not here, the kitchen has a phone — call us.
            </p>
          </div>
        </div>
      </section>

      {/* FILTER CHIPS */}
      <section className="container-x pt-10">
        <div className="flex flex-wrap gap-2">
          {CHIPS.map((c) => {
            const isActive = active === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                aria-pressed={isActive}
                className={
                  "px-4 py-2 rounded-full text-xs uppercase tracking-[0.18em] font-bold border transition " +
                  (isActive
                    ? "bg-brand-600 border-brand-600 text-white shadow-warm"
                    : "bg-surface border-border text-white/70 hover:border-brand-600/60 hover:text-white")
                }
              >
                {c}
              </button>
            );
          })}
        </div>
      </section>

      {/* FAQS */}
      <section className="container-x py-10 md:py-14 max-w-3xl">
        <div className="space-y-3">
          {filtered.map((f) => (
            <details
              key={f.id}
              className="group bg-surface border border-border rounded-2xl px-5 sm:px-6 py-4 hover:border-brand-600/70 open:border-brand-600/70 transition [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex justify-between items-start gap-4 cursor-pointer list-none">
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-brand-500 font-bold">
                    {f.category}
                  </div>
                  <div className="font-display font-bold text-base sm:text-lg text-white mt-1 leading-snug">
                    {f.q}
                  </div>
                </div>
                <span
                  aria-hidden
                  className="shrink-0 w-8 h-8 grid place-items-center rounded-full bg-brand-600/15 border border-brand-600/40 text-brand-400 text-xl leading-none group-open:bg-brand-600 group-open:text-white group-open:rotate-45 transition"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-white/75 leading-relaxed text-sm sm:text-base">
                {f.a}
              </p>
            </details>
          ))}

          {filtered.length === 0 && (
            <p className="text-center text-white/60 py-12">
              No questions in this category yet.
            </p>
          )}
        </div>
      </section>

      {/* STILL HAVE QUESTIONS CTA */}
      <section className="border-t border-border bg-gradient-to-b from-brand-900/30 to-black py-14">
        <div className="container-x text-center max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl font-black leading-tight">
            Still have <span className="text-brand-500">questions?</span>
          </h2>
          <p className="text-white/70 mt-3">
            A real person picks up the phone. WhatsApp also works — we reply
            during operating hours, usually within minutes.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn-primary">
              Contact Us
            </Link>
            <Link href="/branches" className="btn-secondary">
              Call a Branch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
