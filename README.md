# 🔥 Dogar Foods & Sajji

> Full-stack restaurant ordering platform — Pakistani BBQ chain with menu management, order processing, admin dashboard, coupons, and analytics.

🌐 **Live:** [dogar-foods-sajji.vercel.app](https://dogar-foods-sajji.vercel.app)
📦 **Source:** [github.com/abbannadeem/dogar-foods-sajji](https://github.com/abbannadeem/dogar-foods-sajji)

> ⚠️ **Portfolio demo** — phone numbers, emails and business details are placeholders. The original site is rebuilt here as a showcase, not a live business.

---

## ✨ Features

### 🏠 Public Site

- **Hero with editorial typography** — Playfair Display + Inter, full-bleed food photography
- **Menu** — 27 dishes across 8 categories with real Unsplash imagery, live search, category filter
- **Product pages** — image gallery, spice level, badges, related items, "Order on WhatsApp" prefill
- **Branches** — 3 active branches (Lahore × 2 + Faisalabad) + "Coming Soon" Shadbagh card
- **About / Contact / FAQ** with working contact form (client-validated)
- **Privacy / Terms** placeholder pages
- **Mobile-first** with full-screen slide-in mobile menu
- **SEO** — sitemap.xml, robots.txt, OpenGraph metadata

### 🛒 Cart & Checkout

- React Context + `useReducer` cart state, persisted to `localStorage`
- Sliding cart drawer (right side, accessible from any page)
- Quick add buttons on product cards + dedicated add button on detail page
- Cart icon badge with item count in header
- Toast notifications (Sonner) on add / remove
- **Full checkout flow:**
  - Customer details (name, phone, email, address, area, city, branch)
  - 5 payment methods (COD, JazzCash, EasyPaisa, Bank Transfer, SafePay)
  - **Coupon code field** with server-side validation
  - Server-side price re-verification (anti-tampering)
  - Order persistence to Postgres
  - **WhatsApp deep-link** opens with prefilled order details
  - Order success page with order number

### 🔐 Admin Panel (`/admin`)

- **Single-admin auth** — HMAC-signed session cookies, edge-compatible (no NextAuth dependency)
- **Dashboard** — today/week stats, pending count, recent 8 orders
- **Orders** — search by code/name/phone, filter by status, inline status updates
- **Order detail** — full order with customer, delivery, payment, items, status timeline
- **Menu management** — full CRUD on products + categories with image URL preview, delete guards, slug auto-generation
- **Coupons** — FIXED or PERCENT discount, min order threshold, max cap, validity dates, usage limit, pause/activate toggle
- **Customers** — aggregated from orders by phone, lifetime value, order history per customer
- **Analytics** — last-7-days revenue chart (pure SVG), top 5 products by revenue, branch performance, order status mix

### 🗄 Database & Persistence

- **Prisma 6 + PostgreSQL** (Neon, Supabase or Vercel Postgres — all work)
- 5 models: `Category`, `Product`, `Order`, `OrderItem`, `Coupon`
- Enums for type-safety: `OrderStatus`, `PaymentMethod`, `BadgeKind`, `CouponType`
- **Graceful fallback** — site stays functional without DB connection (orders flow to WhatsApp, public site uses static menu snapshot)
- Idempotent seed script migrates the hardcoded menu into the DB

---

## 🛠 Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 16** (App Router, Turbopack) | SSG + RSC + Route Handlers, all in one |
| UI | **React 19** + **TypeScript 5** | Strict mode, type-safe end-to-end |
| Styling | **Tailwind CSS v4** | New `@theme` directive, CSS-vars-first |
| Fonts | **Playfair Display** + **Inter** | Editorial display + clean body |
| Database | **PostgreSQL** via **Prisma 6** | Type-safe ORM, free Neon tier |
| Auth | **Custom HMAC sessions** | Edge-compatible, no external dependency |
| State | **React Context + useReducer** | Cart, no Redux needed |
| Notifications | **Sonner** | Beautiful accessible toasts |
| Hosting | **Vercel** | Native Next.js platform, instant deploys |
| Photos | **Unsplash** CDN | Free high-quality food photography |

---

## 📁 Project Structure

```
src/
├─ app/                  # Next.js App Router
│  ├─ admin/             # Protected admin panel (middleware-guarded)
│  │  ├─ login/
│  │  ├─ orders/         # list + [orderNumber] detail + actions
│  │  ├─ menu/           # products + categories + new/edit
│  │  ├─ coupons/
│  │  ├─ customers/      # list + [phone] history
│  │  └─ analytics/
│  ├─ api/
│  │  ├─ admin/login,logout
│  │  └─ orders/         # POST: verify price, save, return WhatsApp URL
│  ├─ menu/[slug]/       # Product detail (SSG + ISR-ready)
│  ├─ cart/, checkout/, order/[orderNumber]/
│  └─ sitemap.ts, robots.ts
├─ components/
│  ├─ admin/             # AdminSidebar, ProductForm, CouponsEditor, etc.
│  └─ ...                # Header, Footer, Hero, ProductCard, CartDrawer
├─ lib/
│  ├─ admin-auth.ts      # HMAC-signed cookies (Web Crypto)
│  ├─ admin-orders.ts    # Admin query helpers
│  ├─ admin-analytics.ts # Aggregations for dashboards
│  ├─ cart-context.tsx   # Cart Context Provider + reducer
│  ├─ coupons.ts         # Server-side validateCoupon
│  ├─ menu-db.ts         # DB-aware menu reads with fallback
│  ├─ whatsapp.ts        # Order → WhatsApp deep link templating
│  └─ db.ts, constants.ts
├─ data/
│  ├─ menu-static.ts     # Hardcoded 27 products (fallback + seed source)
│  └─ categories-static.ts
├─ types/                # Shared TypeScript types
└─ middleware.ts         # Auth guard for /admin/*
prisma/
├─ schema.prisma         # Models
└─ seed.ts               # Migrate static data → DB
```

---

## 🚀 Local Development

```bash
# 1. Install
npm install

# 2. Configure environment (.env)
cp .env.example .env
# Edit .env: set DATABASE_URL, ADMIN_PASSWORD, AUTH_SECRET

# 3. Set up the database
npm run db:push      # creates tables
npm run db:seed      # populates 27 products + 8 categories

# 4. Run
npm run dev          # → http://localhost:3000
```

### Required Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `ADMIN_PASSWORD` | Password for `/admin/login` | (any strong string) |
| `AUTH_SECRET` | HMAC secret for session cookies | `openssl rand -base64 32` |

Without `DATABASE_URL` the site degrades gracefully — orders flow to WhatsApp only, admin features show informational banners.

---

## 🎯 Architectural Decisions

### Why custom auth instead of NextAuth?
Single-admin use case — no need for OAuth, user table, or session DB. HMAC-signed cookies via Web Crypto are edge-compatible (middleware can verify without Node), have zero runtime cost, and are ~120 lines of well-tested code.

### Why DB-aware fallback?
The public site should never break because the database is misconfigured. Every query in `lib/menu-db.ts` falls back to a static snapshot, so deploys without `DATABASE_URL` still produce a functional restaurant site.

### Why orders go to WhatsApp **and** the database?
- **WhatsApp**: instant operational signal — the branch sees the order in real-time, no dashboard polling needed.
- **Database**: permanent record for history, analytics, customer profiles, and coupon usage tracking.

Both run on the same `POST /api/orders` — DB is best-effort, WhatsApp URL is always returned.

### Why server-side price verification?
A malicious client could send a tampered `total`. The API recomputes the subtotal from the canonical product prices and re-validates coupon discounts before persisting.

### Why pure-SVG analytics charts?
Avoiding a chart library (recharts, chart.js) keeps the bundle small and the design fully customizable. The 7-day revenue chart is ~30 lines.

---

## 📦 Phase Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| **1** | Foundation, design system, 8 public pages | ✅ Done |
| **2** | Cart, checkout, orders, WhatsApp integration, Prisma | ✅ Done |
| **3** | Admin panel (auth, orders, customers) | ✅ Done |
| **4** | Menu management (admin CRUD) | ✅ Done |
| **4.5** | Coupons, analytics, SEO, DB-aware public menu | ✅ Done |
| 5 | Real payment gateways (SafePay / JazzCash) | Future |
| 5 | SMS notifications (Twilio) | Future |
| 5 | Email receipts | Future |
| 5 | Delivery zones with auto-calculated fees | Future |
| 5 | File upload for product images (Vercel Blob) | Future |

---

## 🤝 Notes for Reviewers

This project was built with AI-assisted development. The architecture, technology choices, file organization, and quality reviews were guided by a senior developer; AI helped accelerate boilerplate and component scaffolding. Every file has been reviewed and customized.

---

## 📄 License

This is a portfolio piece. Code is provided as-is for review purposes. The "Dogar Foods & Sajji" name is used as a thematic placeholder.
