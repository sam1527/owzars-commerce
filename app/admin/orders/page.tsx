import Link from "next/link";

import OrderStatusControl from "./_components/OrderStatusControl";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";

export const dynamic = "force-dynamic";

function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export default async function AdminOrdersPage() {
  await connectToDatabase();
  const ordersRaw = await Order.find().sort({ createdAt: -1 }).lean();
  const orders = ordersRaw.map((order: any) => ({
    _id: order._id?.toString() ?? "",
    email: order.email ?? "Unknown",
    total: order.total ?? 0,
    status: order.status ?? "pending",
    createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : "",
    currency: order.currency ?? "USD",
    items: order.items ?? [],
  }));

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Orders</p>
          <h1 className="text-3xl font-semibold text-white">Payments, fulfillment & support</h1>
        </div>
        <Link
          href="/admin"
          className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30"
        >
          Back to overview
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-slate-400">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Manage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-white/5">
                <td className="px-4 py-3 font-medium text-white">{order.email}</td>
                <td className="px-4 py-3 text-slate-300">{order.items.length}</td>
                <td className="px-4 py-3 text-white">{formatCurrency(order.total, order.currency)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-100">
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <OrderStatusControl orderId={order._id} initialStatus={order.status} />
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
