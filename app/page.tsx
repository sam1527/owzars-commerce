import Link from "next/link";

import ProductCard, { StorefrontProduct } from "@/components/storefront/ProductCard";

export const dynamic = "force-dynamic";

async function getFeaturedProducts(): Promise<StorefrontProduct[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/products`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const products = data?.products ?? [];

    return products.slice(0, 6).map((product: StorefrontProduct) => ({
      ...product,
      _id: product._id.toString(),
      price: Number(product.price),
    }));
  } catch (error) {
    console.error("Failed to load featured products", error);
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="space-y-16">
      <section className="grid gap-10 rounded-3xl border border-white/10 bg-gradient-to-br from-purple-600/20 via-slate-900 to-slate-950 p-10 shadow-2xl lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-14">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-200">
            Owzars
            <span className="h-1 w-1 rounded-full bg-emerald-400" />
            Commerce
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Your modern marketplace for standout digital products.
          </h1>
          <p className="max-w-2xl text-lg text-slate-200 sm:text-xl">
            Explore crafted goods from independent creators. Secure checkout, fast delivery, and a premium browsing experience—all powered by Next.js 14.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-200"
            >
              Shop now
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
            >
              Browse collection
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {["Secure checkout", "Responsive design", "Curated catalog"].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-purple-500/10 to-indigo-500/10 p-8 shadow-xl">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-52 w-52 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="relative space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Premium curation</p>
            <h2 className="text-2xl font-semibold text-white">Elevate your cart with handpicked drops</h2>
            <p className="text-slate-200">
              Discover products selected for design, quality, and utility. Enjoy immersive imagery and clear pricing before you buy.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-slate-200">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Fast setup</p>
                <p className="mt-1 text-base font-semibold text-white">Launch in minutes</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-slate-200">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Checkout</p>
                <p className="mt-1 text-base font-semibold text-white">Stripe powered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Featured</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Latest arrivals</h2>
            <p className="text-slate-300">Handpicked highlights from the catalog. Updated automatically as you add products.</p>
          </div>
          <Link
            href="/products"
            className="inline-flex w-fit items-center justify-center rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
          >
            View all products
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-slate-300">
            No products have been added yet. Create an item to see it featured here.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
