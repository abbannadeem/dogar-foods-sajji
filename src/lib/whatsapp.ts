import type { CartItem, CheckoutForm } from "@/types/cart";
import { BRANCHES, PRIMARY_WHATSAPP } from "@/lib/constants";
import { formatPKR } from "@/data/menu";

const PAYMENT_LABELS: Record<CheckoutForm["paymentMethod"], string> = {
  COD: "Cash on Delivery",
  JAZZCASH: "JazzCash",
  EASYPAISA: "EasyPaisa",
  BANK_TRANSFER: "Bank Transfer",
  SAFEPAY: "Card via SafePay",
};

export function buildOrderWhatsAppUrl(opts: {
  orderNumber: string;
  customer: CheckoutForm;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}): string {
  const { orderNumber, customer, items, subtotal, deliveryFee, total } = opts;
  const branch = BRANCHES.find((b) => b.id === customer.branchId) ?? BRANCHES[0];

  const itemsBlock = items
    .map(
      (i, idx) =>
        `${idx + 1}. ${i.name} × ${i.quantity} = ${formatPKR(
          i.price * i.quantity
        )}`
    )
    .join("\n");

  const lines = [
    `🍴 *NEW ORDER — Dogar Foods & Sajji*`,
    `Order #: *${orderNumber}*`,
    ``,
    `👤 *Customer*`,
    `Name: ${customer.customerName}`,
    `Phone: ${customer.customerPhone}`,
    customer.customerEmail ? `Email: ${customer.customerEmail}` : null,
    ``,
    `📍 *Delivery*`,
    `Address: ${customer.address}`,
    `Area: ${customer.area}, ${customer.city}`,
    `Branch: ${branch.name}`,
    ``,
    `🛒 *Items*`,
    itemsBlock,
    ``,
    `💰 *Summary*`,
    `Subtotal: ${formatPKR(subtotal)}`,
    `Delivery: ${deliveryFee === 0 ? "Free" : formatPKR(deliveryFee)}`,
    `*Total: ${formatPKR(total)}*`,
    ``,
    `💳 Payment: ${PAYMENT_LABELS[customer.paymentMethod]}`,
    customer.notes ? `📝 Notes: ${customer.notes}` : null,
    ``,
    `Please confirm this order. Shukriya!`,
  ]
    .filter(Boolean)
    .join("\n");

  const text = encodeURIComponent(lines);
  // route to the chosen branch's WhatsApp
  const wa = branch.whatsapp || PRIMARY_WHATSAPP;
  return `https://wa.me/${wa}?text=${text}`;
}

export function generateOrderNumber(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  // 4-digit random suffix (will be uniqued at DB level via unique constraint + retry)
  const suffix = String(Math.floor(1000 + Math.random() * 9000));
  return `DF${yy}${mm}${dd}-${suffix}`;
}
