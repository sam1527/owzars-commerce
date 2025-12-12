import { notFound } from "next/navigation";
import Link from "next/link";

import AddToCartButton from "@/components/cart/AddToCartButton";
import ImageGallery from "@/components/storefront/ImageGallery";
import Price from "@/components/storefront/Price";
import { connectToDatabase } from "@/lib/mongodb";
import { IProduct, Product } from "@/models/Product";

interface ProductPageProps {
  params: { id: string };
}

async function getProduct(id: string) {
  await connectToDatabase();
  const product = await Product.findById(id);

  if (!product) {
    return null;
  }

  return {
    ...(product.toObject() as IProduct),
    _id: product._id.toString(),
    price: Number(product.price),
    inventory: Number(product.inventory ?? 0),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <section className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Product</p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">{product.title}</h1>
          <p className="max-w-2xl text-lg text-slate-300">{product.description}</p>
        </div>
        <Link
          href="/products"
          className="inline-flex w-fit items-center justify-center rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
        >
          Back to products
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <ImageGallery images={product.images} title={product.title} />

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Pricing</p>
                <Price amount={product.price} className="text-3xl font-semibold text-white" />
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  product.inventory > 0
                    ? "bg-emerald-500/10 text-emerald-200"
                    : "bg-red-500/10 text-red-200"
                }`}
              >
                {product.inventory > 0 ? `${product.inventory} in stock` : "Sold out"}
              </span>
            </div>
            <p className="mt-4 leading-relaxed text-slate-200">
              {product.description}
            </p>
            <div className="mt-6 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
              <InfoPill label="Category" value={product.category} />
              <InfoPill label="Secure checkout" value="Stripe payments" />
              <InfoPill label="Shipping" value="Fast digital delivery" />
              <InfoPill label="Support" value="Owzars assistance" />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <AddToCartButton productId={product._id} fullWidth available={product.inventory} />
              <Link
                href="/cart"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10 sm:w-1/3"
              >
                Go to cart
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
            <h3 className="text-xl font-semibold text-white">Why customers love Owzars</h3>
            <ul className="mt-4 space-y-3 text-slate-200">
              <li className="flex gap-2">
                <span className="text-lg">✨</span>
                <div>
                  <p className="font-semibold">Immersive presentation</p>
                  <p className="text-sm text-slate-300">Large imagery and detailed descriptions so you know exactly what you are getting.</p>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-lg">🔒</span>
                <div>
                  <p className="font-semibold">Secure payments</p>
                  <p className="text-sm text-slate-300">Stripe handles checkout so transactions stay smooth and safe.</p>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-lg">⚡</span>
                <div>
                  <p className="font-semibold">Fast delivery</p>
                  <p className="text-sm text-slate-300">Digital purchases are delivered quickly once your order is confirmed.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

interface InfoPillProps {
  label: string;
  value?: string;
}

function InfoPill({ label, value }: InfoPillProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value ?? "—"}</p>
    </div>
  );
}
