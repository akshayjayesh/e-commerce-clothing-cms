export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number; // in cents
  image: string;
  category: "tops" | "bottoms" | "outerwear" | "accessories" | "footwear";
  colors?: string[];
  sizes?: string[]; // e.g., XS, S, M, L, XL
  featured?: boolean;
};

export type CartItem = {
  productId: number;
  quantity: number;
  size?: string;
  color?: string;
};