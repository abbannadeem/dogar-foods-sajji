import type { OrderStatus } from "@prisma/client";

const STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  CONFIRMED: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  PREPARING: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  ON_THE_WAY: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  DELIVERED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  CANCELLED: "bg-red-500/15 text-red-400 border-red-500/30",
};

const LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  ON_THE_WAY: "On the way",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export default function OrderStatusBadge({
  status,
  className = "",
}: {
  status: OrderStatus;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${STYLES[status]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {LABELS[status]}
    </span>
  );
}

export const ORDER_STATUS_LABELS = LABELS;
export const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "ON_THE_WAY",
  "DELIVERED",
  "CANCELLED",
];
