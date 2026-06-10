import Link from "next/link";
import Image from "next/image";
import { BRANCHES, PRIMARY_WHATSAPP, SITE } from "@/lib/constants";

const CTA_BG =
  "https://images.unsplash.com/photo-1602237514002-c2d8ae2da393?w=1600&q=80&auto=format&fit=crop";

export default function CTABanner() {
  const msg = encodeURIComponent(
    "Salaam! I want to place an order from Dogar Foods & Sajji."
  );

  return (
    <section className="container-x py-16 md:py-20">
      <div className="relative rounded-3xl overflow-hidden border border-brand-700/60 shadow-warm">
        {/* Background photo */}
        <div className="absolute inset-0">
          <Image
            src={CTA_BG}
            alt="Moody red chili spice background"
            fill
            sizes="100vw"
            quality={85}
            className="object-cover"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-brand-900/75 to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
        </div>

        <div className="relative px-6 py-14 sm:px-12 sm:py-16 md:py-20 text-center text-white">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 backdrop-blur rounded-full text-[11px] uppercase tracking-[0.22em] font-bold text-white/90 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            Hungry?
          </span>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase leading-[1.02] tracking-tight max-w-3xl mx-auto text-balance">
            Craving Lahori Sajji <br className="hidden sm:block" />
            <span className="text-brand-500">at 2 AM?</span> We&apos;ve Got You.
          </h2>

          <p className="mt-5 text-white/85 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Open {SITE.hours}. Hot to your door across Lahore &amp; Faisalabad in
            under 45 minutes.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/menu" className="btn-primary">
              Order Online
            </Link>
            <a
              href={`https://wa.me/${PRIMARY_WHATSAPP}?text=${msg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              WhatsApp Order
            </a>
          </div>

          {/* Hours + branch phones strip */}
          <div className="mt-10 pt-8 border-t border-white/15 max-w-3xl mx-auto">
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-xs">
              <div className="flex items-center gap-2 text-white/80 uppercase tracking-[0.15em] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {SITE.hours}
              </div>
              <span className="hidden sm:block w-px h-4 bg-white/20" />
              {BRANCHES.map((b, idx) => (
                <a
                  key={b.id}
                  href={`tel:${b.phone}`}
                  className="text-white/85 hover:text-brand-400 transition flex items-center gap-2"
                >
                  <span className="uppercase tracking-[0.15em] text-[10px] text-white/60 font-bold">
                    {b.city === "Lahore"
                      ? idx === 0
                        ? "Tajpura"
                        : "Garhi Shahu"
                      : "Faisalabad"}
                  </span>
                  <span className="font-bold">{b.phoneDisplay}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
