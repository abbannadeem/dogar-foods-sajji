"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { CouponType } from "@prisma/client";
import {
  upsertCouponAction,
  deleteCouponAction,
  toggleCouponAction,
} from "@/app/admin/coupons/actions";
import { formatPKR } from "@/data/menu-static";

export type CouponRow = {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrder: number;
  maxDiscount: number | null;
  validFrom: string | null;
  validUntil: string | null;
  usageLimit: number | null;
  usedCount: number;
  active: boolean;
  description: string | null;
  summary: string;
};

export default function CouponsEditor({ initial }: { initial: CouponRow[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-4">
      {!adding && (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="btn-primary text-sm"
        >
          + New coupon
        </button>
      )}

      {adding && (
        <CouponFormCard
          initial={null}
          onCancel={() => setAdding(false)}
          onSaved={() => {
            setAdding(false);
            router.refresh();
          }}
        />
      )}

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <ul className="divide-y divide-border">
          {initial.length === 0 ? (
            <li className="p-12 text-center text-muted text-sm">
              No coupons yet. Create one above.
            </li>
          ) : (
            initial.map((c) => (
              <CouponRowComponent
                key={c.id}
                row={c}
                onChanged={() => router.refresh()}
              />
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

function CouponRowComponent({
  row,
  onChanged,
}: {
  row: CouponRow;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      const res = await toggleCouponAction(row.id);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(res.active ? "Coupon active" : "Coupon paused");
      onChanged();
    });
  }

  function remove() {
    if (!confirm(`Delete coupon ${row.code}?`)) return;
    startTransition(async () => {
      const res = await deleteCouponAction(row.id);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Coupon deleted");
      onChanged();
    });
  }

  if (editing) {
    return (
      <li className="p-5">
        <CouponFormCard
          initial={row}
          onCancel={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            onChanged();
          }}
        />
      </li>
    );
  }

  const remaining =
    row.usageLimit !== null ? Math.max(0, row.usageLimit - row.usedCount) : null;

  return (
    <li className="grid grid-cols-[1fr_auto] sm:grid-cols-[1.5fr_1fr_1fr_auto_auto] gap-3 items-center px-5 py-4 hover:bg-white/[0.02]">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display font-extrabold text-lg text-white tracking-wider tabular-nums">
            {row.code}
          </span>
          <span
            className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
              row.active
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-red-500/15 text-red-400"
            }`}
          >
            {row.active ? "Active" : "Paused"}
          </span>
        </div>
        {row.description && (
          <div className="text-xs text-muted mt-0.5 truncate">{row.description}</div>
        )}
      </div>
      <div className="hidden sm:block text-sm text-white">{row.summary}</div>
      <div className="hidden sm:block text-xs text-muted">
        Min order: {formatPKR(row.minOrder)}
        {remaining !== null && (
          <>
            <br />
            {row.usedCount}/{row.usageLimit} used
          </>
        )}
      </div>
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className="text-xs uppercase tracking-wider text-muted hover:text-brand-500 px-2 disabled:opacity-50"
      >
        {row.active ? "Pause" : "Activate"}
      </button>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="w-8 h-8 grid place-items-center rounded-md hover:bg-white/5 text-white/80"
          title="Edit"
        >
          ✎
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={pending}
          className="w-8 h-8 grid place-items-center rounded-md hover:bg-brand-600/15 hover:text-brand-500"
          title="Delete"
        >
          ✕
        </button>
      </div>
    </li>
  );
}

function CouponFormCard({
  initial,
  onCancel,
  onSaved,
}: {
  initial: CouponRow | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [type, setType] = useState<CouponType>(initial?.type ?? "PERCENT");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (initial) fd.set("id", initial.id);
    startTransition(async () => {
      const res = await upsertCouponAction(fd);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(initial ? "Coupon updated" : "Coupon created");
      onSaved();
    });
  }

  function dateForInput(iso: string | null): string {
    if (!iso) return "";
    return new Date(iso).toISOString().slice(0, 10);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-surface border border-border rounded-2xl p-5 grid sm:grid-cols-2 gap-4"
    >
      <Field label="Code *" hint="Customer types this at checkout (e.g. SAJJI10).">
        <input
          name="code"
          required
          defaultValue={initial?.code ?? ""}
          maxLength={40}
          pattern="[A-Za-z0-9_-]{3,40}"
          placeholder="WELCOME10"
          className="input uppercase tracking-wider font-bold"
        />
      </Field>

      <Field label="Type *">
        <select
          name="type"
          required
          value={type}
          onChange={(e) => setType(e.target.value as CouponType)}
          className="input"
        >
          <option value="PERCENT">Percent off</option>
          <option value="FIXED">Fixed amount off (PKR)</option>
        </select>
      </Field>

      <Field label={type === "PERCENT" ? "Discount % *" : "Discount (PKR) *"}>
        <input
          name="value"
          type="number"
          min={1}
          max={type === "PERCENT" ? 100 : 1000000}
          required
          defaultValue={initial?.value ?? ""}
          className="input tabular-nums"
        />
      </Field>

      <Field label="Min order (PKR)" hint="Subtotal threshold to use this code.">
        <input
          name="minOrder"
          type="number"
          min={0}
          defaultValue={initial?.minOrder ?? 0}
          className="input tabular-nums"
        />
      </Field>

      {type === "PERCENT" && (
        <Field label="Max discount cap (PKR)" hint="Optional. Caps the percent discount.">
          <input
            name="maxDiscount"
            type="number"
            min={0}
            defaultValue={initial?.maxDiscount ?? ""}
            className="input tabular-nums"
          />
        </Field>
      )}

      <Field label="Usage limit" hint="Total redemptions allowed. Empty = unlimited.">
        <input
          name="usageLimit"
          type="number"
          min={0}
          defaultValue={initial?.usageLimit ?? ""}
          className="input tabular-nums"
        />
      </Field>

      <Field label="Valid from">
        <input
          name="validFrom"
          type="date"
          defaultValue={dateForInput(initial?.validFrom ?? null)}
          className="input"
        />
      </Field>

      <Field label="Valid until">
        <input
          name="validUntil"
          type="date"
          defaultValue={dateForInput(initial?.validUntil ?? null)}
          className="input"
        />
      </Field>

      <Field label="Description (internal)" className="sm:col-span-2">
        <input
          name="description"
          maxLength={300}
          defaultValue={initial?.description ?? ""}
          placeholder="Eid promo · Tajpura launch · 14 Aug"
          className="input"
        />
      </Field>

      <label className="flex items-center gap-3 cursor-pointer sm:col-span-2 text-sm">
        <input
          type="checkbox"
          name="active"
          defaultChecked={initial?.active ?? true}
          className="w-5 h-5 accent-brand-600"
        />
        <span className="text-white font-semibold">Active</span>
      </label>

      <div className="sm:col-span-2 flex justify-end gap-2 pt-2 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-muted hover:text-brand-500 px-3"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="btn-primary text-sm disabled:opacity-50"
        >
          {pending ? "Saving..." : initial ? "Save" : "Create"}
        </button>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.625rem;
          background: var(--background);
          border: 1px solid var(--border);
          color: var(--foreground);
          font-size: 0.875rem;
        }
        :global(.input:focus) {
          outline: none;
          border-color: var(--brand-600);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  hint,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs uppercase tracking-wider text-muted font-bold block mb-1.5">
        {label}
      </span>
      {children}
      {hint && <span className="text-[11px] text-muted-2 mt-1 block">{hint}</span>}
    </label>
  );
}
