import { db } from "@/lib/db";
import { hasDb } from "@/lib/admin-orders";
import { formatPKR } from "@/data/menu-static";
import CouponsEditor from "@/components/admin/CouponsEditor";

export const dynamic = "force-dynamic";

export default async function CouponsPage() {
  const coupons = hasDb()
    ? await db.coupon.findMany({ orderBy: { createdAt: "desc" } })
    : [];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-display text-3xl font-extrabold uppercase">
          Coupons
        </h1>
        <p className="text-sm text-muted mt-1">
          {coupons.length} {coupons.length === 1 ? "code" : "codes"} ·{" "}
          Customers enter these at checkout.
        </p>
      </div>

      {!hasDb() && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-sm">
          Database not connected. Connect to manage coupons.
        </div>
      )}

      <CouponsEditor
        initial={coupons.map((c) => ({
          id: c.id,
          code: c.code,
          type: c.type,
          value: c.value,
          minOrder: c.minOrder,
          maxDiscount: c.maxDiscount,
          validFrom: c.validFrom?.toISOString() ?? null,
          validUntil: c.validUntil?.toISOString() ?? null,
          usageLimit: c.usageLimit,
          usedCount: c.usedCount,
          active: c.active,
          description: c.description,
          summary:
            c.type === "FIXED"
              ? `${formatPKR(c.value)} off`
              : `${c.value}% off${
                  c.maxDiscount ? ` (max ${formatPKR(c.maxDiscount)})` : ""
                }`,
        }))}
      />
    </div>
  );
}
