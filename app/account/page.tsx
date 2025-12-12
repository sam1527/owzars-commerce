import { getServerSession } from "next-auth";

import AccountClient from "@/components/storefront/account/AccountClient";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Customers</p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">My Account</h1>
        <p className="max-w-3xl text-lg text-slate-300">
          Create an account to save your details, review orders, and streamline checkout for future purchases.
        </p>
      </div>

      <AccountClient sessionUser={session?.user ?? null} />
    </section>
  );
}
