"use client";

import { useState } from "react";

import { addToCart } from "@/lib/cart";

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  fullWidth?: boolean;
}

export default function AddToCartButton({ productId, quantity = 1, fullWidth }: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    addToCart(productId, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <button
      onClick={handleAdd}
      className={`inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 ${fullWidth ? "w-full" : ""}`}
    >
      {isAdded ? "Added!" : "Add to Cart"}
    </button>
  );
}
