import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";
import { stripe } from "@/lib/stripe";
import { Product } from "@/models/Product";
import type { CartItem } from "@/lib/cart";

interface RequestBody {
  items?: CartItem[];
}

export async function POST(request: Request) {
  const body: RequestBody = await request.json();
  const items = body.items?.filter((item) => item.productId && item.quantity > 0) || [];

  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  await connectToDatabase();

  const productIds = items
    .map((item) => item.productId)
    .filter((id) => mongoose.Types.ObjectId.isValid(id));

  const products = await Product.find({ _id: { $in: productIds } }).lean();
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  const missingItem = items.find((item) => !productMap.has(item.productId));
  if (missingItem) {
    return NextResponse.json({ error: "Some products are invalid" }, { status: 400 });
  }

  const lineItems = items.map((item) => {
    const product = productMap.get(item.productId)!;
    const quantity = item.quantity;

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.title,
          images: product.images?.length ? [product.images[0]] : undefined,
        },
        unit_amount: Math.round(Number(product.price) * 100),
      },
      quantity,
    };
  });

  const originUrl = new URL(request.url);
  const origin = `${originUrl.protocol}//${originUrl.host}`;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout/cancel`,
    metadata: {
      cart: JSON.stringify(items),
    },
  });

  return NextResponse.json({ url: session.url, sessionId: session.id });
}
