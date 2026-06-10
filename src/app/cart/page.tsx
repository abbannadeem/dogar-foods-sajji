import Link from "next/link";
import { PRIMARY_WHATSAPP } from "@/lib/constants";

export const metadata = {
  title: "Cart — Coming Soon | Dogar Foods & Sajji",
  description:
    "Online cart and checkout are launching in Phase 2. Order via WhatsApp or call your nearest Dogar Foods branch.",
};

export default function CartPage() {
  const waHref = `https://wa.me/${PRIMARY_WHATSAPP}?text=${encodeURIComponent(
    "Assalam-o-Alaikum! I'd like to place an order from Dogar Foods & Sajji."
  )}`;

  return (
    <div className="container-x py-20 sm:py-28">
      <div className="max-w-2xl mx-auto text-center">
        {/* Large icon */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-brand-600/20 blur-3xl rounded-full" aria-hidden="true" />
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full bg-gradient-to-br from-brand-700 to-brand-900 border border-brand-600/40 grid place-items-center shadow-warm">
            <svg
              viewBox="0 0 24 24"
              className="w-14 h-14 sm:w-16 sm:h-16 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
        </div>

        {/* Eyebrow */}
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-500 mb-3">
          Phase 2 &middot; Launching Soon
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold uppercase leading-tight">
          Cart Coming <span className="text-brand-500">Soon</span>
        </h1>

        {/* Body */}
        <p className="text-base sm:text-lg text-white/70 mt-5 leading-relaxed max-w-xl mx-auto">
          We&apos;re building online checkout the right way — fast, secure, and synced
          with our kitchens. In the meantime, the fastest route to a hot plate is
          WhatsApp or a quick call to your nearest branch.
        </p>

        {/* CTAs */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/menu" className="btn-primary min-w-[180px] justify-center">
            Browse the Menu
          </Link>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary min-w-[180px] justify-center"
          >
            Order on WhatsApp
          </a>
        </div>

        {/* Secondary */}
        <div className="mt-10 pt-8 border-t border-border/60">
          <p className="text-sm text-white/55">
            Prefer to call?{" "}
            <Link
              href="/branches"
              className="text-brand-500 font-semibold hover:underline"
            >
              See all branch numbers
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
