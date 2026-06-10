export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
};

export type CartAction =
  | { type: "ADD"; payload: Omit<CartItem, "quantity"> & { quantity?: number } }
  | { type: "REMOVE"; payload: { productId: string } }
  | { type: "INCREMENT"; payload: { productId: string } }
  | { type: "DECREMENT"; payload: { productId: string } }
  | { type: "SET_QTY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; payload: CartState };

export type CheckoutForm = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  area: string;
  city: string;
  branchId: string;
  paymentMethod: "COD" | "JAZZCASH" | "EASYPAISA" | "BANK_TRANSFER" | "SAFEPAY";
  notes?: string;
};

export type CreateOrderPayload = {
  customer: CheckoutForm;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
};

export type CreateOrderResponse = {
  ok: true;
  orderNumber: string;
  whatsappUrl: string;
} | {
  ok: false;
  error: string;
};
