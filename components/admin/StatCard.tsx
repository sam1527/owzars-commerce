import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  footer?: ReactNode;
}

export default function StatCard({ title, value, subtitle, icon, footer }: StatCardProps) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-200 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-white">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
        </div>
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-lg text-white">
            {icon}
          </div>
        )}
      </div>
      {footer && <div className="text-sm text-slate-300">{footer}</div>}
    </div>
  );
}
