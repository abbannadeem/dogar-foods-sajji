"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartAction, CartItem, CartState } from "@/types/cart";

const STORAGE_KEY = "dogar.cart.v1";

const initialState: CartState = { items: [] };

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "ADD": {
      const existing = state.items.find((i) => i.productId === action.payload.productId);
      const qty = action.payload.quantity ?? 1;
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === action.payload.productId
              ? { ...i, quantity: i.quantity + qty }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            productId: action.payload.productId,
            slug: action.payload.slug,
            name: action.payload.name,
            price: action.payload.price,
            image: action.payload.image,
            quantity: qty,
          },
        ],
      };
    }
    case "REMOVE":
      return {
        items: state.items.filter((i) => i.productId !== action.payload.productId),
      };
    case "INCREMENT":
      return {
        items: state.items.map((i) =>
          i.productId === action.payload.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      };
    case "DECREMENT":
      return {
        items: state.items
          .map((i) =>
            i.productId === action.payload.productId
              ? { ...i, quantity: i.quantity - 1 }
              : i
          )
          .filter((i) => i.quantity > 0),
      };
    case "SET_QTY":
      return {
        items: state.items
          .map((i) =>
            i.productId === action.payload.productId
              ? { ...i, quantity: Math.max(0, action.payload.quantity) }
              : i
          )
          .filter((i) => i.quantity > 0),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (productId: string) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  isHydrated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isHydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartState;
        if (parsed && Array.isArray(parsed.items)) {
          dispatch({ type: "HYDRATE", payload: parsed });
        }
      }
    } catch {}
    setHydrated(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, isHydrated]);

  const count = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  );
  const subtotal = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [state.items]
  );

  const add = useCallback<CartContextValue["add"]>(
    (item, qty) => dispatch({ type: "ADD", payload: { ...item, quantity: qty } }),
    []
  );
  const remove = useCallback((productId: string) => {
    dispatch({ type: "REMOVE", payload: { productId } });
  }, []);
  const increment = useCallback((productId: string) => {
    dispatch({ type: "INCREMENT", payload: { productId } });
  }, []);
  const decrement = useCallback((productId: string) => {
    dispatch({ type: "DECREMENT", payload: { productId } });
  }, []);
  const setQty = useCallback((productId: string, qty: number) => {
    dispatch({ type: "SET_QTY", payload: { productId, quantity: qty } });
  }, []);
  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const value: CartContextValue = {
    items: state.items,
    count,
    subtotal,
    add,
    remove,
    increment,
    decrement,
    setQty,
    clear,
    isHydrated,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}

