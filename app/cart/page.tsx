"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import CartItem from "@/components/cart/CartItem";
import Price from "@/components/storefront/Price";
import { CartItem as StoredCartItem, getCart } from "@/lib/cart";

interface ProductResponse {
  product?: {
    _id: string;
    title: string;
    price: number;
    images: string[];
  };
  error?: string;
}

type CartDisplayItem = {
  productId: string;
  title: string;
  price: number;
  image?: string;
  quantity: number;
};

const TAX_RATE = 0.07;

export default function CartPage() {
  const [items, setItems] = useState<CartDisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      const cartItems = getCart();
      if (cartItems.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      try {
        const fetched = await fetchProducts(cartItems);
        setItems(fetched);
      } catch (err) {
        console.error(err);
        setError("Failed to load cart items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );
  const tax = useMemo(() => subtotal * TAX_RATE, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  const handleQuantityChange = (productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemove = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setCheckoutLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to start checkout");
      }

      const data = await response.json();
      if (data?.url) {
        window.location.href = data.url as string;
      }
    } catch (err) {
      console.error(err);
      setError("Could not redirect to checkout. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <section className="space-y-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Cart</p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">Your shopping bag</h1>
          <p className="max-w-2xl text-lg text-slate-300">
            Review your items, adjust quantities, and proceed to secure checkout powered by Stripe.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex w-fit items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
        >
          Continue shopping
        </Link>
      </header>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-slate-300">
          Loading your cart...
        </div>
      ) : items.length === 0 ? (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-slate-300">
          <p>Your cart is empty. Add products to begin checkout.</p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.productId}
                productId={item.productId}
                title={item.title}
                price={item.price}
                image={item.image}
                quantity={item.quantity}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ))}
          </div>

          <aside className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold text-white">Order summary</h2>
            <div className="space-y-3 text-sm text-slate-200">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <Price amount={subtotal} className="text-sm text-slate-100" />
              </div>
              <div className="flex items-center justify-between">
                <span>Tax (7%)</span>
                <Price amount={tax} className="text-sm text-slate-100" />
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold text-white">
                <span>Total</span>
                <Price amount={total} className="text-lg text-white" />
              </div>
            </div>
            {error ? <p className="text-sm text-red-200">{error}</p> : null}
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {checkoutLoading ? "Redirecting..." : "Proceed to checkout"}
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}

async function fetchProducts(cartItems: StoredCartItem[]): Promise<CartDisplayItem[]> {
  const productPromises = cartItems.map(async (item) => {
    const response = await fetch(`/api/products/${item.productId}`);
    const data: ProductResponse = await response.json();

    if (!response.ok || !data.product) {
      throw new Error(data.error || "Failed to load product");
    }

    return {
      productId: data.product._id,
      title: data.product.title,
      price: Number(data.product.price),
      image: data.product.images?.[0],
      quantity: item.quantity,
    } satisfies CartDisplayItem;
  });

  return Promise.all(productPromises);
}
