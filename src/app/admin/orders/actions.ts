"use server";

import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/lib/admin-orders";

const VALID_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "ON_THE_WAY",
  "DELIVERED",
  "CANCELLED",
];

export async function updateStatusAction(orderNumber: string, status: string) {
  if (!VALID_STATUSES.includes(status as OrderStatus)) {
    return { ok: false, error: "Invalid status" } as const;
  }
  try {
    await updateOrderStatus(orderNumber, status as OrderStatus);
    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderNumber}`);
    return { ok: true } as const;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg } as const;
  }
}
