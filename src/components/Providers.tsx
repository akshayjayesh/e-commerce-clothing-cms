"use client";

import { CartProvider } from "@/lib/hooks/CartContext";
import { ProductsProvider } from "@/lib/hooks/ProductsContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProductsProvider>
      <CartProvider>{children}</CartProvider>
    </ProductsProvider>
  );
}