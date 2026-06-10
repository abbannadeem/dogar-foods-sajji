import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of the Dogar Foods & Sajji website and ordering service.",
};

const LAST_UPDATED = "10 June 2026";

export default function TermsPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative bg-black border-b border-border py-14 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 via-transparent to-transparent" />
        <div className="container-x relative">
          <span className="text-[11px] uppercase tracking-[0.32em] text-brand-500 font-bold">
            Legal
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black mt-2 leading-[1.05]">
            Terms of <span className="text-brand-500">Service</span>
          </h1>
          <p className="text-white/70 mt-3 text-sm">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      <article className="container-x py-12 md:py-16 max-w-3xl">
        <p className="text-white/80 leading-relaxed">
          By using {SITE.domain} or placing an order with {SITE.name}, you
          agree to these terms. They are written in plain English so there is
          no confusion later.
        </p>

        <Section title="Use of Service">
          <ul>
            <li>
              You must be 18 or older, or have a guardian&apos;s permission, to
              place an order.
            </li>
            <li>
              Provide accurate contact and delivery details. We are not
              responsible for orders sent to a wrong address you entered.
            </li>
            <li>
              Do not misuse the site — no scraping, no automated bulk ordering,
              no impersonation.
            </li>
          </ul>
        </Section>

        <Section title="Orders">
          <ul>
            <li>
              An order is confirmed only when you receive a confirmation
              message from us (SMS, WhatsApp or email).
            </li>
            <li>
              Prices are in Pakistani Rupees (PKR) and include applicable
              taxes unless stated otherwise.
            </li>
            <li>
              Menu availability can change daily — Sajji especially, since we
              prep limited counts per service.
            </li>
            <li>
              For catering and bulk orders, a deposit and minimum notice apply
              (details on the contact page).
            </li>
          </ul>
        </Section>

        <Section title="Delivery">
          <ul>
            <li>
              We deliver inside defined zones around each branch. Outside-zone
              orders may be declined or carry an extra fee.
            </li>
            <li>
              Estimated delivery times are guidance, not guarantees. Traffic,
              weather and order volume affect them.
            </li>
            <li>
              The recipient or someone at the address must be available to
              receive the order. Repeated failed deliveries may be charged.
            </li>
          </ul>
        </Section>

        <Section title="Refunds & Cancellation">
          <ul>
            <li>
              Order cancellations are accepted only before the kitchen starts
              cooking — usually within 5 minutes of placing the order.
            </li>
            <li>
              If your food arrives wrong, cold or damaged, call the branch
              within one hour. We will replace the item or refund — your
              choice.
            </li>
            <li>
              Taste preference is subjective and is not normally a refund
              reason, but tell us — we want to know.
            </li>
            <li>
              Refunds are processed back to the original payment method within
              7 business days.
            </li>
          </ul>
        </Section>

        <Section title="Food Allergies">
          <p>
            Our kitchens handle dairy, nuts, gluten and seafood. We cannot
            guarantee an allergen-free environment. Tell us about allergies
            when you order and we will do our best.
          </p>
        </Section>

        <Section title="Intellectual Property">
          <p>
            The {SITE.name} name, logo, photography and recipes are our
            property. Do not copy them for commercial use without written
            permission.
          </p>
        </Section>

        <Section title="Liability">
          <p>
            We are responsible for delivering food that meets the description.
            We are not responsible for indirect losses — missed flights, late
            guests, delayed events — caused by a delayed delivery. Our
            maximum liability for any order is the value of that order.
          </p>
          <p>
            Nothing in these terms limits any rights you have under Pakistan
            consumer protection law.
          </p>
        </Section>

        <Section title="Changes to These Terms">
          <p>
            We can update these terms when our service changes. We will post
            the new version on this page with an updated date. Continued use
            of the service means you accept the updated terms.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about these terms? Reach us at{" "}
            <a href={`mailto:${SITE.email}`} className="text-brand-500 hover:underline">
              {SITE.email}
            </a>{" "}
            or through the{" "}
            <Link href="/contact" className="text-brand-500 hover:underline">
              contact page
            </Link>
            .
          </p>
        </Section>
      </article>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white leading-tight">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-white/80 leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mt-2 [&_li]:text-white/80">
        {children}
      </div>
    </section>
  );
}
