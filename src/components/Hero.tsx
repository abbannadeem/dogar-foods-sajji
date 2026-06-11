import Link from "next/link";
import Image from "next/image";
import { PRIMARY_WHATSAPP } from "@/lib/constants";
import { formatPKR } from "@/data/menu";

const HERO_BG =
  "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=1600&q=80&auto=format&fit=crop";
const SAJJI_IMG =
  "https://images.unsplash.com/photo-1641873933980-fcff60026f50?w=800&q=80&auto=format&fit=crop";
const KARAHI_IMG =
  "https://images.unsplash.com/photo-1617692855027-33b14f061079?w=800&q=80&auto=format&fit=crop";

export default function Hero() {
  const waMsg = encodeURIComponent(
    "Assalam-o-Alaikum! I want to order from Dogar Foods & Sajji."
  );
  return (
    <section className="relative overflow-hidden bg-black text-white">
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image
          src={HERO_BG}
          alt="Premium Pakistani grilled meat platter"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover"
        />
        {/* Dark gradient overlay (top-left -> bottom-right) */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/75 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="container-x relative py-20 md:py-28 lg:py-32 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* LEFT: copy */}
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/15 backdrop-blur-md rounded-full text-[11px] uppercase tracking-[0.18em] font-semibold text-white/90 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            Lahore · Faisalabad · Since 2019
          </span>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] uppercase text-balance tracking-tight">
            Smoke. <br />
            <span className="text-brand-500">Spice.</span> <br />
            Sajji.
          </h1>

          <p className="mt-7 text-lg text-white/80 max-w-lg leading-relaxed">
            Born in Tajpura, Lahore. Slow-roasted over open flame the way Baloch
            grandmothers taught — hand-pounded spices, zero shortcuts, served
            hot till 4 AM.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/menu" className="btn-primary">
              Order Now
            </Link>
            <a
              href={`https://wa.me/${PRIMARY_WHATSAPP}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              WhatsApp Order
            </a>
          </div>

          {/* Trust strip */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs uppercase tracking-[0.15em] text-white/70">
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-brand-500" />
              3 Branches
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-brand-500" />
              50+ Dishes
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-brand-500" />
              Halal Certified
            </span>
          </div>
        </div>

        {/* RIGHT: floating product cards */}
        <div className="relative hidden lg:block min-h-[520px]">
          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-brand-600/25 rounded-full blur-[120px] pointer-events-none" />

          {/* Card 1: Sajji (top) */}
          <FloatingCard
            className="absolute top-4 right-8 w-[280px]"
            image={SAJJI_IMG}
            alt="Whole roasted chicken Sajji"
            badge="Bestseller"
            name="Full Chicken Sajji"
            price={2499}
          />

          {/* Card 2: Karahi (bottom) */}
          <FloatingCard
            className="absolute bottom-4 left-0 w-[280px]"
            image={KARAHI_IMG}
            alt="Mutton karahi in wok"
            badge="Chef's Choice"
            name="Mutton Karahi"
            price={3999}
          />
        </div>
      </div>
    </section>
  );
}

function FloatingCard({
  className,
  image,
  alt,
  badge,
  name,
  price,
}: {
  className?: string;
  image: string;
  alt: string;
  badge: string;
  name: string;
  price: number;
}) {
  return (
    <div
      className={`group bg-surface/90 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-warm hover:-translate-y-1 hover:border-brand-600/60 transition-all duration-300 ${
        className ?? ""
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="280px"
          quality={85}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="p-4">
        <div className="text-[10px] uppercase tracking-[0.18em] text-brand-400 font-bold">
          {badge}
        </div>
        <div className="font-display text-lg font-bold text-white mt-1 leading-tight">
          {name}
        </div>
        <div className="text-brand-500 font-extrabold mt-1">
          {formatPKR(price)}
        </div>
      </div>
    </div>
  );
}
