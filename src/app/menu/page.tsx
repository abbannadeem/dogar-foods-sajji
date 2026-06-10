import { Suspense } from "react";
import type { Metadata } from "next";
import MenuPageClient from "@/components/MenuPageClient";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Full menu — Sajji, Karahi, BBQ, Tandoor, Fish and more. Authentic Pakistani dishes with PKR pricing.",
};

export default function MenuPage() {
  return (
    <>
      <section className="relative bg-black border-b border-border py-14 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 via-transparent to-brand-700/10" />
        <div className="absolute -top-24 right-0 w-[28rem] h-[28rem] bg-brand-600/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 left-0 w-[22rem] h-[22rem] bg-accent-500/10 rounded-full blur-[110px]" />

        <div className="container-x text-center relative">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-brand-500 font-bold">
            <span className="h-px w-8 bg-brand-500/50" />
            The Full Menu
            <span className="h-px w-8 bg-brand-500/50" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold mt-4 uppercase text-white leading-[1.05]">
            Burnt Edges.{" "}
            <span className="text-brand-500">Bold Spices.</span>
            <br className="hidden sm:block" /> No Shortcuts.
          </h1>
          <p className="text-white/70 mt-5 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
            Everything made to order. Everything pulled hot off the flame, the wok, or the clay oven. Filter by corner, search by dish.
          </p>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="container-x py-10 text-muted text-sm">
            Loading menu...
          </div>
        }
      >
        <MenuPageClient />
      </Suspense>
    </>
  );
}
