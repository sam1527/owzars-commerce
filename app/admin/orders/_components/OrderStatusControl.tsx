"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["pending", "paid", "fulfilled", "cancelled"] as const;

export default function OrderStatusControl({
  orderId,
  initialStatus,
}: {
  orderId: string;
  initialStatus?: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus ?? "pending");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    setMessage(null);
    startTransition(async () => {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unable to update order" }));
        setMessage(error.error || "Unable to update order");
        return;
      }

      setMessage("Status updated");
      router.refresh();
    });
  };

  return (
    <div className="space-y-2 text-xs text-slate-300">
      <div className="flex items-center gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-white outline-none focus:border-white/30"
        >
          {STATUSES.map((value) => (
            <option key={value} value={value} className="bg-slate-900">
              {value}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleUpdate}
          disabled={isPending}
          className="rounded-lg border border-white/10 bg-white/10 px-3 py-1 font-semibold text-white transition hover:border-white/30"
        >
          {isPending ? "Saving..." : "Update"}
        </button>
      </div>
      {message && <p className="text-emerald-200">{message}</p>}
    </div>
  );
}
