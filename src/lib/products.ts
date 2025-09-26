import type { Product } from "./types";

export const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^[a-z0-9-]]/g, "")
    .replace(/--+/g, "-");

export const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Essential Oversized Tee",
    slug: "essential-oversized-tee",
    description:
      "A breathable, heavyweight cotton tee with dropped shoulders and a relaxed fit.",
    price: 2800,
    image:
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop",
    category: "tops",
    colors: ["black", "white", "sand"],
    sizes: ["XS", "S", "M", "L", "XL"],
    featured: true,
  },
  {
    id: 2,
    name: "Tapered Tech Cargo",
    slug: "tapered-tech-cargo",
    description:
      "Water-repellent nylon cargos with articulated knees and adjustable hem.",
    price: 6200,
    image:
      "https://images.unsplash.com/photo-1520975639498-4fdbbdae4cfd?q=80&w=1600&auto=format&fit=crop",
    category: "bottoms",
    colors: ["charcoal", "olive"],
    sizes: ["S", "M", "L", "XL"],
    featured: true,
  },
  {
    id: 3,
    name: "Minimal Coach Jacket",
    slug: "minimal-coach-jacket",
    description:
      "A clean, wind-resistant coach jacket with matte snaps and mesh lining.",
    price: 9800,
    image:
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=1600&auto=format&fit=crop",
    category: "outerwear",
    colors: ["navy", "black"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 4,
    name: "Everyday Beanie",
    slug: "everyday-beanie",
    description:
      "Rib-knit beanie in soft acrylic-wool blend. Cozy and minimal branding.",
    price: 1900,
    image:
      "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?q=80&w=1600&auto=format&fit=crop",
    category: "accessories",
    colors: ["heather-grey", "black", "brown"],
  },
  {
    id: 5,
    name: "Court Low Sneaker",
    slug: "court-low-sneaker",
    description:
      "Premium leather low-tops with cushioned insole and durable rubber outsole.",
    price: 12800,
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1600&auto=format&fit=crop",
    category: "footwear",
    colors: ["white", "black"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    featured: true,
  },
  {
    id: 6,
    name: "Relaxed Pleat Trouser",
    slug: "relaxed-pleat-trouser",
    description:
      "Soft drape twill with single pleat and relaxed straight leg.",
    price: 7400,
    image:
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1600&auto=format&fit=crop",
    category: "bottoms",
    colors: ["stone", "black"],
    sizes: ["S", "M", "L", "XL"],
  },
];

export const formatPrice = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100
  );