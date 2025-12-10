import Link from "next/link";

import { connectToDatabase } from "@/lib/mongodb";
import { IProduct, Product } from "@/models/Product";
import ProductCard, { StorefrontProduct } from "@/components/storefront/ProductCard";

async function getProducts(): Promise<StorefrontProduct[]> {
  await connectToDatabase();
  const products = await Product.find().sort({ createdAt: -1 });

  return products.map((product) => ({
    ...(product.toObject() as IProduct),
    _id: product._id.toString(),
    price: Number(product.price),
  }));
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <section className="space-y-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Products</p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">Explore our catalog</h1>
          <p className="max-w-2xl text-lg text-slate-300">
            Discover curated products available in the store. Browse the latest additions and find something you love.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex w-fit items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
        >
          Back to home
        </Link>
      </header>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-slate-300">
          No products found. Add items to the catalog to see them here.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
