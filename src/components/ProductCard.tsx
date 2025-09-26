"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/lib/hooks/ProductsContext";
import { useCart } from "@/lib/hooks/CartContext";
import { formatPrice } from "@/lib/products";

export default function ProductCard({ id }: { id: number }) {
  const { products } = useProducts();
  const { addItem } = useCart();
  const product = products.find((p) => p.id === id);
  if (!product) return null;
  return (
    <Card className="overflow-hidden">
      <Link href={`/products/${product.slug}`}>
        <CardHeader className="p-0">
          <div className="relative aspect-[4/5] w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="font-medium">{product.name}</div>
          <div className="text-sm text-muted-foreground">{formatPrice(product.price)}</div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full gap-2">
          <Button asChild variant="secondary" className="w-full">
            <Link href={`/products/${product.slug}`}>View</Link>
          </Button>
          <Button
            className="w-full"
            onClick={() => addItem({ productId: product.id, quantity: 1 })}
          >
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}