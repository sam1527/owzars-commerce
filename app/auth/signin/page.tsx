import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-200">
      <h1 className="text-2xl font-semibold text-white">Sign in</h1>
      <p>
        Configure a credentials or OAuth provider in <code>.env.local</code> and wire the
        form of your choice to NextAuth.
      </p>
      <p className="text-sm text-slate-400">
        See <Link href="https://next-auth.js.org/configuration" className="underline">NextAuth docs</Link>
        {" "}for provider examples.
      </p>
    </div>
  );
}
