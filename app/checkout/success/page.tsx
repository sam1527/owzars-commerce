import Link from "next/link";

import Price from "@/components/storefront/Price";
import ClearCartClient from "@/components/storefront/ClearCartClient";
import { connectToDatabase } from "@/lib/mongodb";
import { stripe } from "@/lib/stripe";
import { Order, IOrder } from "@/models/Order";
import { Product } from "@/models/Product";

interface CheckoutSuccessPageProps {
  searchParams: { session_id?: string };
}

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return (
      <section className="space-y-6">
        <h1 className="text-4xl font-semibold text-white">Payment complete</h1>
        <p className="text-slate-300">We could not find your checkout session, but your payment should be processing.</p>
        <Link
          href="/products"
          className="inline-flex w-fit items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
        >
          Continue shopping
        </Link>
      </section>
    );
  }

  const order = await ensureOrder(sessionId);

  const currency = order?.currency?.toUpperCase?.() ?? "USD";

  return (
    <section className="space-y-8">
      <ClearCartClient />
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-300/80">Success</p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">Thank you for your purchase</h1>
        <p className="max-w-2xl text-lg text-slate-300">
          Your payment was processed successfully. A receipt will be sent to your email. You can review the details below.
        </p>
      </div>

      {order ? (
        <div className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Order</p>
              <p className="text-lg font-semibold text-white">{order._id?.toString?.() || "Created"}</p>
              {order.email ? <p className="text-sm text-slate-300">Receipt sent to {order.email}</p> : null}
            </div>
            <div className="text-right">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Total</p>
              <Price amount={order.total} currency={currency} className="text-2xl font-semibold text-white" />
            </div>
          </div>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={`${order._id}-${item.productId}`}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3"
              >
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{item.productId}</p>
                  <p className="text-lg font-semibold text-white">{item.title}</p>
                  <p className="text-sm text-slate-300">Quantity: {item.quantity}</p>
                </div>
                <Price
                  amount={item.price * item.quantity}
                  currency={currency}
                  className="text-base font-semibold text-white"
                />
              </div>
            ))}
          </div>

          <Link
            href="/products"
            className="inline-flex w-fit items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-200">
          We could not confirm your order details yet. Please check your email for the receipt.
        </div>
      )}
    </section>
  );
}

async function ensureOrder(sessionId: string) {
  await connectToDatabase();

  const existing = await Order.findOne({ stripeSessionId: sessionId }).lean();
  if (existing) {
    return existing as IOrder & { _id: string };
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  if (!session || session.payment_status !== "paid") {
    return null;
  }

  const cartMetadata = session.metadata?.cart;
  let cartItems: { productId: string; quantity: number }[] = [];

  if (cartMetadata) {
    try {
      cartItems = JSON.parse(cartMetadata);
    } catch (error) {
      console.error("Failed to parse cart metadata", error);
    }
  }

  const productIds = cartItems.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } }).lean();

  const orderItems = cartItems.map((item) => {
    const product = products.find((prod) => prod._id.toString() === item.productId);
    return {
      productId: item.productId,
      title: product?.title || "Product",
      price: Number(product?.price || 0),
      quantity: item.quantity,
      image: product?.images?.[0] || null,
    };
  });

  const created = await Order.create({
    email: session.customer_details?.email || undefined,
    items: orderItems,
    total: (session.amount_total || 0) / 100,
    currency: session.currency || "usd",
    stripeSessionId: session.id,
    status: session.payment_status,
  });

  return created.toObject() as IOrder & { _id: string };
}
