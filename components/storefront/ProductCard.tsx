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
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 shadow-lg transition hover:-translate-y-1 hover:border-white/20 hover:shadow-xl">
      <div className="aspect-[4/3] overflow-hidden rounded-t-2xl bg-gradient-to-br from-slate-800 to-slate-900">
        {coverImage ? (
          <img
            src={coverImage}
            alt={product.title}
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-300">No image</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white line-clamp-2">{product.title}</h3>
          <Price amount={product.price} className="text-base font-medium text-slate-200" />
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <Link
            href={`/products/${product._id}`}
            className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
          >
            View product
          </Link>
          <AddToCartButton productId={product._id} fullWidth />
        </div>
      </div>
    </article>
  );
}
