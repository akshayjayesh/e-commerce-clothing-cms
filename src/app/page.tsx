"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/lib/hooks/ProductsContext";

export default function HomePage() {
  const { products } = useProducts();
  const featured = products.filter((p) => p.featured);

  return (
    <div className="min-h-screen">
      <section className="relative">
        <div
          className="absolute inset-0 -z-10 bg-center bg-cover"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop)",
          }}
        />
        <div className="mx-auto max-w-6xl px-4 py-24 md:py-36">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
              Minimal staples for everyday wear
            </h1>
            <p className="text-muted-foreground md:text-lg">
              Explore thoughtfully designed essentials engineered for comfort and versatility.
            </p>
            <div className="flex gap-3">
              <Button asChild size="lg">
                <Link href="/products">Shop collection</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="#featured">View featured</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Featured</h2>
          <Button asChild variant="link" className="px-0"> 
            <Link href="/products">View all</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} id={p.id} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border p-6">
            <h3 className="font-medium mb-2">Tops</h3>
            <p className="text-sm text-muted-foreground mb-4">Tees and layers built to last.</p>
            <Button asChild variant="ghost" className="px-0"> 
              <Link href="/products">Shop tops</Link>
            </Button>
          </div>
          <div className="rounded-lg border p-6">
            <h3 className="font-medium mb-2">Bottoms</h3>
            <p className="text-sm text-muted-foreground mb-4">Utility cargos and relaxed trousers.</p>
            <Button asChild variant="ghost" className="px-0"> 
              <Link href="/products">Shop bottoms</Link>
            </Button>
          </div>
          <div className="rounded-lg border p-6">
            <h3 className="font-medium mb-2">Outerwear</h3>
            <p className="text-sm text-muted-foreground mb-4">Weather-ready jackets for all seasons.</p>
            <Button asChild variant="ghost" className="px-0"> 
              <Link href="/products">Shop outerwear</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}