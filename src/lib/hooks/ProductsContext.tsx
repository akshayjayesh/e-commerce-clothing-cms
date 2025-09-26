"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "../types";
import { slugify } from "../products";

const STORAGE_KEY = "orchids_products_v1";

type ProductsContextValue = {
  products: Product[];
  getBySlug: (slug: string) => Product | undefined;
  add: (p: Omit<Product, "id" | "slug"> & { slug?: string }) => Promise<Product | null>;
  update: (
    id: number,
    patch: Partial<Omit<Product, "id" | "slug">> & { slug?: string }
  ) => Promise<boolean>;
  remove: (id: number) => Promise<boolean>;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products from API on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const mapped: Product[] = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          price: p.priceCents,
          image: p.image,
          category: p.category,
          colors: p.colors ? (JSON.parse(p.colors) as string[]) : undefined,
          sizes: p.sizes ? (JSON.parse(p.sizes) as string[]) : undefined,
          featured: !!p.featured,
        }));
        setProducts(mapped);
      } catch (e) {
        console.error("Failed to load products", e);
      }
    };
    load();
  }, []);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("bearer_token");
  };

  const getBySlug = (slug: string) => products.find((p) => p.slug === slug);

  const add: ProductsContextValue["add"] = async (p) => {
    try {
      const token = getToken();
      const computedSlug = p.slug ? slugify(p.slug) : slugify(p.name);
      const body: any = {
        name: p.name,
        slug: computedSlug,
        description: p.description,
        price_cents: p.price,
        image: p.image,
        category: p.category,
        colors: p.colors ? JSON.stringify(p.colors) : undefined,
        sizes: p.sizes ? JSON.stringify(p.sizes) : undefined,
        featured: !!p.featured,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        console.error("Create product failed", await res.text());
        return null;
      }
      const created = await res.json();
      const mapped: Product = {
        id: created.id,
        name: created.name,
        slug: created.slug,
        description: created.description,
        price: created.priceCents,
        image: created.image,
        category: created.category,
        colors: created.colors ? JSON.parse(created.colors) : undefined,
        sizes: created.sizes ? JSON.parse(created.sizes) : undefined,
        featured: !!created.featured,
      };
      setProducts((prev) => [...prev, mapped]);
      return mapped;
    } catch (e) {
      console.error("Create product error", e);
      return null;
    }
  };

  const update: ProductsContextValue["update"] = async (id, patch) => {
    try {
      const token = getToken();
      const body: any = {
        ...(patch.name !== undefined ? { name: patch.name } : {}),
        ...(patch.slug !== undefined ? { slug: slugify(patch.slug) } : {}),
        ...(patch.description !== undefined ? { description: patch.description } : {}),
        ...(patch.price !== undefined ? { price_cents: patch.price } : {}),
        ...(patch.image !== undefined ? { image: patch.image } : {}),
        ...(patch.category !== undefined ? { category: patch.category } : {}),
        ...(patch.colors !== undefined ? { colors: JSON.stringify(patch.colors) } : {}),
        ...(patch.sizes !== undefined ? { sizes: JSON.stringify(patch.sizes) } : {}),
        ...(patch.featured !== undefined ? { featured: !!patch.featured } : {}),
      };

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        console.error("Update product failed", await res.text());
        return false;
      }
      const updated = await res.json();
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                id: updated.id,
                name: updated.name,
                slug: updated.slug,
                description: updated.description,
                price: updated.priceCents,
                image: updated.image,
                category: updated.category,
                colors: updated.colors ? JSON.parse(updated.colors) : undefined,
                sizes: updated.sizes ? JSON.parse(updated.sizes) : undefined,
                featured: !!updated.featured,
              }
            : p
        )
      );
      return true;
    } catch (e) {
      console.error("Update product error", e);
      return false;
    }
  };

  const remove: ProductsContextValue["remove"] = async (id) => {
    try {
      const token = getToken();
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        console.error("Delete product failed", await res.text());
        return false;
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (e) {
      console.error("Delete product error", e);
      return false;
    }
  };

  const value = useMemo(
    () => ({ products, getBySlug, add, update, remove }),
    [products]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}