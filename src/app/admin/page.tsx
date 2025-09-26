"use client";

import { useState, useEffect } from "react";
import { useProducts } from "@/lib/hooks/ProductsContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/products";

const categories = ["tops", "bottoms", "outerwear", "accessories", "footwear"] as const;

type FormState = {
  id?: number;
  name: string;
  description: string;
  price: string; // dollars input
  image: string;
  category: (typeof categories)[number] | "";
  colors: string;
  sizes: string;
};

const empty: FormState = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
  colors: "",
  sizes: "",
};

export default function AdminPage() {
  const { products, add, remove, update } = useProducts();
  const [form, setForm] = useState<FormState>(empty);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAuthed(Boolean(localStorage.getItem("bearer_token")));
    }
  }, []);

  const handleLogin = async () => {
    setLoginError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: p }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setLoginError(data?.error || "Invalid credentials");
        return;
      }
      const data = await res.json();
      localStorage.setItem("bearer_token", data.token);
      setAuthed(true);
    } catch (e) {
      setLoginError("Login failed. Please try again.");
    }
  };

  const onSubmit = async () => {
    setError(null);
    if (!form.name || !form.description || !form.price || !form.image || !form.category) {
      setError("Please fill all required fields.");
      return;
    }
    const priceCents = Math.round(parseFloat(form.price) * 100);
    if (Number.isNaN(priceCents) || priceCents < 0) {
      setError("Price must be a valid number.");
      return;
    }
    const payload = {
      name: form.name,
      description: form.description,
      price: priceCents,
      image: form.image,
      category: form.category as any,
      colors: form.colors ? form.colors.split(",").map((c) => c.trim()).filter(Boolean) : undefined,
      sizes: form.sizes ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
      featured: false,
    } as const;

    if (form.id) {
      const ok = await update(form.id, payload as any);
      if (!ok) {
        setError("Update failed. Please ensure you are logged in as admin.");
        return;
      }
    } else {
      const created = await add(payload as any);
      if (!created) {
        setError("Create failed. Please ensure you are logged in as admin and slug is unique.");
        return;
      }
    }
    setForm(empty);
  };

  const startEdit = (id: number) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    setForm({
      id: p.id,
      name: p.name,
      description: p.description,
      price: (p.price / 100).toString(),
      image: p.image,
      category: p.category,
      colors: (p.colors || []).join(", "),
      sizes: (p.sizes || []).join(", "),
    });
  };

  const cancelEdit = () => setForm(empty);

  if (!authed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <Card className="w-full max-w-sm p-6 space-y-4">
          <h1 className="text-xl font-semibold">Admin Login</h1>
          {loginError && <div className="text-sm text-destructive">{loginError}</div>}
          <div className="space-y-3">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={u} onChange={(e) => setU(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="off" value={p} onChange={(e) => setP(e.target.value)} />
            </div>
            <Button className="w-full" onClick={handleLogin}>Login</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <Label>Price (USD)</Label>
            <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <Label>Image URL</Label>
            <Input placeholder="https://images.unsplash.com/..." value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v as any }))}>
              <SelectTrigger>
                <SelectValue placeholder="Choose category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Colors (comma-separated)</Label>
            <Input value={form.colors} onChange={(e) => setForm((f) => ({ ...f, colors: e.target.value }))} />
          </div>
          <div>
            <Label>Sizes (comma-separated)</Label>
            <Input value={form.sizes} onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))} />
          </div>
        </div>
        {error && <div className="text-sm text-destructive">{error}</div>}
        <div className="flex gap-2">
          <Button onClick={onSubmit}>{form.id ? "Update" : "Add"} Product</Button>
          {form.id && (
            <Button variant="secondary" onClick={cancelEdit}>Cancel</Button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => (
          <Card key={p.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-muted-foreground">{p.category} • {formatPrice(p.price)}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => startEdit(p.id)}>Edit</Button>
              <Button variant="destructive" onClick={() => remove(p.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}