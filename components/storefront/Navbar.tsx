import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" },
  { href: "/admin", label: "Admin" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:max-w-7xl">
        <Link href="/" className="group inline-flex items-center gap-2 text-lg font-semibold text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 text-sm font-bold text-white shadow-lg">
            OW
          </span>
          <div className="leading-tight">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Owzars</p>
            <p className="text-base font-semibold">Commerce</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/cart"
            className="hidden items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-200 sm:inline-flex"
          >
            <span className="text-lg">🛒</span>
            Cart
          </Link>
        </nav>
      </div>
    </header>
  );
}
