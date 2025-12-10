export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-slate-400 lg:max-w-7xl sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-slate-200">Owzars Commerce</p>
        <p className="text-slate-400">Crafted with Next.js, Tailwind CSS, and Stripe.</p>
      </div>
    </footer>
  );
}
