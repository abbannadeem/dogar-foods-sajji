import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ADMIN_COOKIE, verifySession } from "@/lib/admin-auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The middleware already protects /admin/* — but we double-check server-side
  // here for layouts that don't pass through middleware (e.g., RSC). Login page
  // doesn't use this layout (it has its own page).
  const session = await verifySession((await cookies()).get(ADMIN_COOKIE)?.value);

  // The login page uses its own root layout-less rendering (it's still under
  // /admin route group but rendered via its own page component without this
  // server-side check). If for some reason this layout wraps the login page,
  // skip the redirect there.

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-black text-white">
      <AdminSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-black/85 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between px-4 md:px-8 py-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                rel="noreferrer"
                className="text-xs uppercase tracking-wider text-muted hover:text-brand-500"
              >
                View public site ↗
              </Link>
            </div>
            <form action="/api/admin/logout" method="POST">
              <button
                type="submit"
                className="text-xs uppercase tracking-wider text-muted hover:text-brand-500 transition px-3 py-1.5 rounded-md border border-border hover:border-brand-600/50"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
