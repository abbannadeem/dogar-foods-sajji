import type { Metadata } from "next";
import { BRANCHES, SITE } from "@/lib/constants";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Dogar Foods & Sajji. Three branches across Lahore and Faisalabad. Reservations, catering, feedback — we reply within 24 hours.",
};

export default function ContactPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative bg-black border-b border-border py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 via-transparent to-transparent" />
        <div className="container-x relative">
          <div className="max-w-2xl">
            <span className="text-[11px] uppercase tracking-[0.32em] text-brand-500 font-bold">
              Get In Touch
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black mt-3 leading-[1.05]">
              Reservations. Catering. <br className="hidden sm:block" />
              <span className="text-brand-500">Or just to say salam.</span>
            </h1>
            <p className="text-white/75 mt-5 max-w-xl text-base sm:text-lg">
              Pick up the phone, drop a WhatsApp, or send the form below. A
              human replies — usually within a few hours, always within 24.
            </p>
          </div>
        </div>
      </section>

      <section className="container-x py-14 md:py-20">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-14">
          {/* FORM */}
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-brand-500 font-bold">
              Send a Message
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black mt-2 leading-tight">
              Tell us what you need
            </h2>
            <p className="text-white/70 text-sm mt-2 mb-6">
              We&apos;ll reply within 24 hours. For urgent orders, call the
              branch nearest you.
            </p>

            <ContactForm />
          </div>

          {/* BRANCH INFO */}
          <aside>
            <span className="text-[11px] uppercase tracking-[0.3em] text-brand-500 font-bold">
              Visit Us
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black mt-2 leading-tight">
              Three kitchens, one recipe
            </h2>
            <p className="text-white/70 text-sm mt-2 mb-6">
              All branches open {SITE.hours.toLowerCase()}.
            </p>

            <div className="space-y-3">
              {BRANCHES.map((b) => (
                <div
                  key={b.id}
                  className="bg-surface rounded-2xl p-5 border border-border hover:border-brand-600/60 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-brand-500 font-bold">
                        {b.city}
                      </div>
                      <h3 className="font-display text-lg font-extrabold text-white mt-1">
                        {b.name}
                      </h3>
                    </div>
                    <a
                      href={b.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open map for ${b.name}`}
                      className="shrink-0 w-9 h-9 rounded-lg bg-white/5 border border-white/15 grid place-items-center text-white/70 hover:text-brand-500 hover:border-brand-600/60 transition"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </a>
                  </div>
                  <p className="text-sm text-white/70 mt-2 leading-relaxed">
                    {b.address}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={`tel:${b.phone}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-600/15 border border-brand-600/40 text-brand-400 hover:bg-brand-600 hover:text-white text-xs font-bold uppercase tracking-wider transition"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      {b.phoneDisplay}
                    </a>
                    <a
                      href={`https://wa.me/${b.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-white text-xs font-bold uppercase tracking-wider transition"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.2-.5-2.4-1.5-.9-.8-1.5-1.8-1.6-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.1-1.3c1.5.8 3.1 1.2 4.8 1.2h.1C17.5 22 22 17.5 22 12S17.5 2 12 2z" />
                      </svg>
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 bg-gradient-to-br from-brand-900/40 to-black border border-brand-700/50 rounded-2xl p-5">
              <div className="text-[10px] uppercase tracking-[0.25em] text-brand-400 font-bold">
                General Inquiries
              </div>
              <div className="font-display font-extrabold uppercase text-white mt-1">
                Catering · Press · Partnerships
              </div>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex items-center gap-2 text-brand-500 text-sm hover:text-brand-400 font-bold mt-2 transition"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                {SITE.email}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
