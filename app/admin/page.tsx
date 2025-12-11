import Link from "next/link";

import StatCard from "@/components/admin/StatCard";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export default async function AdminDashboardPage() {
  await connectToDatabase();

  const [productCount, orderCount] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
  ]);

  const revenueAgg = await Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]);
  const totalRevenue = revenueAgg[0]?.total ?? 0;
  const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

  const recentOrdersRaw = await Order.find().sort({ createdAt: -1 }).limit(5).lean();
  const recentOrders = recentOrdersRaw.map((order: any) => ({
    _id: order._id?.toString() ?? "",
    email: order.email ?? "Unknown",
    total: order.total ?? 0,
    status: order.status ?? "pending",
    createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : "",
    currency: order.currency ?? "USD",
    items: order.items ?? [],
  }));

  const recentProductsRaw = await Product.find().sort({ createdAt: -1 }).limit(5).lean();
  const recentProducts = recentProductsRaw.map((product: any) => ({
    _id: product._id?.toString() ?? "",
    title: product.title ?? "",
    category: product.category ?? "",
    price: product.price ?? 0,
    createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : "",
  }));

  const distinctCustomers = await Order.distinct("email");
  const totalCustomers = distinctCustomers.filter(Boolean).length;

  const currency = recentOrders[0]?.currency ?? "USD";

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Revenue"
          value={formatCurrency(totalRevenue, currency)}
          subtitle="Lifetime processed volume"
          icon={<span>💰</span>}
          footer={<span className="text-green-200">Track cash flow across all orders.</span>}
        />
        <StatCard
          title="Orders"
          value={orderCount.toLocaleString()}
          subtitle="Total orders captured"
          icon={<span>📦</span>}
          footer={<span className="text-blue-200">Monitor fulfillment workload.</span>}
        />
        <StatCard
          title="Products"
          value={productCount.toLocaleString()}
          subtitle="Active catalog items"
          icon={<span>🛍️</span>}
          footer={<span className="text-purple-200">Keep inventory fresh and organized.</span>}
        />
        <StatCard
          title="AOV"
          value={formatCurrency(averageOrderValue || 0, currency)}
          subtitle="Average order value"
          icon={<span>📈</span>}
          footer={<span className="text-amber-200">Use discounts and bundles to lift this metric.</span>}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-200 lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Recent orders</p>
              <h2 className="text-xl font-semibold text-white">Payments & fulfillment</h2>
            </div>
            <Link
              href="/admin/orders"
              className="rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-white transition hover:border-white/40"
            >
              View all orders
            </Link>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-slate-200">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-medium">{order.email}</td>
                    <td className="px-4 py-3 text-slate-300">{order.items.length}</td>
                    <td className="px-4 py-3 text-white">{formatCurrency(order.total, order.currency)}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-100">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-200">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Catalog health</p>
              <h2 className="text-xl font-semibold text-white">Latest products</h2>
            </div>
            <Link
              href="/admin/products"
              className="rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-white transition hover:border-white/40"
            >
              Manage catalog
            </Link>
          </div>

          <ul className="divide-y divide-white/10 text-sm">
            {recentProducts.map((product) => (
              <li key={product._id} className="flex flex-col gap-1 px-2 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{product.title}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{product.category}</p>
                  </div>
                  <p className="text-sm font-semibold text-white">{formatCurrency(product.price)}</p>
                </div>
                <p className="text-xs text-slate-400">
                  Added {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "recently"}
                </p>
              </li>
            ))}
            {recentProducts.length === 0 && (
              <li className="px-2 py-4 text-center text-slate-400">No products created yet.</li>
            )}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-200">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Operational checklist</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Run your store with confidence</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span>✅</span>
              <div>
                <p className="font-semibold text-white">Configure payments & currency</p>
                <p className="text-slate-400">Stripe checkout is wired; confirm your live keys before launch.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span>✅</span>
              <div>
                <p className="font-semibold text-white">Create compelling listings</p>
                <p className="text-slate-400">High-quality images, clear pricing, and descriptive copy drive conversion.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span>✅</span>
              <div>
                <p className="font-semibold text-white">Plan fulfillment</p>
                <p className="text-slate-400">Align inventory, packaging, and delivery SLAs with your product promises.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-200">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Engagement</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Customer touchpoints</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="font-semibold text-white">{totalCustomers} unique customers</p>
              <p className="text-slate-400">Use email receipts and post-purchase flows to nurture loyalty.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="font-semibold text-white">Self-serve product updates</p>
              <p className="text-slate-400">Create, edit, and archive products without touching the codebase.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="font-semibold text-white">Analytics-ready schema</p>
              <p className="text-slate-400">Orders and products are normalized for downstream reporting.</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-200">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Shortcuts</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Act fast</h2>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-1">
            <Link
              href="/admin/products/new"
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:border-white/30"
            >
              Launch a product <span>→</span>
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:border-white/30"
            >
              Audit catalog <span>→</span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:border-white/30"
            >
              Review orders <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
