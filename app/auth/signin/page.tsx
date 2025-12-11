"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  const handleGitHubSignIn = async () => {
    setError(null);
    await signIn("github", { callbackUrl });
  };

  return (
    <Suspense fallback={<div className="text-slate-300">Loading sign-in form...</div>}>
      <div className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-200 shadow-xl shadow-blue-500/10">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">Sign in</h1>
          <p className="text-sm text-slate-300">
            Access your account using email and password or continue with GitHub.
          </p>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white shadow-inner outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white shadow-inner outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing you in..." : "Sign in"}
          </button>
        </form>

        <div className="relative py-1 text-center text-xs text-slate-400">
          <span className="relative z-10 bg-slate-950 px-2">or</span>
          <span className="absolute inset-x-0 top-1/2 -z-10 h-px bg-white/10" aria-hidden />
        </div>

        <button
          type="button"
          onClick={handleGitHubSignIn}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-white transition hover:border-blue-400 hover:text-blue-100"
        >
          Continue with GitHub
        </button>

        <p className="text-sm text-slate-400">
          Need an account? Contact your administrator or check the
          <Link href="https://next-auth.js.org/configuration/providers/oauth" className="ml-1 underline">
            authentication setup docs
          </Link>
          .
        </p>
      </div>
    </Suspense>
  );
}
