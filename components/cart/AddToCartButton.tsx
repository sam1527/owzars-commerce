"use client";

import { useState } from "react";

import { addToCart } from "@/lib/cart";

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  fullWidth?: boolean;
  available?: number;
}

export default function AddToCartButton({ productId, quantity = 1, fullWidth, available }: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false);

  const isOutOfStock = typeof available === "number" && available <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(productId, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={isOutOfStock}
      className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-white to-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:from-slate-50 hover:to-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
        fullWidth ? "w-full" : ""
      } ${isOutOfStock ? "cursor-not-allowed opacity-60" : ""}`}
    >
      {isOutOfStock ? "Sold out" : isAdded ? "Added!" : "Add to Cart"}
    </button>
  );
}
