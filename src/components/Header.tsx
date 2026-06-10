"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS, BRANCHES } from "@/lib/constants";
import Logo from "./Logo";
import CartIcon from "./CartIcon";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-border">
      {/* Top bar */}
      <div className="bg-brand-800/80 border-b border-brand-700/40 text-white/85 text-[11px]">
        <div className="container-x flex items-center justify-between py-2.5">
          <span className="hidden sm:inline tracking-wide">
            Open Daily &middot; 12:00 PM – 4:00 AM
          </span>
          <div className="flex items-center gap-4">
            {BRANCHES.map((b) => (
              <a
                key={b.id}
                href={`tel:${b.phone}`}
                className="hover:text-accent-400 transition font-medium"
              >
                <span className="hidden md:inline opacity-70">{b.city}: </span>
                {b.phoneDisplay}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container-x flex items-center justify-between py-3">
        <Logo variant="horizontal" height={44} />

        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative text-sm font-semibold tracking-wide transition py-1 group ${
                  active ? "text-brand-500" : "text-white/85 hover:text-brand-500"
                }`}
              >
                {l.label}
                <span
                  className={`absolute left-0 -bottom-0.5 h-[2px] bg-brand-500 transition-all duration-300 ease-out ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <CartIcon />
          <Link
            href="/menu"
            className="btn-primary text-sm"
          >
            Order Now
          </Link>
        </div>

        {/* Mobile cart icon (visible next to hamburger) */}
        <div className="lg:hidden flex items-center gap-1">
          <CartIcon />
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="lg:hidden w-11 h-11 grid place-items-center rounded-lg text-white hover:bg-white/5 transition"
        >
          <span className="relative w-6 h-6 block" aria-hidden="true">
            <span
              className={`absolute left-0 top-1/2 h-[2px] w-6 bg-current transition-all duration-300 ${
                open ? "rotate-45 translate-y-0" : "-translate-y-2"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-[2px] w-6 bg-current transition-all duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-[2px] w-6 bg-current transition-all duration-300 ${
                open ? "-rotate-45 translate-y-0" : "translate-y-2"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu - full screen slide-in */}
      <div
        className={`lg:hidden fixed inset-x-0 top-[calc(var(--header-top,0px))] bottom-0 z-30 transition-all duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ top: "0", paddingTop: "var(--mobile-menu-offset, 105px)" }}
        aria-hidden={!open}
      >
        <div
          className={`h-full bg-black/95 backdrop-blur-md border-t border-border transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <nav className="container-x py-6 flex flex-col gap-1">
            {NAV_LINKS.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`min-h-[48px] flex items-center px-3 text-base font-semibold border-b border-border/60 last:border-0 transition ${
                    active
                      ? "text-brand-500 border-l-2 border-l-brand-500 bg-brand-900/10"
                      : "text-white hover:text-brand-500"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/menu"
              onClick={() => setOpen(false)}
              className="btn-primary justify-center mt-6 min-h-[52px]"
            >
              Order Now
            </Link>
            <div className="mt-8 pt-6 border-t border-border/40 space-y-3">
              <p className="text-xs uppercase tracking-wider text-white/40">Call a Branch</p>
              {BRANCHES.map((b) => (
                <a
                  key={b.id}
                  href={`tel:${b.phone}`}
                  className="block min-h-[44px] flex items-center text-sm text-white/80 hover:text-brand-500 transition"
                >
                  <span className="opacity-60 mr-2">{b.city}:</span>
                  <span className="font-semibold">{b.phoneDisplay}</span>
                </a>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
