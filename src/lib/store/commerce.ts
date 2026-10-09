"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { BillingCycle, PlanId } from "@/lib/types";
import { uid } from "@/lib/uid";

export type OrderItem =
  | { kind: "course"; slug: string; price: number }
  | { kind: "plan"; plan: PlanId; cycle: BillingCycle; price: number };

export type Order = {
  id: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  cardLast4: string;
  status: "paid" | "refunded";
};

type CommerceState = {
  seeded: boolean;
  cart: string[];
  wishlist: string[];
  orders: Order[];
  coupon: string | null;
  addToCart: (slug: string) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => boolean;
  removeFromWishlist: (slug: string) => void;
  applyCoupon: (code: string | null) => void;
  placeOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => Order;
  seedDemo: () => void;
  reset: () => void;
};

export const COUPONS: Record<string, number> = { LEARN20: 0.2, NYC10: 0.1 };
export const TAX_RATE = 0.08875;

function daysAgo(days: number) {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

export function orderTotals(subtotal: number, coupon: string | null) {
  const rate = coupon ? (COUPONS[coupon] ?? 0) : 0;
  const discount = Math.round(subtotal * rate * 100) / 100;
  const taxable = subtotal - discount;
  const tax = Math.round(taxable * TAX_RATE * 100) / 100;
  return { subtotal, discount, tax, total: Math.round((taxable + tax) * 100) / 100 };
}

export const useCommerce = create<CommerceState>()(
  persist(
    (set, get) => ({
      seeded: false,
      cart: [],
      wishlist: [],
      orders: [],
      coupon: null,
      addToCart: (slug) => set((s) => (s.cart.includes(slug) ? s : { cart: [...s.cart, slug] })),
      removeFromCart: (slug) => set((s) => ({ cart: s.cart.filter((c) => c !== slug) })),
      clearCart: () => set({ cart: [], coupon: null }),
      toggleWishlist: (slug) => {
        const has = get().wishlist.includes(slug);
        set((s) => ({ wishlist: has ? s.wishlist.filter((w) => w !== slug) : [...s.wishlist, slug] }));
        return !has;
      },
      removeFromWishlist: (slug) => set((s) => ({ wishlist: s.wishlist.filter((w) => w !== slug) })),
      applyCoupon: (coupon) => set({ coupon }),
      placeOrder: (input) => {
        const order: Order = {
          ...input,
          id: `ORD-${uid().toUpperCase().slice(0, 8)}`,
          createdAt: new Date().toISOString(),
          status: "paid",
        };
        set((s) => ({ orders: [order, ...s.orders] }));
        return order;
      },
      seedDemo: () => {
        if (get().seeded) return;
        set((s) => ({
          seeded: true,
          wishlist: Array.from(
            new Set([...s.wishlist, "figma-design-systems", "startup-finance-and-fundraising"]),
          ),
          cart: Array.from(new Set([...s.cart, "data-analysis-with-sql"])),
          orders: [
            {
              id: "ORD-8F3K2M1A",
              createdAt: daysAgo(48),
              items: [{ kind: "course", slug: "ui-design-foundations", price: 79 }],
              ...orderTotals(79, null),
              cardLast4: "4242",
              status: "paid",
            },
            {
              id: "ORD-2B7N5Q9C",
              createdAt: daysAgo(30),
              items: [
                { kind: "course", slug: "photography-fundamentals", price: 69 },
                { kind: "course", slug: "modern-react-nextjs", price: 129 },
              ],
              ...orderTotals(198, "LEARN20"),
              cardLast4: "4242",
              status: "paid",
            },
          ],
        }));
      },
      reset: () => set({ seeded: false, cart: [], wishlist: [], orders: [], coupon: null }),
    }),
    { name: "learnora-commerce", version: 1, storage: createJSONStorage(() => localStorage) },
  ),
);
