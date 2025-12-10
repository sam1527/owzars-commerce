import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Types } from "mongoose";

const ADMIN_EMAIL = "owzarsllc@gmail.com";

type ProductListItem = {
  _id: string;
  title: string;
  category: string;
  price: number;
  createdAt: string;
};

function Unauthorized() {
  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-200">
      <h1 className="text-2xl font-semibold text-white">Access denied</h1>
      <p className="text-slate-300">You must be signed in as {ADMIN_EMAIL} to manage products.</p>
      <Link href="/auth/signin" className="underline">
        Go to sign in
      </Link>
    </div>
  );
}

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== ADMIN_EMAIL) {
    return <Unauthorized />;
  }

  await connectToDatabase();
  const docs = await Product.find().sort({ createdAt: -1 }).lean();

const products: ProductListItem[] = docs.map((doc: any) => ({
  _id: doc._id?.toString() ?? "",
  title: doc.title ?? "",
  category: doc.category ?? "",
  price: doc.price ?? 0,
  createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : "",
}));

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Products</p>
          <h1 className="text-3xl font-semibold text-white">Manage catalog</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
        >
          New product
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-slate-400">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-white/5">
                <td className="px-4 py-3 font-medium text-white">{product.title}</td>
                <td className="px-4 py-3 text-slate-300">{product.category}</td>
                <td className="px-4 py-3 text-slate-300">${product.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-slate-400">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${product._id}`}
                    className="rounded-lg border border-white/10 px-3 py-1 text-xs font-semibold text-white transition hover:border-white/30"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
