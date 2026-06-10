import type { Product } from "@/types";

const IMG = {
  sajji:
    "https://images.unsplash.com/photo-1641873933980-fcff60026f50?w=1600&q=80&auto=format&fit=crop",
  karahi:
    "https://images.unsplash.com/photo-1617692855027-33b14f061079?w=1600&q=80&auto=format&fit=crop",
  handi:
    "https://images.unsplash.com/photo-1652545296821-09a023a9fd08?w=1600&q=80&auto=format&fit=crop",
  bbqTikka:
    "https://images.unsplash.com/photo-1567529854970-ce2c4207e242?w=1600&q=80&auto=format&fit=crop",
  bbqSeekh:
    "https://images.unsplash.com/photo-1530469912745-a215c6b256ea?w=1600&q=80&auto=format&fit=crop",
  bbqMalai:
    "https://images.unsplash.com/photo-1697155406014-04dc649b0953?w=1600&q=80&auto=format&fit=crop",
  bbqBihari:
    "https://images.unsplash.com/photo-1699728088614-7d1d4277414b?w=1600&q=80&auto=format&fit=crop",
  bbqWings:
    "https://images.unsplash.com/photo-1697155406055-2db32d47ca07?w=1600&q=80&auto=format&fit=crop",
  bbqReshmi:
    "https://images.unsplash.com/photo-1563310761-f8d8ed164063?w=1600&q=80&auto=format&fit=crop",
  tandoorNaan:
    "https://images.unsplash.com/photo-1655979284091-eea0e93405ee?w=1600&q=80&auto=format&fit=crop",
  tandoorTikka:
    "https://images.unsplash.com/photo-1630851840633-f96999247032?w=1600&q=80&auto=format&fit=crop",
  fishRahu:
    "https://images.unsplash.com/photo-1556814901-18c866c057da?w=1600&q=80&auto=format&fit=crop",
  fishTrout:
    "https://images.unsplash.com/photo-1600699899970-b1c9fadd8f9e?w=1600&q=80&auto=format&fit=crop",
  biryaniChicken:
    "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1600&q=80&auto=format&fit=crop",
  biryaniMutton:
    "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=1600&q=80&auto=format&fit=crop",
  ricePulao:
    "https://images.unsplash.com/photo-1705174299330-939dd03cc864?w=1600&q=80&auto=format&fit=crop",
  sidesRaita:
    "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=1600&q=80&auto=format&fit=crop",
  sidesSalad:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1600&q=80&auto=format&fit=crop",
  sidesDrink:
    "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=1600&q=80&auto=format&fit=crop",
};

