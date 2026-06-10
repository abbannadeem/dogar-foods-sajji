import type { Metadata } from "next";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  return (
    <main className="min-h-screen grid place-items-center px-4 py-12 bg-gradient-to-br from-brand-900/30 via-black to-black">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-display text-2xl font-extrabold uppercase tracking-wider">
            Admin <span className="text-brand-500">Console</span>
          </div>
          <p className="text-sm text-muted mt-2">
            Dogar Foods &amp; Sajji — internal dashboard.
          </p>
        </div>
        <AdminLoginForm redirectTo={from || "/admin"} />
        <p className="mt-8 text-center text-xs text-muted-2">
          Unauthorized access is monitored.
        </p>
      </div>
    </main>
  );
}
