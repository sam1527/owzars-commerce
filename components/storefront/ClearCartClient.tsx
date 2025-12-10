"use client";

import { useEffect } from "react";

import { clearCart } from "@/lib/cart";

export default function ClearCartClient() {
  useEffect(() => {
    clearCart();
  }, []);

  return null;
}
