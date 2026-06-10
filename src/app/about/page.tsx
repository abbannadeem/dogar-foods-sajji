import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Born in Tajpura, Lahore. Dogar Foods & Sajji is a family-run Baloch-Punjabi kitchen serving slow-roasted Sajji and hand-pounded karahi across Lahore and Faisalabad since 2019.",
};

const IMG_HERO =
  "https://images.unsplash.com/photo-1653233797467-1a528819fd4f?w=1600&q=80&auto=format&fit=crop";
const IMG_SPICES =
  "https://images.unsplash.com/photo-1716816211590-c15a328a5ff0?w=1600&q=80&auto=format&fit=crop";
const IMG_FLAME =
  "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1600&q=80&auto=format&fit=crop";

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative bg-black overflow-hidden">
        <div className="relative h-[60vh] min-h-[420px] max-h-[640px] w-full">
          <Image
            src={IMG_HERO}
            alt="Chef cooking traditional Pakistani dish over open flame"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900/50 via-transparent to-black/60" />
          <div className="container-x absolute inset-0 flex flex-col items-start justify-end pb-12 md:pb-16">
            <span className="text-[11px] uppercase tracking-[0.32em] text-brand-500 font-bold">
              Our Story · Since 2019
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black mt-3 leading-[1.05] max-w-3xl">
              Born from a <span className="text-brand-500">Family Kitchen</span>
            </h1>
            <p className="text-white/80 mt-4 max-w-xl text-base sm:text-lg">
              A Baloch-Punjabi family. One backyard flame. Three branches later,
              the recipe still has not changed.
            </p>
          </div>
        </div>
      </section>

      {/* STORY 2-COL */}
      <section className="container-x py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border lg:sticky lg:top-28">
            <Image
              src={IMG_SPICES}
              alt="Hand-pounded Pakistani spices in brass bowls"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-[10px] uppercase tracking-[0.3em] text-brand-400 font-bold">
                Hand-pounded · Never pre-ground
              </div>
            </div>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-brand-500 font-bold">
              How It Started
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black mt-2 leading-tight">
              One backyard flame in <br className="hidden sm:block" />
              <span className="text-brand-500">Tajpura, Lahore</span>
            </h2>

            <div className="mt-6 space-y-5 text-white/80 leading-relaxed">
              <p>
                It started in 2019. A small counter shop in Tajpura, Lahore,
                opened by a Baloch family who refused to serve frozen meat or
                pre-ground masalas. Our owner&apos;s nani brought her recipes
                from Balochistan — the spice ratios for Sajji that her own
                mother had taught her — and married them with the Punjabi
                karahi traditions of his father&apos;s side.
              </p>
              <p>
                Word travelled the way it does in Lahore — slowly, then all at
                once. By 2022 we opened Garhi Shahu, a few minutes from the
                Railway Station, for the late-night crowd that pours out of
                Cineplex after midnight shows. In 2024 Faisalabad on Susan Road
                followed, because too many families had started driving the
                motorway just to eat with us.
              </p>
              <p>
                Three branches in. The fire is still open. The spices are still
                pounded by hand the morning of. The Sajji is still pulled off
                the flame when the skin cracks, never a minute before. We grew
                because we refused to change — not the other way around.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-surface border-y border-border py-16 md:py-20">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] uppercase tracking-[0.3em] text-brand-500 font-bold">
              What We Believe
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black mt-2 leading-tight">
              Three things we will <span className="text-brand-500">never</span> compromise on
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <ValueCard
              title="Quality"
              text="Local Baloch-owned farms we have bought from since day one. Meat butchered the same morning. No freezers, no shortcuts."
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M9 12l2 2 4-4" />
                  <path d="M12 2l3 1.5L18 3l1 3 3 1.5-1.5 3L22 13.5l-3 1.5L18 18l-3 .5L13.5 22 12 19.5 9 22l-1.5-3.5L4.5 18 4 14.5 1 13.5l1.5-3.5L1 7.5 4 6l1-3 3 .5z" />
                </svg>
              }
            />
            <ValueCard
              title="Tradition"
              text="Open-flame Sajji. Hand-pounded masalas. Coal-fired karahis. The way Baloch and Punjabi kitchens worked before everything got fast."
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
                </svg>
              }
            />
            <ValueCard
              title="Family"
              text="Every dish on the menu has a person attached. Nani&apos;s Sajji. Chacha&apos;s karahi. We cook for you the way we cook for them — same plate, same care."
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* PROCESS TIMELINE */}
      <section className="container-x py-16 md:py-20">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <span className="text-[11px] uppercase tracking-[0.3em] text-brand-500 font-bold">
              The Craft
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black mt-2 leading-tight">
              How a single Sajji <br className="hidden sm:block" />
              <span className="text-brand-500">takes shape</span>
            </h2>
            <p className="text-white/70 mt-4 leading-relaxed">
              No microwaves. No shortcuts. From morning butcher to your plate
              takes us six hours and four pairs of hands.
            </p>
            <div className="relative mt-6 aspect-[4/3] rounded-2xl overflow-hidden border border-border">
              <Image
                src={IMG_FLAME}
                alt="Open flame grilling close-up"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <ol className="relative border-l-2 border-brand-700/60 pl-8 space-y-10">
            <Step
              n="01"
              title="Sourcing at sunrise"
              text="Whole chicken from the same Baloch-owned farm we have used since 2019. Picked up at 6 AM, on our counter by 7."
            />
            <Step
              n="02"
              title="Hand-pounded masala"
              text="Eight spices — cumin, coriander, kalonji, anardana and our family blend — pounded fresh that morning in a stone mortar. Never pre-ground."
            />
            <Step
              n="03"
              title="Slow rub, long rest"
              text="Salt and our masala rubbed deep into scored skin. Then a four-hour rest so flavour goes past the bone."
            />
            <Step
              n="04"
              title="Open flame, no clock"
              text="Roasted slowly above an open coal flame. We do not time it. We pull it off when the skin cracks and juice runs hot. Plated, sent."
            />
          </ol>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="border-t border-border bg-gradient-to-b from-brand-900/30 to-black py-14">
        <div className="container-x text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-black leading-tight">
            Ready to taste what <span className="text-brand-500">six hours</span> tastes like?
          </h2>
          <p className="text-white/70 mt-3 max-w-xl mx-auto">
            Browse the menu or walk in. Either way, the fire is already going.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/menu" className="btn-primary">
              See the Menu
            </Link>
            <Link href="/branches" className="btn-secondary">
              Find a Branch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ValueCard({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="bg-black rounded-2xl p-6 border border-border hover:border-brand-600/70 transition group">
      <div className="w-12 h-12 rounded-xl bg-brand-600/15 border border-brand-600/40 text-brand-400 grid place-items-center group-hover:bg-brand-600 group-hover:text-white transition">
        {icon}
      </div>
      <h3 className="font-display text-xl font-extrabold uppercase text-white mt-5">
        {title}
      </h3>
      <p className="text-sm text-white/70 mt-2 leading-relaxed">{text}</p>
    </article>
  );
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <li className="relative">
      <span className="absolute -left-[2.6rem] top-0 w-10 h-10 rounded-full bg-black border-2 border-brand-600 text-brand-500 font-display font-black grid place-items-center text-sm">
        {n}
      </span>
      <h3 className="font-display text-xl sm:text-2xl font-extrabold uppercase text-white leading-tight">
        {title}
      </h3>
      <p className="text-white/75 mt-2 leading-relaxed">{text}</p>
    </li>
  );
}
