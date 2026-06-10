"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { SITE, BRANCHES, NAV_LINKS } from "@/lib/constants";
import Logo from "./Logo";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    // Phase 2: wire to real endpoint. For now, optimistic success.
    setStatus("ok");
    setEmail("");
    setTimeout(() => setStatus("idle"), 4000);
  }

  return (
    <footer className="bg-black text-white border-t border-border mt-16">
      <div className="container-x py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Logo variant="stacked" height={130} />
          <p className="text-sm text-white/65 leading-relaxed mt-5">
            {SITE.description}
          </p>
          <div className="flex gap-2.5 mt-5">
            <Social href={SITE.socials.facebook} label="Facebook">
              <FacebookIcon />
            </Social>
            <Social href={SITE.socials.instagram} label="Instagram">
              <InstagramIcon />
            </Social>
            <Social href={SITE.socials.youtube} label="YouTube">
              <YouTubeIcon />
            </Social>
            <Social href={SITE.socials.tiktok} label="TikTok">
              <TikTokIcon />
            </Social>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-display text-lg font-bold mb-4 text-brand-500 uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm text-white/75">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="hover:text-brand-500 transition inline-block"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Branches */}
        <div>
          <h4 className="font-display text-lg font-bold mb-4 text-brand-500 uppercase tracking-wider">
            Our Branches
          </h4>
          <ul className="space-y-3 text-sm text-white/75">
            {BRANCHES.map((b) => (
              <li key={b.id}>
                <div className="font-semibold text-white">{b.name}</div>
                <div className="text-xs text-white/50 mb-0.5">{b.address}</div>
                <a
                  href={`tel:${b.phone}`}
                  className="text-brand-500 hover:underline font-medium inline-flex items-center gap-1.5"
                >
                  <PhoneIcon /> {b.phoneDisplay}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-display text-lg font-bold mb-4 text-brand-500 uppercase tracking-wider">
            Stay Updated
          </h4>
          <p className="text-sm text-white/65 mb-3">
            Get exclusive offers and new menu updates.
          </p>
          <form onSubmit={handleSubscribe} className="flex" noValidate>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              placeholder="your@email.com"
              aria-label="Email address"
              className="flex-1 min-w-0 px-4 py-2.5 rounded-l-full bg-surface border border-border focus:border-brand-600 focus:outline-none text-sm"
            />
            <button
              type="submit"
              className="bg-brand-600 hover:bg-brand-500 px-5 rounded-r-full font-bold text-sm transition shrink-0"
            >
              Join
            </button>
          </form>
          <div
            role="status"
            aria-live="polite"
            className="min-h-[20px] mt-2 text-xs"
          >
            {status === "ok" && (
              <span className="text-accent-400">Subscribed! Check your inbox soon.</span>
            )}
            {status === "error" && (
              <span className="text-brand-500">Please enter a valid email.</span>
            )}
          </div>
          <div className="mt-4 text-sm text-white/70 space-y-1.5">
            <div className="inline-flex items-center gap-2">
              <MailIcon /> <span>{SITE.email}</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <ClockIcon /> <span>{SITE.hours}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-x py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/50">
          <div>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </div>
          <div className="flex gap-4">
            <Link href="/faq" className="hover:text-brand-500 transition">
              FAQ
            </Link>
            <Link href="/contact" className="hover:text-brand-500 transition">
              Contact
            </Link>
            <Link href="/branches" className="hover:text-brand-500 transition">
              Branches
            </Link>
          </div>
        </div>
        <div className="container-x pb-5 text-center text-[11px] text-white/40">
          Made with <span className="text-brand-500" aria-label="love">♥</span> in Lahore
        </div>
      </div>
    </footer>
  );
}

function Social({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-full bg-surface border border-border grid place-items-center text-white/75 hover:text-white hover:bg-brand-600 hover:border-brand-600 transition"
    >
      {children}
    </a>
  );
}

/* --- SVG icons (inline, no external deps) --- */

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 0 0 .5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3 3 0 0 0 2.1 2.1C4.5 20 12 20 12 20s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1C24 15.6 24 12 24 12s0-3.6-.5-5.5zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.6 2h-3v13.4a2.6 2.6 0 1 1-2.6-2.6c.28 0 .55.04.8.13V9.85a5.6 5.6 0 1 0 4.8 5.55V8.7a7.1 7.1 0 0 0 4.1 1.3V6.95A4.1 4.1 0 0 1 16.6 2z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
