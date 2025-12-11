"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/admin", label: "Overview", description: "KPIs & shortcuts" },
  { href: "/admin/products", label: "Products", description: "Catalog management" },
  { href: "/admin/orders", label: "Orders", description: "Payments & fulfillment" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <ul className="grid divide-y divide-white/10 text-sm text-slate-200 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <li key={link.href} className="group">
              <Link
                href={link.href}
                className={`flex h-full flex-col gap-1 px-4 py-3 transition ${
                  isActive
                    ? "bg-white/10 text-white shadow-inner"
                    : "hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-300">
                  {link.description}
                </span>
                <span className="text-base font-semibold">{link.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
