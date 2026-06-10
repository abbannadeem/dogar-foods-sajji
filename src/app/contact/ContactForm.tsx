"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    // Simulate request — real backend can wire here later.
    setTimeout(() => {
      setStatus("sent");
      alert("Message received - we will reply within 24h.");
      (e.target as HTMLFormElement).reset();
      setStatus("idle");
    }, 350);
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-white placeholder:text-white/40 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30 transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-[11px] uppercase tracking-[0.2em] text-white/60 font-bold mb-2">
            Your Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Ahmed Khan"
            required
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-[11px] uppercase tracking-[0.2em] text-white/60 font-bold mb-2">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="0300 1234567"
            required
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-[11px] uppercase tracking-[0.2em] text-white/60 font-bold mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@email.com"
          required
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="reason" className="block text-[11px] uppercase tracking-[0.2em] text-white/60 font-bold mb-2">
          Reason
        </label>
        <select
          id="reason"
          name="reason"
          defaultValue=""
          required
          className={inputCls}
        >
          <option value="" disabled>
            Choose one
          </option>
          <option value="reservation">Reservation</option>
          <option value="catering">Catering / Bulk Order</option>
          <option value="feedback">Feedback</option>
          <option value="complaint">Complaint</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-[11px] uppercase tracking-[0.2em] text-white/60 font-bold mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Tell us what you need — date, headcount, dishes, anything."
          required
          className={`${inputCls} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>

      <p className="text-[11px] text-white/50 text-center">
        We never share your details. We reply from our booking address.
      </p>
    </form>
  );
}
