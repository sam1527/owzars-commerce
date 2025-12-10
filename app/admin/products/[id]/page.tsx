import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import ProductForm from "../_components/ProductForm";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";

const ADMIN_EMAIL = "owzarsllc@gmail.com";

function Unauthorized() {
  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-200">
      <h1 className="text-2xl font-semibold text-white">Access denied</h1>
      <p className="text-slate-300">You must be signed in as {ADMIN_EMAIL} to manage products.</p>
      <Link href="/auth/signin" className="underline">
        Go to sign in
      </Link>
    </div>
  );
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== ADMIN_EMAIL) {
    return <Unauthorized />;
  }

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    notFound();
  }

  await connectToDatabase();
  const product = await Product.findById(params.id).lean();

  if (!product) {
    notFound();
  }

  const plainProduct = {
    _id: product._id.toString(),
    title: product.title,
    description: product.description,
    price: product.price,
    images: product.images || [],
    category: product.category,
  };

  return (
    <section className="space-y-6">
      <ProductForm mode="edit" product={plainProduct} />
    </section>
  );
}
