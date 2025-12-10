"use client";

/* eslint-disable @next/next/no-img-element */
import Price from "../storefront/Price";
import { updateQuantity, removeFromCart } from "@/lib/cart";

interface CartItemProps {
  productId: string;
  title: string;
  price: number;
  image?: string;
  quantity: number;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItem({
  productId,
  title,
  price,
  image,
  quantity,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const handleQuantityChange = (value: number) => {
    const nextValue = Number.isNaN(value) || value < 1 ? 1 : value;
    updateQuantity(productId, nextValue);
    onQuantityChange(productId, nextValue);
  };

  const handleRemove = () => {
    removeFromCart(productId);
    onRemove(productId);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="flex items-center gap-4 sm:w-1/2">
        <div className="h-20 w-24 overflow-hidden rounded-xl bg-slate-800">
          {image ? (
            <img src={image} alt={title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">No image</div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Product</p>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <Price amount={price} className="text-sm text-slate-200" />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-between gap-4 sm:justify-end sm:gap-8">
        <label className="flex items-center gap-2 text-sm text-slate-200">
          Qty
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => handleQuantityChange(Number(event.target.value))}
            className="w-16 rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-right text-white focus:border-white/30 focus:outline-none"
          />
        </label>
        <div className="text-right">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Total</p>
          <Price amount={price * quantity} className="text-lg font-semibold text-white" />
        </div>
        <button
          onClick={handleRemove}
          className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:border-red-300/40 hover:bg-red-500/10 hover:text-red-100"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
