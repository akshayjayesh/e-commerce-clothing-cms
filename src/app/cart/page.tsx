"use client";

import Link from "next/link";
import { useCart } from "@/lib/hooks/CartContext";
import { useProducts } from "@/lib/hooks/ProductsContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/products";

export default function CartPage() {
  const { items, removeItem } = useCart();
  const { products } = useProducts();

  const enriched = items
    .map((i) => ({
      ...i,
      product: products.find((p) => p.id === i.productId),
    }))
    .filter((x) => x.product);

  const total = enriched.reduce((sum, i) => sum + (i.product!.price * i.quantity), 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Your Cart</h1>

      {enriched.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="mb-4 text-muted-foreground">Your cart is empty.</p>
          <Button asChild>
            <Link href="/products">Browse products</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {enriched.map((i) => (
              <Card key={`${i.productId}-${i.size ?? ""}-${i.color ?? ""}`} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{i.product!.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {i.quantity} × {formatPrice(i.product!.price)}
                    {i.size ? ` • Size ${i.size}` : ""}
                    {i.color ? ` • ${i.color}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium">{formatPrice(i.product!.price * i.quantity)}</div>
                  <Button
                    variant="secondary"
                    onClick={() => removeItem(i.productId, { size: i.size, color: i.color })}
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="text-muted-foreground">Total</div>
            <div className="text-lg font-semibold">{formatPrice(total)}</div>
          </div>

          <div className="flex justify-end">
            <Button asChild>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}