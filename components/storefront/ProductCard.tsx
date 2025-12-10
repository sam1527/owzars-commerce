/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import Price from "./Price";
import { IProduct } from "@/models/Product";
import AddToCartButton from "@/components/cart/AddToCartButton";

export type StorefrontProduct = IProduct & { _id: string };

interface ProductCardProps {
  product: StorefrontProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const coverImage = product.images?.[0];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 shadow-lg transition hover:-translate-y-1 hover:border-white/30 hover:shadow-2xl">
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950/60" />
        {coverImage ? (
          <img
            src={coverImage}
            alt={product.title}
            className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-800 text-sm text-slate-300">No image</div>
        )}
        {product.category ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-900">
            {product.category}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white line-clamp-2">{product.title}</h3>
          <p className="text-sm text-slate-300 line-clamp-2">{product.description}</p>
          <Price amount={product.price} className="text-base font-semibold text-white" />
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <Link
            href={`/products/${product._id}`}
            className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
          >
            View product
          </Link>
          <AddToCartButton productId={product._id} fullWidth />
        </div>
      </div>
    </article>
  );
}
