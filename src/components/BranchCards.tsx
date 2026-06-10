"use client";

import Image from "next/image";
import { BRANCHES, SITE } from "@/lib/constants";

const BRANCH_IMAGES: Record<string, string> = {
  tajpura:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80&auto=format&fit=crop",
  "garhi-shahu":
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80&auto=format&fit=crop",
  faisalabad:
    "https://images.unsplash.com/photo-1565650834520-0b48a5c83f43?w=1200&q=80&auto=format&fit=crop",
};

// Hours: 12 PM - 4 AM. We treat "open" as hour in [12, 23] OR [0, 3].
function isOpenNow(): boolean {
  const h = new Date().getHours();
  return h >= 12 || h <= 3;
}

export default function BranchCards() {
  const openNow = isOpenNow();

  return (
    <section className="bg-surface py-16 md:py-20 border-y border-border">
      <div className="container-x">
        <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-brand-500 font-bold">
              Locations
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black mt-2 uppercase leading-[1.05] tracking-tight">
              Find Us in <br className="hidden sm:block" />
              Your City
            </h2>
          </div>
          <p className="text-muted text-sm max-w-xs">
            Three kitchens, one recipe. Open {SITE.hours} — including late-night
            cravings.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {BRANCHES.map((b) => (
            <article
              key={b.id}
              className="group bg-black rounded-2xl overflow-hidden border border-border hover:border-brand-600/70 hover:shadow-warm transition-all duration-300"
            >
              {/* Header image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={BRANCH_IMAGES[b.id] ?? BRANCH_IMAGES.tajpura}
                  alt={`${b.name} interior`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  quality={80}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Open badge */}
                <div className="absolute top-4 left-4">
                  {openNow ? (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 backdrop-blur text-[10px] uppercase tracking-[0.18em] font-bold text-emerald-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Open Now
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur text-[10px] uppercase tracking-[0.18em] font-bold text-white/80">
                      Opens at 12 PM
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="text-[11px] uppercase tracking-[0.22em] text-brand-500 font-bold">
                  {b.city}
                </div>
                <h3 className="font-display text-2xl font-extrabold text-white mt-1 leading-tight">
                  {b.name}
                </h3>
                <p className="text-sm text-muted mt-3 leading-relaxed">
                  {b.address}
                </p>

                {/* Actions */}
                <div className="mt-5 grid grid-cols-3 gap-2">
                  <a
                    href={`tel:${b.phone}`}
                    aria-label={`Call ${b.name}`}
                    className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg bg-brand-600/15 border border-brand-600/40 text-brand-400 hover:bg-brand-600 hover:text-white transition text-[11px] font-bold uppercase tracking-wider"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    Call
                  </a>
                  <a
                    href={`https://wa.me/${b.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WhatsApp ${b.name}`}
                    className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-white transition text-[11px] font-bold uppercase tracking-wider"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.2-.5-2.4-1.5-.9-.8-1.5-1.8-1.6-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.1-1.3c1.5.8 3.1 1.2 4.8 1.2h.1C17.5 22 22 17.5 22 12S17.5 2 12 2z" />
                    </svg>
                    WhatsApp
                  </a>
                  <a
                    href={b.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Directions to ${b.name}`}
                    className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white/80 hover:bg-white/10 hover:text-white transition text-[11px] font-bold uppercase tracking-wider"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Directions
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
