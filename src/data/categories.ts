import type { Category } from "@/types";

export const CATEGORIES: Category[] = [
  {
    id: "sajji",
    name: "Sajji Corner",
    description: "Slow-roasted whole chicken seasoned with traditional spices",
    emoji: "🍗",
  },
  {
    id: "karahi",
    name: "Karahi Corner",
    description: "Sizzling wok-cooked curries with fresh ingredients",
    emoji: "🥘",
  },
  {
    id: "handi",
    name: "Handi Corner",
    description: "Slow-cooked stews simmered to perfection",
    emoji: "🍲",
  },
  {
    id: "bbq",
    name: "BBQ Corner",
    description: "Char-grilled tikka, kebabs and skewers",
    emoji: "🍢",
  },
  {
    id: "tandoor",
    name: "Tandoor Corner",
    description: "Fresh from the clay oven — naans, rotis, and tandoori specials",
    emoji: "🔥",
  },
  {
    id: "fish",
    name: "Fish Corner",
    description: "Crispy fried and grilled fish specialties",
    emoji: "🐟",
  },
  {
    id: "rice",
    name: "Rice & Biryani",
    description: "Aromatic biryani and pulao",
    emoji: "🍚",
  },
  {
    id: "sides",
    name: "Sides & Breads",
    description: "Naans, raitas, salads and accompaniments",
    emoji: "🫓",
  },
];

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
);
