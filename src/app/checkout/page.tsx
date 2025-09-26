"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/lib/hooks/CartContext";
import { useProducts } from "@/lib/hooks/ProductsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/products";

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const { products } = useProducts();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    country: "",
    zip: "",
  });

  const enriched = useMemo(() => items.map((i) => ({ ...i, product: products.find((p) => p.id === i.productId) })).filter((x) => x.product), [items, products]);
  const total = useMemo(() => enriched.reduce((sum, i) => sum + (i.product!.price * i.quantity), 0), [enriched]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.address || !form.city || !form.country || !form.zip) {
      alert("Please complete all fields");
      return;
    }
    clear();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Thank you for your order!</h1>
        <p className="text-muted-foreground">A confirmation has been sent to your email.</p>
        <div className="flex gap-3 justify-center">
          <Button asChild>
            <Link href="/products">Continue shopping</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 grid gap-8 md:grid-cols-2">
      <form onSubmit={onSubmit} className="space-y-4">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="zip">ZIP</Label>
            <Input id="zip" value={form.zip} onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))} />
          </div>
        </div>
        <Button type="submit">Place order</Button>
      </form>

      <div className="space-y-4">
        <Card className="p-4">
          <div className="font-medium mb-3">Order Summary</div>
          <div className="space-y-2">
            {enriched.length === 0 ? (
              <div className="text-muted-foreground">Your cart is empty.</div>
            ) : (
              enriched.map((i) => (
                <div key={`${i.productId}-${i.size ?? ""}-${i.color ?? ""}`} className="flex items-center justify-between text-sm">
                  <div>
                    {i.product!.name} × {i.quantity}
                    {i.size ? ` • ${i.size}` : ""}
                    {i.color ? ` • ${i.color}` : ""}
                  </div>
                  <div className="font-medium">{formatPrice(i.product!.price * i.quantity)}</div>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 flex items-center justify-between border-t pt-3">
            <div className="text-muted-foreground">Total</div>
            <div className="font-semibold">{formatPrice(total)}</div>
          </div>
        </Card>
      </div>
    </div>
  );
}