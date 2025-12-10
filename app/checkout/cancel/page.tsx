import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <section className="space-y-6">
      <p className="text-sm uppercase tracking-[0.35em] text-amber-300/80">Checkout cancelled</p>
      <h1 className="text-4xl font-semibold text-white sm:text-5xl">Payment not completed</h1>
      <p className="max-w-2xl text-lg text-slate-300">
        Your Stripe checkout session was cancelled. You can return to your cart to review items or continue shopping.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/cart"
          className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
        >
          Return to cart
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
        >
          Keep shopping
        </Link>
      </div>
    </section>
  );
}
