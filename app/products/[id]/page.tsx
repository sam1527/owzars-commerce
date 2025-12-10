import { notFound } from "next/navigation";
import Link from "next/link";

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
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Product</p>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">{product.title}</h1>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
        >
          Back to products
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <ImageGallery images={product.images} title={product.title} />

        <div className="space-y-6">
          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-white">{product.title}</h2>
              <Price amount={product.price} className="text-xl font-medium text-slate-200" />
            </div>
            <p className="leading-relaxed text-slate-300">{product.description}</p>
            <button className="w-full rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200">
              Add to Cart
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Category</p>
            <p className="mt-2 text-lg font-semibold text-white">{product.category}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
