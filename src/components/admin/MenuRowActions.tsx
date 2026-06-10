"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  toggleAvailabilityAction,
  deleteProductAction,
} from "@/app/admin/menu/actions";

export default function MenuRowActions({
  id,
  available,
}: {
  id: string;
  available: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function toggle() {
    if (pending) return;
    startTransition(async () => {
      const res = await toggleAvailabilityAction(id);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(res.available ? "Now visible" : "Hidden from menu");
      router.refresh();
    });
  }

  function remove() {
    if (pending) return;
    if (!confirm("Delete this product? This cannot be undone.")) return;
    startTransition(async () => {
      const res = await deleteProductAction(id);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Product deleted");
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1 justify-end">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        title={available ? "Hide from menu" : "Show on menu"}
        className="w-8 h-8 grid place-items-center rounded-md hover:bg-white/5 disabled:opacity-50"
      >
        {available ? (
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        )}
      </button>
      <Link
        href={`/admin/menu/${id}/edit`}
        title="Edit"
        className="w-8 h-8 grid place-items-center rounded-md hover:bg-white/5"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </Link>
      <button
        type="button"
        onClick={remove}
        disabled={pending}
        title="Delete"
        className="w-8 h-8 grid place-items-center rounded-md hover:bg-brand-600/15 hover:text-brand-500 disabled:opacity-50"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
        </svg>
      </button>
    </div>
  );
}
