"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "../types";
import { formatPrice } from "../products";

const STORAGE_KEY = "orchids_cart_v1";

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number, variant?: { size?: string; color?: string }) => void;
  clear: () => void;
  totalCents: number;
  formattedTotal: string;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) setItems(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem: CartContextValue["addItem"] = (item) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) =>
          i.productId === item.productId && i.size === item.size && i.color === item.color
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + item.quantity };
        return copy;
      }
      return [...prev, item];
    });
  };

  const removeItem: CartContextValue["removeItem"] = (productId, variant) => {
    setItems((prev) =>
      prev.filter(
        (i) =>
          !(i.productId === productId && (!variant || (i.size === variant.size && i.color === variant.color)))
      )
    );
  };

  const clear = () => setItems([]);

  const totalCents = useMemo(() => {
    // total computed by consumers with product prices; here we keep zero, they can pass price
    return 0;
  }, [items]);

  const formattedTotal = formatPrice(totalCents);

  const value = useMemo(
    () => ({ items, addItem, removeItem, clear, totalCents, formattedTotal }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}