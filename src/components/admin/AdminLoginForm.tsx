"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setError(data.error || "Invalid password");
        setBusy(false);
        return;
      }
      router.replace(redirectTo);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-surface border border-border rounded-2xl p-6 space-y-4"
      noValidate
    >
      <label htmlFor="password" className="block">
        <span className="text-xs uppercase tracking-wider text-muted font-bold block mb-1.5">
          Password
        </span>
        <input
          id="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-brand-600 focus:outline-none text-sm"
        />
      </label>

      {error && (
        <div
          role="alert"
          className="text-sm text-brand-500 bg-brand-900/20 border border-brand-700/40 rounded-lg px-3 py-2"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={busy || !password}
        className="btn-primary w-full justify-center disabled:opacity-50"
      >
        {busy ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
