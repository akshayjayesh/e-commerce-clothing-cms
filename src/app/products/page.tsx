"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/lib/hooks/ProductsContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProductsPage() {
  const { products } = useProducts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState("sort-featured");

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category)));
  }, [products]);

  const filtered = useMemo(() => {
    let list = products.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    if (category) list = list.filter((p) => p.category === category);
    if (sort === "sort-price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "sort-price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "sort-name-asc") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, query, category, sort]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Select onValueChange={(v) => setCategory(v === "all" ? undefined : v)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger>
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sort-featured">Featured</SelectItem>
            <SelectItem value="sort-price-asc">Price: Low to High</SelectItem>
            <SelectItem value="sort-price-desc">Price: High to Low</SelectItem>
            <SelectItem value="sort-name-asc">Name: A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.id} id={p.id} />
        ))}
      </div>
    </div>
  );
}