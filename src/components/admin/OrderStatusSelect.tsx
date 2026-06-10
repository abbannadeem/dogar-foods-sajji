"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { OrderStatus } from "@prisma/client";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "./OrderStatusBadge";
import { updateStatusAction } from "@/app/admin/orders/actions";

export default function OrderStatusSelect({
  orderNumber,
  current,
  compact = false,
}: {
  orderNumber: string;
  current: OrderStatus;
  compact?: boolean;
}) {
  const [value, setValue] = useState<OrderStatus>(current);
  const [pending, startTransition] = useTransition();

  function onChange(next: OrderStatus) {
    if (next === value || pending) return;
    const prev = value;
    setValue(next);
    startTransition(async () => {
      const res = await updateStatusAction(orderNumber, next);
      if (!res.ok) {
        setValue(prev);
        toast.error("Could not update: " + ("error" in res ? res.error : ""));
        return;
      }
      toast.success(`Status → ${ORDER_STATUS_LABELS[next]}`);
    });
  }

  return (
    <label className="inline-block">
      <span className="sr-only">Order status</span>
      <select
        value={value}
        disabled={pending}
        onChange={(e) => onChange(e.target.value as OrderStatus)}
        className={`bg-surface border border-border rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-brand-600 disabled:opacity-50 ${
          compact ? "" : "min-w-[160px]"
        }`}
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {ORDER_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
    </label>
  );
}
