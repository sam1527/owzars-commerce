import Link from "next/link";

const sections = [
  {
    title: "Tailwind CSS",
    description: "Preconfigured utility-first styling with global gradients, typography, and layout helpers.",
  },
  {
    title: "TypeScript & ESLint",
    description: "Strict typing and linting are ready to keep the codebase healthy from day one.",
  },
  {
    title: "Auth & Data",
    description: "MongoDB/Mongoose integration and a NextAuth route handler prepared for secure authentication flows.",
  },
  {
    title: "Payments",
    description: "Stripe SDK wrapper ready to drop into server actions or API routes for checkout flows.",
  },
];

export default function Home() {
  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Owzars Commerce</p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          Next.js 14 starter with auth, data, and payments
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">
          This project ships with Tailwind CSS, TypeScript, ESLint, MongoDB/Mongoose, NextAuth,
          Stripe, and bcrypt already wired up so you can focus on building commerce features.
        </p>
        <div className="flex flex-wrap gap-3 text-sm text-slate-200">
          <span className="rounded-full bg-white/10 px-3 py-1">App Router</span>
          <span className="rounded-full bg-white/10 px-3 py-1">Route Handlers</span>
          <span className="rounded-full bg-white/10 px-3 py-1">Server Actions Ready</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <div
            key={section.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur"
          >
            <h2 className="text-xl font-semibold text-white">{section.title}</h2>
            <p className="mt-2 text-slate-300">{section.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-slate-200">
        <h3 className="text-lg font-semibold text-white">Get started</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-300">
          <li>Copy <code>.env.example</code> to <code>.env.local</code> and fill in your secrets.</li>
          <li>Run <code>npm install</code> (or your preferred package manager) to fetch dependencies.</li>
          <li>Start hacking with <code>npm run dev</code> — auth, data, and payments helpers are ready.</li>
        </ol>
        <p className="mt-4 text-sm text-slate-400">
          Need docs? Visit the <Link href="https://nextjs.org/docs" className="underline">Next.js</Link>{" "}
          or <Link href="https://next-auth.js.org/" className="underline">NextAuth</Link> guides.
        </p>
      </div>
    </section>
  );
}
