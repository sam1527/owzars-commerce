"use client";

import { FormEvent, useEffect, useState } from "react";
import { signIn, signOut } from "next-auth/react";

type SessionUser = {
  id?: string;
  email?: string | null;
  name?: string | null;
};

type OrderItem = {
  _id: string;
  total: number;
  currency: string;
  createdAt: string;
  items: { quantity: number }[];
  status?: string;
};

type AccountClientProps = {
  sessionUser: SessionUser | null;
};

export default function AccountClient({ sessionUser }: AccountClientProps) {
  const [name, setName] = useState(sessionUser?.name ?? "");
  const [password, setPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    if (!sessionUser?.email) return;

    const fetchAccount = async () => {
      const response = await fetch("/api/account");
      if (response.ok) {
        const data = await response.json();
        setName(data.user?.name ?? sessionUser.name ?? "");
      }
    };

    const fetchOrders = async () => {
      setIsLoadingOrders(true);
      const response = await fetch("/api/orders/mine");
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders ?? []);
      }
      setIsLoadingOrders(false);
    };

    fetchAccount();
    fetchOrders();
  }, [sessionUser]);

  const handleProfileSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    const response = await fetch("/api/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password: password || undefined }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setFeedback(data.error || "Unable to update account");
      return;
    }

    setPassword("");
    setFeedback("Profile updated successfully.");
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (!registerEmail || !registerPassword) {
      setFeedback("Email and password are required");
      return;
    }

    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: registerEmail, password: registerPassword, name: registerName }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setFeedback(data.error || "Unable to create account");
      return;
    }

    await signIn("credentials", {
      redirect: false,
      email: registerEmail,
      password: registerPassword,
      callbackUrl: "/account",
    });

    setFeedback("Account created! You are now signed in.");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold text-white">My Account</h2>
        {sessionUser ? (
          <>
            <p className="text-sm text-slate-300">
              Signed in as <span className="font-semibold text-white">{sessionUser.email}</span>
            </p>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1 text-sm text-slate-300">
                  <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Name</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-white outline-none focus:border-blue-400"
                    placeholder="Your name"
                  />
                </label>
                <label className="space-y-1 text-sm text-slate-300">
                  <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">New password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-white outline-none focus:border-blue-400"
                    placeholder="••••••••"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
              >
                Save changes
              </button>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="ml-3 inline-flex items-center justify-center rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40"
              >
                Sign out
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-300">Create an account to save orders and manage your details.</p>
            <form onSubmit={handleRegister} className="space-y-3">
              <label className="space-y-1 text-sm text-slate-300">
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Name</span>
                <input
                  value={registerName}
                  onChange={(event) => setRegisterName(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-white outline-none focus:border-blue-400"
                  placeholder="Your name"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-300">
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Email</span>
                <input
                  type="email"
                  required
                  value={registerEmail}
                  onChange={(event) => setRegisterEmail(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-white outline-none focus:border-blue-400"
                  placeholder="you@example.com"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-300">
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Password</span>
                <input
                  type="password"
                  required
                  value={registerPassword}
                  onChange={(event) => setRegisterPassword(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-white outline-none focus:border-blue-400"
                  placeholder="••••••••"
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
              >
                Create account
              </button>
              <p className="text-xs text-slate-400">
                Already registered? <a href="/auth/signin" className="underline">Sign in instead.</a>
              </p>
            </form>
          </>
        )}

        {feedback ? <p className="text-sm text-emerald-200">{feedback}</p> : null}
      </div>

      <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-xl font-semibold text-white">Order history</h3>
        {!sessionUser ? (
          <p className="text-sm text-slate-300">Sign in to view your purchases and track deliveries.</p>
        ) : isLoadingOrders ? (
          <p className="text-sm text-slate-300">Loading your orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-slate-300">No orders yet. Add products to your cart to get started.</p>
        ) : (
          <ul className="divide-y divide-white/10 text-sm text-slate-200">
            {orders.map((order) => (
              <li key={order._id} className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">
                      {new Date(order.createdAt).toLocaleDateString()} · {order.items?.length ?? 0} item(s)
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Status: {order.status ?? "pending"}</p>
                  </div>
                  <p className="text-base font-semibold text-white">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: order.currency || "USD",
                    }).format(order.total ?? 0)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
