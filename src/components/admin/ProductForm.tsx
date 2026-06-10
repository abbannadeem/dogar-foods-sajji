"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import type { BadgeKind } from "@prisma/client";

export type ProductFormCategory = { id: string; name: string };

export type ProductFormInitial = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  description: string;
  longDescription: string | null;
  price: number;
  oldPrice: number | null;
  image: string;
  badge: BadgeKind;
  servings: string | null;
  spiceLevel: number | null;
  available: boolean;
  displayOrder: number;
};

const EMPTY: ProductFormInitial = {
  id: "",
  slug: "",
  name: "",
  categoryId: "",
  description: "",
  longDescription: null,
  price: 0,
  oldPrice: null,
  image: "",
  badge: "NONE",
  servings: null,
  spiceLevel: null,
  available: true,
  displayOrder: 0,
};

export default function ProductForm({
  mode,
  categories,
  initial,
  submit,
}: {
  mode: "create" | "edit";
  categories: ProductFormCategory[];
  initial?: ProductFormInitial;
  submit: (formData: FormData) => Promise<{ ok: true; id: string } | { ok: false; error: string }>;
}) {
  const router = useRouter();
  const [busy, startTransition] = useTransition();
  const seed = initial ?? { ...EMPTY, categoryId: categories[0]?.id ?? "" };
  const [state, setState] = useState({ ...seed });
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ProductFormInitial>(k: K, v: ProductFormInitial[K]) {
    setState((s) => ({ ...s, [k]: v }));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const fd = new FormData(e.currentTarget);
    // checkbox always submits "on" only if checked; force a known value otherwise
    if (!fd.has("available")) fd.set("available", "");
    setError(null);
    startTransition(async () => {
      const res = await submit(fd);
      if (!res.ok) {
        setError(res.error);
        toast.error(res.error);
        return;
      }
      toast.success(mode === "create" ? "Product created" : "Changes saved");
      router.push("/admin/menu");
      router.refresh();
    });
  }

  const hasImage = state.image.startsWith("http");

  return (
    <form onSubmit={onSubmit} className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
      {/* LEFT — main fields */}
      <div className="space-y-5">
        <Section title="Basics">
          <Field label="Name *" htmlFor="name">
            <input
              id="name"
              name="name"
              required
              value={state.name}
              onChange={(e) => set("name", e.target.value)}
              className="input"
              maxLength={200}
            />
          </Field>
          <Field label="Slug (URL)" htmlFor="slug" hint="Leave empty to auto-generate from name">
            <input
              id="slug"
              name="slug"
              value={state.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder={state.name ? state.name.toLowerCase().replace(/\s+/g, "-") : "auto-generated"}
              className="input"
              maxLength={80}
            />
          </Field>
          <Field label="Category *" htmlFor="categoryId">
            <select
              id="categoryId"
              name="categoryId"
              required
              value={state.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              className="input"
            >
              <option value="">— Pick one —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </Section>

        <Section title="Description">
          <Field label="Short description *" htmlFor="description" hint="2-line teaser. Shown on cards.">
            <textarea
              id="description"
              name="description"
              required
              rows={2}
              maxLength={500}
              value={state.description}
              onChange={(e) => set("description", e.target.value)}
              className="input resize-none"
            />
          </Field>
          <Field label="Long description" htmlFor="longDescription" hint="Full story. Shown on the product page.">
            <textarea
              id="longDescription"
              name="longDescription"
              rows={4}
              maxLength={2000}
              value={state.longDescription ?? ""}
              onChange={(e) => set("longDescription", e.target.value || null)}
              className="input resize-y"
            />
          </Field>
        </Section>

        <Section title="Pricing">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Price (PKR) *" htmlFor="price">
              <input
                id="price"
                name="price"
                type="number"
                min={1}
                required
                value={state.price || ""}
                onChange={(e) => set("price", parseInt(e.target.value, 10) || 0)}
                className="input tabular-nums"
              />
            </Field>
            <Field label="Old price (PKR)" htmlFor="oldPrice" hint="Shown crossed out if set.">
              <input
                id="oldPrice"
                name="oldPrice"
                type="number"
                min={0}
                value={state.oldPrice ?? ""}
                onChange={(e) =>
                  set("oldPrice", e.target.value ? parseInt(e.target.value, 10) : null)
                }
                className="input tabular-nums"
              />
            </Field>
          </div>
        </Section>

        <Section title="Image">
          <Field label="Image URL" htmlFor="image" hint="Paste a direct image URL. Tip: search Unsplash for free food photos.">
            <input
              id="image"
              name="image"
              type="url"
              value={state.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="input"
              maxLength={800}
            />
          </Field>
          {hasImage && (
            <div className="relative aspect-[4/3] mt-3 rounded-xl overflow-hidden border border-border bg-black">
              <Image
                src={state.image}
                alt="Preview"
                fill
                sizes="400px"
                className="object-cover"
                unoptimized
              />
            </div>
          )}
        </Section>
      </div>

      {/* RIGHT — meta */}
      <aside className="space-y-5 lg:sticky lg:top-24">
        <Section title="Availability & display">
          <label className="flex items-center gap-3 cursor-pointer text-sm">
            <input
              type="checkbox"
              name="available"
              checked={state.available}
              onChange={(e) => set("available", e.target.checked)}
              className="w-5 h-5 accent-brand-600"
            />
            <span className="text-white font-semibold">
              Available for ordering
            </span>
          </label>
          <Field label="Display order" htmlFor="displayOrder" hint="Smaller = shows earlier.">
            <input
              id="displayOrder"
              name="displayOrder"
              type="number"
              value={state.displayOrder}
              onChange={(e) => set("displayOrder", parseInt(e.target.value, 10) || 0)}
              className="input tabular-nums"
            />
          </Field>
        </Section>

        <Section title="Tags">
          <Field label="Badge" htmlFor="badge">
            <select
              id="badge"
              name="badge"
              value={state.badge}
              onChange={(e) => set("badge", e.target.value as BadgeKind)}
              className="input"
            >
              <option value="NONE">None</option>
              <option value="BESTSELLER">Bestseller</option>
              <option value="NEW">New</option>
              <option value="SPICY">Spicy</option>
              <option value="CHEFS_CHOICE">Chef&apos;s Choice</option>
            </select>
          </Field>
          <Field label="Servings" htmlFor="servings">
            <input
              id="servings"
              name="servings"
              type="text"
              maxLength={100}
              placeholder="e.g. Serves 2-3"
              value={state.servings ?? ""}
              onChange={(e) => set("servings", e.target.value || null)}
              className="input"
            />
          </Field>
          <Field label="Spice level" htmlFor="spiceLevel">
            <select
              id="spiceLevel"
              name="spiceLevel"
              value={state.spiceLevel?.toString() ?? ""}
              onChange={(e) =>
                set("spiceLevel", e.target.value ? parseInt(e.target.value, 10) : null)
              }
              className="input"
            >
              <option value="">Not spicy</option>
              <option value="1">1 — Mild</option>
              <option value="2">2 — Medium</option>
              <option value="3">3 — Hot</option>
            </select>
          </Field>
        </Section>

        {error && (
          <div role="alert" className="text-sm text-brand-500 bg-brand-900/20 border border-brand-700/40 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            type="submit"
            disabled={busy}
            className="btn-primary justify-center w-full disabled:opacity-50"
          >
            {busy ? "Saving..." : mode === "create" ? "Create product" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/menu")}
            className="text-sm text-muted hover:text-brand-500 transition"
          >
            Cancel
          </button>
        </div>
      </aside>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.625rem;
          background: var(--background);
          border: 1px solid var(--border);
          color: var(--foreground);
          font-size: 0.875rem;
        }
        :global(.input:focus) {
          outline: none;
          border-color: var(--brand-600);
        }
        :global(.input:disabled) {
          opacity: 0.6;
        }
      `}</style>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-surface border border-border rounded-2xl p-5 space-y-4">
      <h3 className="font-display text-sm font-extrabold uppercase tracking-wider">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="text-xs uppercase tracking-wider text-muted font-bold block mb-1.5">
        {label}
      </span>
      {children}
      {hint && <span className="text-[11px] text-muted-2 mt-1 block">{hint}</span>}
    </label>
  );
}
