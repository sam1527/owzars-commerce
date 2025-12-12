import Link from "next/link";

import ProductCard, { StorefrontProduct } from "@/components/storefront/ProductCard";
import { connectToDatabase } from "@/lib/mongodb";
import { IProduct, Product } from "@/models/Product";

export const dynamic = "force-dynamic";

async function getProducts(): Promise<StorefrontProduct[]> {
  try {
    await connectToDatabase();
    const products = await Product.find().sort({ createdAt: -1 });

    return products.map((product) => ({
      ...(product.toObject() as IProduct),
      _id: product._id.toString(),
      price: Number(product.price),
      inventory: Number(product.inventory ?? 0),
    }));
  } catch (error) {
    console.error("Failed to load products:", error);
    return [];
  }
}

interface ProductsPageProps {
  searchParams?: {
    category?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const products = await getProducts();
  const categories = Array.from(new Set(products.map((product) => product.category))).filter(Boolean);
  const activeCategory = searchParams?.category ?? "all";

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((product) => product.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section className="space-y-10">
      <header className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Catalog</p>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">Explore our products</h1>
            <p className="max-w-2xl text-lg text-slate-300">
              Browse the full Owzars lineup. Filter by category and open any product to view imagery, details, and pricing.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex w-fit items-center justify-center rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
          >
            Back to home
          </Link>
        </div>

        {categories.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            <FilterChip label="All" href="/products" active={activeCategory === "all"} />
            {categories.map((category) => (
              <FilterChip
                key={category}
                label={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                active={activeCategory.toLowerCase() === category.toLowerCase()}
              />
            ))}
          </div>
        ) : null}
      </header>

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-slate-300">
          No products found. Add items to the catalog to see them here.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

interface FilterChipProps {
  label: string;
  href: string;
  active?: boolean;
}

function FilterChip({ label, href, active }: FilterChipProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-white bg-white text-slate-900 shadow"
          : "border-white/15 bg-white/5 text-slate-200 hover:border-white/30 hover:bg-white/10"
      }`}
    >
      {label}
    </Link>
  );
}
