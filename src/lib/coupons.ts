/**
 * Coupon validation + discount calculation. Server-side only.
 * Frontend may call validateCouponAction (in actions) to preview the discount
 * before checkout; api/orders re-validates at submit time to prevent tampering.
 */
import { db } from "@/lib/db";
import { hasDb } from "@/lib/admin-orders";
import type { CouponType } from "@prisma/client";

export type CouponValidation =
  | {
      ok: true;
      code: string;
      type: CouponType;
      discount: number;
      message: string;
    }
  | {
      ok: false;
      error: string;
    };

export async function validateCoupon(
  rawCode: string,
  subtotal: number
): Promise<CouponValidation> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, error: "Enter a code" };
  if (!hasDb()) {
    return { ok: false, error: "Coupons require a database connection" };
  }

  const coupon = await db.coupon.findUnique({ where: { code } });
  if (!coupon) return { ok: false, error: "Code not found" };
  if (!coupon.active) return { ok: false, error: "Code is inactive" };

  const now = new Date();
  if (coupon.validFrom && coupon.validFrom > now) {
    return { ok: false, error: "Code not yet active" };
  }
  if (coupon.validUntil && coupon.validUntil < now) {
    return { ok: false, error: "Code expired" };
  }
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    return { ok: false, error: "Code fully redeemed" };
  }
  if (subtotal < coupon.minOrder) {
    return {
      ok: false,
      error: `Min order $${(coupon.minOrder / 100).toFixed(2)} required`,
    };
  }

  let discount = 0;
  if (coupon.type === "FIXED") {
    discount = Math.min(coupon.value, subtotal);
  } else {
    discount = Math.floor((subtotal * coupon.value) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  }
  discount = Math.max(0, discount);

  const message =
    coupon.type === "FIXED"
      ? `$${(coupon.value / 100).toFixed(2)} off`
      : `${coupon.value}% off`;

  return { ok: true, code, type: coupon.type, discount, message };
}

export async function incrementCouponUsage(code: string): Promise<void> {
  if (!hasDb()) return;
  try {
    await db.coupon.update({
      where: { code: code.toUpperCase() },
      data: { usedCount: { increment: 1 } },
    });
  } catch {
    /* swallow — order already saved */
  }
}
