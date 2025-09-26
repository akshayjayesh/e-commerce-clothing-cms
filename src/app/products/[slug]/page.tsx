"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useProducts } from "@/lib/hooks/ProductsContext";
import { useCart } from "@/lib/hooks/CartContext";
import { formatPrice } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { getBySlug } = useProducts();
  const { addItem } = useCart();
  const product = getBySlug(slug);

  const [size, setSize] = useState<string | undefined>(undefined);
  const [color, setColor] = useState<string | undefined>(undefined);

  const canAdd = useMemo(() => {
    const sizeOk = product?.sizes ? Boolean(size) : true;
    const colorOk = product?.colors ? Boolean(color) : true;
    return Boolean(product) && sizeOk && colorOk;
  }, [product, size, color]);

  if (!product) return <div className="mx-auto max-w-5xl p-6">Product not found.</div>;

  return (
    <div className="mx-auto max-w-5xl p-6 grid gap-8 md:grid-cols-2">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md">
        <Image src={product.image} alt={product.name} fill className="object-cover" />
      </div>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <div className="text-lg">{formatPrice(product.price)}</div>
        <p className="text-muted-foreground">{product.description}</p>

        {product.sizes && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Size</div>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {product.sizes.map((s) => (
                  <SelectItem key={s} value={`size-${s}`}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {product.colors && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Color</div>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger>
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                {product.colors.map((c) => (
                  <SelectItem key={c} value={`color-${c}`}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            disabled={!canAdd}
            onClick={() => {
              addItem({
                productId: product.id,
                quantity: 1,
                size: size?.replace(/^size-/, ""),
                color: color?.replace(/^color-/, ""),
              });
              router.push("/cart");
            }}
          >
            Add to cart
          </Button>
          <Button variant="secondary" onClick={() => history.back()}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}