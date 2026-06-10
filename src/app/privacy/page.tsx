import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Dogar Foods & Sajji collects, uses and protects your personal information.",
};

const LAST_UPDATED = "10 June 2026";

export default function PrivacyPage() {
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
            Privacy <span className="text-brand-500">Policy</span>
          </h1>
          <p className="text-white/70 mt-3 text-sm">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      <article className="container-x py-12 md:py-16 max-w-3xl prose-legal">
        <p className="text-white/80 leading-relaxed">
          {SITE.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;)
          respects your privacy. This policy explains what information we
          collect when you order with us, browse our website, or contact our
          branches, and how we use it.
        </p>

        <Section title="Information We Collect">
          <p>We collect only what we need to take and deliver your order:</p>
          <ul>
            <li>
              <strong>Contact details</strong> — name, phone number, email,
              delivery address.
            </li>
            <li>
              <strong>Order details</strong> — items ordered, special
              instructions, branch, time.
            </li>
            <li>
              <strong>Payment data</strong> — handled by our payment partners
              (SafePay, JazzCash, EasyPaisa). We do not store full card numbers.
            </li>
            <li>
              <strong>Website usage</strong> — IP address, browser type, pages
              visited, gathered via standard logs and cookies.
            </li>
          </ul>
        </Section>

        <Section title="How We Use It">
          <ul>
            <li>To prepare, deliver and track your order.</li>
            <li>
              To contact you about your order, reservation, or catering
              inquiry.
            </li>
            <li>
              To send service updates and — only with your opt-in — occasional
              offers.
            </li>
            <li>
              To improve our menu, website and operations based on aggregated,
              anonymised usage patterns.
            </li>
            <li>
              To meet legal, tax and accounting requirements under Pakistani
              law.
            </li>
          </ul>
        </Section>

        <Section title="Cookies">
          <p>
            We use a small number of cookies to keep your cart, remember your
            preferred branch, and measure traffic. You can clear or block
            cookies in your browser settings. Doing so may break parts of the
            ordering flow.
          </p>
        </Section>

        <Section title="Sharing Your Data">
          <p>We share your details only with:</p>
          <ul>
            <li>The branch fulfilling your order.</li>
            <li>Delivery riders, limited to your address and phone.</li>
            <li>
              Payment processors (SafePay and equivalent) to take payment.
            </li>
            <li>
              Authorities, when legally required (court orders, tax audits).
            </li>
          </ul>
          <p>We never sell your data to advertisers.</p>
        </Section>

        <Section title="Your Rights">
          <p>You can ask us, any time, to:</p>
          <ul>
            <li>See what data we hold on you.</li>
            <li>Correct anything that is wrong.</li>
            <li>Delete your account and order history.</li>
            <li>Stop marketing messages.</li>
          </ul>
          <p>
            Email{" "}
            <a href={`mailto:${SITE.email}`} className="text-brand-500 hover:underline">
              {SITE.email}
            </a>{" "}
            and we will respond within 30 days.
          </p>
        </Section>

        <Section title="Data Retention">
          <p>
            We keep order records for up to 7 years to meet tax and accounting
            rules. Marketing contact details are deleted when you unsubscribe.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy? Reach us at{" "}
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
      <div className="mt-3 space-y-3 text-white/80 leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mt-2 [&_li]:text-white/80 [&_strong]:text-white">
        {children}
      </div>
    </section>
  );
}
