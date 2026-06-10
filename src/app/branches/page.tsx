import type { Metadata } from "next";
import Link from "next/link";
import BranchCards from "@/components/BranchCards";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Our Branches",
  description:
    "Three Dogar Foods & Sajji branches across Lahore and Faisalabad — Tajpura, Garhi Shahu and Susan Road. Areas we deliver, hours, and how to reach us.",
};

type CityServed = {
  city: string;
  branchName: string;
  areas: string[];
};

const SERVICE_AREAS: CityServed[] = [
  {
    city: "Lahore — Tajpura Branch",
    branchName: "tajpura",
    areas: [
      "Tajpura",
      "Mughalpura",
      "Salamatpura",
      "Shalimar",
      "Baghbanpura",
      "Harbanspura",
      "Daroghawala",
      "Awan Town",
    ],
  },
  {
    city: "Lahore — Garhi Shahu Branch",
    branchName: "garhi-shahu",
    areas: [
      "Garhi Shahu",
      "Railway Station Area",
      "Empress Road",
      "Mayo Hospital Area",
      "Allama Iqbal Road",
      "Mozang",
      "Davis Road",
      "Old Anarkali",
    ],
  },
  {
    city: "Faisalabad — Susan Road Branch",
    branchName: "faisalabad",
    areas: [
      "Susan Road",
      "Madina Town",
      "Wapda City",
      "Eden Valley",
      "D-Ground",
      "Peoples Colony",
      "Jaranwala Road",
      "Satiana Road",
    ],
  },
];

export default function BranchesPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative bg-black border-b border-border py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 via-transparent to-transparent" />
        <div className="container-x relative">
          <div className="max-w-2xl">
            <span className="text-[11px] uppercase tracking-[0.32em] text-brand-500 font-bold">
              Locations
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black mt-3 leading-[1.05]">
              Three kitchens. <br className="hidden sm:block" />
              <span className="text-brand-500">One recipe.</span>
            </h1>
            <p className="text-white/75 mt-5 text-base sm:text-lg max-w-xl">
              Lahore and Faisalabad. Open {SITE.hours.toLowerCase()} — the
              flame does not go out, and neither do we.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            <Stat label="Branches" value="3" />
            <Stat label="Open Daily" value="16 hrs" />
            <Stat label="Delivery Radius" value="6 km" />
            <Stat label="Since" value="2019" />
          </div>
        </div>
      </section>

      <BranchCards />

      {/* AREAS SERVED */}
      <section className="container-x py-16 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] uppercase tracking-[0.3em] text-brand-500 font-bold">
            Delivery Zones
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black mt-2 leading-tight">
            Areas we <span className="text-brand-500">deliver to</span>
          </h2>
          <p className="text-white/70 mt-3">
            Enter your full address at checkout to confirm. Outside these zones
            you can still pick up from the branch.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICE_AREAS.map((s) => (
            <article
              key={s.branchName}
              className="bg-surface border border-border rounded-2xl p-6 hover:border-brand-600/60 transition"
            >
              <div className="text-[10px] uppercase tracking-[0.25em] text-brand-500 font-bold">
                Delivers to
              </div>
              <h3 className="font-display text-lg sm:text-xl font-extrabold text-white mt-1 leading-tight">
                {s.city}
              </h3>
              <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2">
                {s.areas.map((a) => (
                  <li
                    key={a}
                    className="flex items-center gap-2 text-sm text-white/75"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="text-center text-white/60 text-sm mt-8">
          Don&apos;t see your area? Call the nearest branch — we sometimes
          deliver further during quieter hours.
        </p>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-gradient-to-b from-brand-900/30 to-black py-14">
        <div className="container-x text-center max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl font-black leading-tight">
            Picked your <span className="text-brand-500">branch?</span>
          </h2>
          <p className="text-white/70 mt-3">
            Browse the menu and place an order — or walk in. The fire is
            already going.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/menu" className="btn-primary">
              See the Menu
            </Link>
            <Link href="/contact" className="btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-display text-2xl sm:text-3xl font-black text-brand-500">
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-[0.25em] text-white/60 font-bold">
        {label}
      </span>
    </div>
  );
}
