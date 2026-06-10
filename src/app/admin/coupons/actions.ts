"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { validateCoupon } from "@/lib/coupons";
import type { CouponType } from "@prisma/client";

function asStr(v: FormDataEntryValue | null, max = 1000): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

function asInt(v: FormDataEntryValue | null, fallback = 0): number {
  if (typeof v !== "string") return fallback;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

function asOptInt(v: FormDataEntryValue | null): number | null {
  if (typeof v !== "string" || v === "") return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

function asOptDate(v: FormDataEntryValue | null): Date | null {
  if (typeof v !== "string" || v === "") return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function asCouponType(v: FormDataEntryValue | null): CouponType {
  return v === "PERCENT" ? "PERCENT" : "FIXED";
}

function rv() {
  revalidatePath("/admin/coupons");
}

export type CouponResult = { ok: true; id: string } | { ok: false; error: string };

export async function upsertCouponAction(formData: FormData): Promise<CouponResult> {
  const id = asStr(formData.get("id"), 50) || null;
  const code = asStr(formData.get("code"), 40).toUpperCase();
  const type = asCouponType(formData.get("type"));
  const value = asInt(formData.get("value"));
  const minOrder = asInt(formData.get("minOrder"));
  const maxDiscount = asOptInt(formData.get("maxDiscount"));
  const validFrom = asOptDate(formData.get("validFrom"));
  const validUntil = asOptDate(formData.get("validUntil"));
  const usageLimit = asOptInt(formData.get("usageLimit"));
  const active = formData.get("active") === "on";
  const description = asStr(formData.get("description"), 300) || null;

  if (!code) return { ok: false, error: "Code is required" };
  if (!/^[A-Z0-9_-]{3,40}$/.test(code)) {
    return { ok: false, error: "Code must be 3-40 chars, A-Z 0-9 _ -" };
  }
  if (value <= 0) return { ok: false, error: "Value must be greater than 0" };
  if (type === "PERCENT" && value > 100) {
    return { ok: false, error: "Percent value cannot exceed 100" };
  }

  try {
    if (id) {
      const updated = await db.coupon.update({
        where: { id },
        data: {
          code,
          type,
          value,
          minOrder,
          maxDiscount,
          validFrom,
          validUntil,
          usageLimit,
          active,
          description,
        },
      });
      rv();
      return { ok: true, id: updated.id };
    }
    const created = await db.coupon.create({
      data: {
        code,
        type,
        value,
        minOrder,
        maxDiscount,
        validFrom,
        validUntil,
        usageLimit,
        active,
        description,
      },
    });
    rv();
    return { ok: true, id: created.id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to save";
    if (msg.includes("Unique constraint") || msg.includes("P2002")) {
      return { ok: false, error: "Code already exists" };
    }
    return { ok: false, error: msg };
  }
}

export async function deleteCouponAction(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await db.coupon.delete({ where: { id } });
    rv();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to delete" };
  }
}

export async function toggleCouponAction(id: string): Promise<{ ok: true; active: boolean } | { ok: false; error: string }> {
  try {
    const existing = await db.coupon.findUnique({ where: { id } });
    if (!existing) return { ok: false, error: "Not found" };
    const updated = await db.coupon.update({
      where: { id },
      data: { active: !existing.active },
    });
    rv();
    return { ok: true, active: updated.active };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

// Called from the checkout client to preview the discount before submit.
export async function previewCouponAction(
  code: string,
  subtotal: number
): Promise<
  | { ok: true; code: string; discount: number; message: string }
  | { ok: false; error: string }
> {
  const result = await validateCoupon(code, subtotal);
  if (!result.ok) return { ok: false, error: result.error };
  return {
    ok: true,
    code: result.code,
    discount: result.discount,
    message: result.message,
  };
}
