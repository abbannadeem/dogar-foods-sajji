import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getProductBySlug } from "@/lib/menu-db";
import { buildOrderWhatsAppUrl, generateOrderNumber } from "@/lib/whatsapp";
import { validateCoupon, incrementCouponUsage } from "@/lib/coupons";
import type { CreateOrderPayload, CreateOrderResponse } from "@/types/cart";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_DB_RETRIES = 3;

export async function POST(req: Request): Promise<NextResponse<CreateOrderResponse>> {
  let payload: CreateOrderPayload;
  try {
    payload = (await req.json()) as CreateOrderPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  // ----- Basic shape validation -----
  if (!payload?.customer || !Array.isArray(payload.items) || payload.items.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Cart is empty or missing customer info" },
      { status: 400 }
    );
  }

  const c = payload.customer;
  if (
    !c.customerName?.trim() ||
    !c.customerPhone?.trim() ||
    !c.address?.trim() ||
    !c.area?.trim() ||
    !c.branchId
  ) {
    return NextResponse.json(
      { ok: false, error: "Required customer fields missing" },
      { status: 400 }
    );
  }

  // ----- Server-side price verification (anti-tampering) -----
  let verifiedSubtotal = 0;
  const verifiedItems: typeof payload.items = [];

  for (const it of payload.items) {
    const product = await getProductBySlug(it.slug);
    if (!product) {
      return NextResponse.json(
        { ok: false, error: `Item no longer available: ${it.name}` },
        { status: 400 }
      );
    }
    const qty = Math.max(1, Math.floor(it.quantity));
    verifiedSubtotal += product.price * qty;
    verifiedItems.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: it.image,
      quantity: qty,
    });
  }

  const deliveryFee = Math.max(0, Math.floor(payload.deliveryFee ?? 0));

  // ----- Re-validate coupon server-side (anti-tampering) -----
  let discount = 0;
  let appliedCoupon: string | null = null;
  if (payload.couponCode && payload.couponCode.trim()) {
    const v = await validateCoupon(payload.couponCode, verifiedSubtotal);
    if (v.ok) {
      discount = v.discount;
      appliedCoupon = v.code;
    }
    // Silent fallthrough: if coupon now invalid, order goes through at full price.
  }

  const verifiedTotal = Math.max(0, verifiedSubtotal - discount) + deliveryFee;

  // ----- Try to persist to DB. If DATABASE_URL not set or fails, still return WA url. -----
  let orderNumber = generateOrderNumber();
  let savedToDb = false;

  if (process.env.DATABASE_URL) {
    for (let attempt = 0; attempt < MAX_DB_RETRIES; attempt++) {
      try {
        await db.order.create({
          data: {
            orderNumber,
            customerName: c.customerName.trim(),
            customerPhone: c.customerPhone.trim(),
            customerEmail: c.customerEmail?.trim() || null,
            address: c.address.trim(),
            area: c.area.trim(),
            city: c.city || "Lahore",
            branchId: c.branchId,
            paymentMethod: c.paymentMethod,
            notes: c.notes?.trim() || null,
            subtotal: verifiedSubtotal,
            deliveryFee,
            discount,
            couponCode: appliedCoupon,
            total: verifiedTotal,
            items: {
              create: verifiedItems.map((i) => ({
                productId: i.productId,
                productSlug: i.slug,
                productName: i.name,
                unitPrice: i.price,
                quantity: i.quantity,
                lineTotal: i.price * i.quantity,
              })),
            },
          },
        });
        savedToDb = true;
        break;
      } catch (err: unknown) {
        // P2002 = unique constraint violation; regenerate orderNumber and retry
        const message = err instanceof Error ? err.message : String(err);
        if (message.includes("Unique constraint") || message.includes("P2002")) {
          orderNumber = generateOrderNumber();
          continue;
        }
        // Anything else: log + fall through (WhatsApp still works)
        console.error("[orders] DB save failed:", message);
        break;
      }
    }
  }

  // Bump coupon usage on success (best-effort).
  if (savedToDb && appliedCoupon) {
    await incrementCouponUsage(appliedCoupon);
  }

  // ----- Build the WhatsApp URL with the prefilled order -----
  const whatsappUrl = buildOrderWhatsAppUrl({
    orderNumber,
    customer: c,
    items: verifiedItems,
    subtotal: verifiedSubtotal,
    deliveryFee,
    discount,
    couponCode: appliedCoupon ?? undefined,
    total: verifiedTotal,
  });

  return NextResponse.json(
    { ok: true, orderNumber, whatsappUrl },
    {
      status: 200,
      headers: { "X-DB-Saved": savedToDb ? "1" : "0" },
    }
  );
}
