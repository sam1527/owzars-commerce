import Link from "next/link";
import { getServerSession } from "next-auth";

import AdminNav from "@/components/admin/AdminNav";
import { authOptions } from "@/lib/auth";
import { ADMIN_EMAIL } from "@/lib/constants";

function Unauthorized() {
  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-200">
      <h1 className="text-2xl font-semibold text-white">Access denied</h1>
      <p className="text-slate-300">You must be signed in as {ADMIN_EMAIL} to manage this site.</p>
      <Link href="/auth/signin" className="underline">
        Go to sign in
      </Link>
    </div>
  );
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  if (!isAdmin) {
    return <Unauthorized />;
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-900/60 via-slate-900 to-black p-6 text-white shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-indigo-200/80">Admin control</p>
            <h1 className="text-3xl font-semibold">Owzars commerce console</h1>
            <p className="max-w-2xl text-sm text-indigo-100/80">
              Monitor revenue, manage inventory, and keep your storefront aligned with your business goals.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/products/new"
              className="rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
            >
              + Add product
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40"
            >
              View storefront
            </Link>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-indigo-100/80">
          <span className="rounded-full bg-white/10 px-3 py-1 font-semibold">Signed in as {session?.user?.email}</span>
          <span className="rounded-full bg-white/10 px-3 py-1 font-semibold">Single-tenant admin</span>
          <span className="rounded-full bg-white/10 px-3 py-1 font-semibold">Secure access</span>
        </div>
      </div>

      <AdminNav />

      {children}
    </section>
  );
}
