"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "./OrderStatusBadge";

export default function OrdersFilterBar({
  initialSearch,
  initialStatus,
}: {
  initialSearch: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [, startTransition] = useTransition();

  // Debounce search updates
  useEffect(() => {
    const handle = setTimeout(() => {
      apply({ q: search.trim() || undefined, status });
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function apply(next: { q?: string; status?: string }) {
    const usp = new URLSearchParams(params.toString());
    if (next.q) usp.set("q", next.q);
    else usp.delete("q");
    if (next.status && next.status !== "ALL") usp.set("status", next.status);
    else usp.delete("status");
    const qs = usp.toString();
    startTransition(() => {
      router.replace("/admin/orders" + (qs ? "?" + qs : ""));
    });
  }

  function onStatus(v: string) {
    setStatus(v);
    apply({ q: search.trim() || undefined, status: v });
  }

  function clear() {
    setSearch("");
    setStatus("ALL");
    startTransition(() => router.replace("/admin/orders"));
  }

  const hasFilters = (initialSearch && initialSearch.length > 0) || initialStatus !== "ALL";

  return (
    <div className="bg-surface border border-border rounded-2xl p-3 flex flex-wrap items-center gap-2">
      <input
        type="search"
        placeholder="Search by order #, name, phone, area..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 min-w-[200px] px-4 py-2 rounded-lg bg-background border border-border focus:border-brand-600 focus:outline-none text-sm"
      />
      <select
        value={status}
        onChange={(e) => onStatus(e.target.value)}
        className="px-3 py-2 rounded-lg bg-background border border-border focus:border-brand-600 focus:outline-none text-sm"
        aria-label="Filter by status"
      >
        <option value="ALL">All statuses</option>
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {ORDER_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {hasFilters && (
        <button
          type="button"
          onClick={clear}
          className="px-3 py-2 rounded-lg border border-border text-xs uppercase tracking-wider text-muted hover:text-brand-500 hover:border-brand-600/50"
        >
          Clear
        </button>
      )}
    </div>
  );
}
