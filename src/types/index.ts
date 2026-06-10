export type CategoryId =
  | "sajji"
  | "karahi"
  | "handi"
  | "bbq"
  | "tandoor"
  | "fish"
  | "rice"
  | "sides";

export type Category = {
  id: CategoryId;
  name: string;
  description: string;
  emoji: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  description: string;
  longDescription?: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: "Bestseller" | "New" | "Spicy" | "Chef's Choice";
  servings?: string;
  spiceLevel?: 1 | 2 | 3;
  available: boolean;
};

export type CartItem = {
  productId: string;
  quantity: number;
};