export const PRODUCTS: Product[] = [
  // ───── SAJJI CORNER ─────
  {
    id: "sajji-full",
    slug: "full-chicken-sajji",
    name: "Full Chicken Sajji",
    category: "sajji",
    description:
      "Whole chicken roasted over open flame until the skin cracks with char.",
    longDescription:
      "Marinated 12 hours in our Baloch family spice mix, then slow-roasted over open flame until the skin cracks with char and the juice runs hot. Served with rice stuffing, fresh chutneys and tandoori naan — the Tajpura signature since 2019.",
    price: 1400,
    image: IMG.sajji,
    badge: "Bestseller",
    servings: "Serves 3-4",
    spiceLevel: 2,
    available: true,
  },
  {
    id: "sajji-half",
    slug: "half-chicken-sajji",
    name: "Half Chicken Sajji",
    category: "sajji",
    description:
      "Half chicken pulled off the open flame — smoky, juicy, Balochi spice.",
    longDescription:
      "Same 12-hour marinade, same open flame as our full sajji — just sized for one or two. The char on the skin, the spice rub, the juice underneath. Served with chutneys and a fresh naan.",
    price: 850,
    image: IMG.sajji,
    servings: "Serves 1-2",
    spiceLevel: 2,
    available: true,
  },
  {
    id: "sajji-leg",
    slug: "sajji-leg-piece",
    name: "Sajji Leg Piece",
    category: "sajji",
    description:
      "Juicy leg piece with charred skin and hand-pounded Balochi spices.",
    longDescription:
      "The piece everyone fights over. Slow-roasted over flame, the leg holds the spice and the smoke better than any cut. Comes with a chutney and a naan.",
    price: 550,
    image: IMG.sajji,
    spiceLevel: 2,
    available: true,
  },

  // ───── KARAHI CORNER ─────
  {
    id: "karahi-mutton-full",
    slug: "mutton-karahi-full",
    name: "Mutton Karahi (Full)",
    category: "karahi",
    description:
      "Local farm mutton, hand-wok-charred in a tomato gravy so thick it coats the meat.",
    longDescription:
      "Mutton from the same Baloch-owned farms we've bought from since 2019. Wok-charred with hand-crushed tomatoes, green chillies, ginger and our house masala. The oil on top carries the char from open flame.",
    price: 2200,
    image: IMG.karahi,
    badge: "Chef's Choice",
    servings: "Serves 3-4",
    spiceLevel: 3,
    available: true,
  },
  {
    id: "karahi-mutton-half",
    slug: "mutton-karahi-half",
    name: "Mutton Karahi (Half)",
    category: "karahi",
    description:
      "Half plate of our flame-charred Lahori mutton karahi — same wok, same fire.",
    price: 1150,
    image: IMG.karahi,
    servings: "Serves 1-2",
    spiceLevel: 3,
    available: true,
  },
  {
    id: "karahi-chicken-full",
    slug: "chicken-karahi-full",
    name: "Chicken Karahi (Full)",
    category: "karahi",
    description:
      "Chicken in red tomato gravy with whole spices you bite into.",
    longDescription:
      "Lahori-style chicken karahi cooked the slow way — fresh tomatoes broken down on the flame, whole black pepper and clove, ginger julienne on top. Less heat than the mutton karahi, more flavour.",
    price: 1450,
    image: IMG.karahi,
    badge: "Bestseller",
    servings: "Serves 3-4",
    spiceLevel: 2,
    available: true,
  },
  {
    id: "karahi-chicken-half",
    slug: "chicken-karahi-half",
    name: "Chicken Karahi (Half)",
    category: "karahi",
    description: "Half plate of Lahori-style chicken karahi.",
    price: 1050,
    image: IMG.karahi,
    spiceLevel: 2,
    available: true,
  },

  // ───── HANDI CORNER ─────
  {
    id: "handi-white-karahi",
    slug: "white-handi",
    name: "Chicken White Handi",
    category: "handi",
    description:
      "Silky yogurt and cashew gravy that's buttery from the pan — mild, creamy, no heat.",
    longDescription:
      "The opposite of our karahis. Yogurt and cashew gravy simmered low in a handi until it's silky enough to drink. No tomato, no chilli heat — just cream, white pepper and a whisper of cardamom.",
    price: 1350,
    image: IMG.handi,
    badge: "Chef's Choice",
    servings: "Serves 2-3",
    spiceLevel: 1,
    available: true,
  },
  {
    id: "handi-makhani",
    slug: "chicken-makhani-handi",
    name: "Chicken Makhani Handi",
    category: "handi",
    description:
      "Butter and tomato gravy from the pan's char, with kasuri methi and a whisper of smoke.",
    longDescription:
      "Softer than a karahi but with the same fire underneath. Butter and tomato slow-cooked in the handi, finished with kasuri methi and a coal-smoked dum at the end. Mild heat, deep flavour.",
    price: 1250,
    image: IMG.handi,
    servings: "Serves 2-3",
    spiceLevel: 1,
    available: true,
  },

  // ───── BBQ CORNER ─────
  {
    id: "bbq-chicken-tikka",
    slug: "chicken-tikka",
    name: "Chicken Tikka",
    category: "bbq",
    description:
      "Char-grilled chicken quarter, yogurt-and-masala marinated overnight.",
    price: 380,
    image: IMG.bbqTikka,
    badge: "Bestseller",
    spiceLevel: 2,
    available: true,
  },
  {
    id: "bbq-seekh-kebab",
    slug: "seekh-kebab",
    name: "Beef Seekh Kebab (4 pcs)",
    category: "bbq",
    description:
      "Hand-minced beef seekh with fresh coriander, green chilli and hand-pounded spices.",
    price: 320,
    image: IMG.bbqSeekh,
    spiceLevel: 2,
    available: true,
  },
  {
    id: "bbq-malai-boti",
    slug: "malai-boti",
    name: "Chicken Malai Boti",
    category: "bbq",
    description:
      "Cream-and-cheese marinated chicken cubes, grilled till the edges blacken.",
    price: 360,
    image: IMG.bbqMalai,
    spiceLevel: 1,
    available: true,
  },
  {
    id: "bbq-bihari-boti",
    slug: "beef-bihari-boti",
    name: "Beef Bihari Boti",
    category: "bbq",
    description:
      "Thin beef strips in Bihari masala, papaya-tenderised and flame-grilled.",
    price: 340,
    image: IMG.bbqBihari,
    spiceLevel: 2,
    available: true,
  },
  {
    id: "bbq-reshmi",
    slug: "reshmi-kebab",
    name: "Reshmi Kebab",
    category: "bbq",
    description: "Silky minced chicken kebab — soft enough to break with a fork.",
    price: 280,
    image: IMG.bbqReshmi,
    spiceLevel: 1,
    available: true,
  },
  {
    id: "bbq-wings",
    slug: "chicken-wings",
    name: "Spicy Chicken Wings (6 pcs)",
    category: "bbq",
    description: "Hot, smoky wings — the late-night Tajpura favourite.",
    price: 160,
    image: IMG.bbqWings,
    badge: "Spicy",
    spiceLevel: 3,
    available: true,
  },

  // ───── TANDOOR CORNER ─────
  {
    id: "tandoor-naan",
    slug: "tandoori-naan",
    name: "Tandoori Naan",
    category: "tandoor",
    description: "Fresh from the clay oven — pulled hot, blistered, eaten now.",
    price: 40,
    image: IMG.tandoorNaan,
    available: true,
  },
  {
    id: "tandoor-roghni",
    slug: "roghni-naan",
    name: "Roghni Naan",
    category: "tandoor",
    description:
      "Soft enriched naan with sesame and kalonji, brushed with ghee from the clay oven.",
    price: 80,
    image: IMG.tandoorNaan,
    available: true,
  },
  {
    id: "tandoor-garlic-naan",
    slug: "garlic-naan",
    name: "Garlic Naan",
    category: "tandoor",
    description: "Buttery naan loaded with roasted garlic and fresh coriander.",
    price: 120,
    image: IMG.tandoorNaan,
    available: true,
  },
  {
    id: "tandoor-tikka",
    slug: "tandoori-chicken-tikka",
    name: "Tandoori Chicken Tikka",
    category: "tandoor",
    description:
      "Yogurt-marinated chicken cooked deep inside the clay oven — char on the outside, juicy inside.",
    price: 380,
    image: IMG.tandoorTikka,
    spiceLevel: 2,
    available: true,
  },

  // ───── FISH CORNER ─────
  {
    id: "fish-rahu",
    slug: "fried-rahu-fish",
    name: "Fried Rahu Fish (per kg)",
    category: "fish",
    description:
      "Fresh river Rahu, masala-rubbed and crisp-fried — Lahori riverside style.",
    price: 1850,
    image: IMG.fishRahu,
    badge: "Bestseller",
    spiceLevel: 2,
    available: true,
  },
  {
    id: "fish-trout",
    slug: "grilled-trout",
    name: "Grilled Trout",
    category: "fish",
    description:
      "Whole trout grilled over flame with lemon, garlic and fresh herbs.",
    price: 1450,
    image: IMG.fishTrout,
    spiceLevel: 1,
    available: true,
  },

  // ───── RICE & BIRYANI ─────
  {
    id: "rice-chicken-biryani",
    slug: "chicken-biryani",
    name: "Chicken Biryani",
    category: "rice",
    description:
      "Aged basmati layered with chicken, kewra and the dum smoke from sealed pot.",
    price: 350,
    image: IMG.biryaniChicken,
    badge: "Bestseller",
    spiceLevel: 2,
    available: true,
  },
  {
    id: "rice-mutton-biryani",
    slug: "mutton-biryani",
    name: "Mutton Biryani",
    category: "rice",
    description:
      "Slow-cooked mutton layered with saffron basmati — dum-sealed until the rice takes the colour.",
    price: 550,
    image: IMG.biryaniMutton,
    spiceLevel: 2,
    available: true,
  },
  {
    id: "rice-pulao",
    slug: "kabuli-pulao",
    name: "Kabuli Pulao",
    category: "rice",
    description: "Saffron pulao with golden raisins and toasted almonds.",
    price: 320,
    image: IMG.ricePulao,
    spiceLevel: 1,
    available: true,
  },

  // ───── SIDES ─────
  {
    id: "side-raita",
    slug: "mint-raita",
    name: "Mint Raita",
    category: "sides",
    description: "Cool yogurt whisked with fresh mint and roasted cumin.",
    price: 80,
    image: IMG.sidesRaita,
    available: true,
  },
  {
    id: "side-salad",
    slug: "house-salad",
    name: "House Salad",
    category: "sides",
    description: "Crisp onion, cucumber and tomato with lemon and a pinch of chaat masala.",
    price: 100,
    image: IMG.sidesSalad,
    available: true,
  },
  {
    id: "side-soft-drink",
    slug: "soft-drink-bottle",
    name: "Soft Drink (1.5L)",
    category: "sides",
    description: "Coke / Sprite / Fanta — chilled bottle, straight from the fridge.",
    price: 220,
    image: IMG.sidesDrink,
    available: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getFeaturedProducts(limit = 8): Product[] {
  return PRODUCTS.filter((p) => p.badge).slice(0, limit);
}

export function formatPKR(amount: number): string {
  return `Rs ${amount.toLocaleString("en-PK")}`;
}
