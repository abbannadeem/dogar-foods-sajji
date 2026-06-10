"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  upsertCategoryAction,
  deleteCategoryAction,
} from "@/app/admin/menu/actions";

type Row = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  productCount: number;
};

export default function CategoriesEditor({ initial }: { initial: Row[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-4">
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <ul className="divide-y divide-border">
          {initial.map((c) => (
            <CategoryRow key={c.id} row={c} onChanged={() => router.refresh()} />
          ))}
          {initial.length === 0 && (
            <li className="p-10 text-center text-muted text-sm">
              No categories yet.
            </li>
          )}
        </ul>
      </div>

      {!adding ? (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="btn-primary text-sm"
        >
          + Add category
        </button>
      ) : (
        <CategoryNewForm
          onCancel={() => setAdding(false)}
          onSaved={() => {
            setAdding(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function CategoryRow({ row, onChanged }: { row: Row; onChanged: () => void }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [emoji, setEmoji] = useState(row.emoji);
  const [name, setName] = useState(row.name);
  const [desc, setDesc] = useState(row.description);

  function onSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("id", row.id);
    startTransition(async () => {
      const res = await upsertCategoryAction(fd);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Category saved");
      setEditing(false);
      onChanged();
    });
  }

  function onDelete() {
    if (!confirm(`Delete "${row.name}"? This category will be removed.`)) return;
    startTransition(async () => {
      const res = await deleteCategoryAction(row.id);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Category deleted");
      onChanged();
    });
  }

  if (editing) {
    return (
      <li className="p-4">
        <form onSubmit={onSave} className="grid sm:grid-cols-[80px_1fr_2fr_auto] gap-3 items-end">
          <Field label="Emoji">
            <input
              name="emoji"
              maxLength={4}
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="input text-center text-xl"
            />
          </Field>
          <Field label="Name *">
            <input
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Description">
            <input
              name="description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="input"
            />
          </Field>
          <div className="flex gap-2">
            <button type="submit" disabled={pending} className="btn-primary text-xs px-3 py-1.5 disabled:opacity-50">
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-xs uppercase tracking-wider text-muted hover:text-brand-500"
            >
              Cancel
            </button>
          </div>
        </form>
        <style jsx>{`
          :global(.input) {
            width: 100%;
            padding: 0.5rem 0.75rem;
            border-radius: 0.5rem;
            background: var(--background);
            border: 1px solid var(--border);
            color: var(--foreground);
            font-size: 0.875rem;
          }
        `}</style>
      </li>
    );
  }

  return (
    <li className="grid grid-cols-[40px_1fr_auto_auto] gap-3 items-center px-5 py-3.5 hover:bg-white/[0.02]">
      <div className="text-2xl">{row.emoji}</div>
      <div className="min-w-0">
        <div className="font-bold text-white truncate">{row.name}</div>
        <div className="text-xs text-muted truncate">{row.description}</div>
      </div>
      <div className="text-xs text-muted whitespace-nowrap">
        {row.productCount} {row.productCount === 1 ? "product" : "products"}
      </div>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setEditing(true)}
          disabled={pending}
          className="w-8 h-8 grid place-items-center rounded-md hover:bg-white/5"
          title="Edit"
        >
          ✎
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={pending}
          className="w-8 h-8 grid place-items-center rounded-md hover:bg-brand-600/15 hover:text-brand-500"
          title="Delete"
        >
          ✕
        </button>
      </div>
    </li>
  );
}

function CategoryNewForm({
  onCancel,
  onSaved,
}: {
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await upsertCategoryAction(fd);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Category created");
      onSaved();
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-surface border border-border rounded-2xl p-4 grid sm:grid-cols-[80px_1fr_2fr_auto] gap-3 items-end"
    >
      <Field label="Emoji">
        <input
          name="emoji"
          maxLength={4}
          defaultValue="🍽️"
          className="input text-center text-xl"
        />
      </Field>
      <Field label="Name *">
        <input name="name" required placeholder="e.g. Desserts" className="input" />
      </Field>
      <Field label="Description">
        <input name="description" placeholder="Sweet endings to a great meal" className="input" />
      </Field>
      <div className="flex gap-2">
        <button type="submit" disabled={pending} className="btn-primary text-xs px-3 py-1.5 disabled:opacity-50">
          Create
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs uppercase tracking-wider text-muted hover:text-brand-500"
        >
          Cancel
        </button>
      </div>
      <style jsx>{`
        :global(.input) {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          background: var(--background);
          border: 1px solid var(--border);
          color: var(--foreground);
          font-size: 0.875rem;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-muted font-bold block mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}
