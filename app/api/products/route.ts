import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ADMIN_EMAIL } from "@/lib/constants";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { sampleProducts } from "@/lib/sampleData";

export async function GET() {
  await connectToDatabase();

  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(sampleProducts);
  }

  const products = await Product.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { title, description, price, images = [], category, inventory } = body;

  if (
    !title ||
    !description ||
    typeof price !== "number" ||
    Number.isNaN(price) ||
    !category ||
    typeof inventory !== "number" ||
    inventory < 0
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await connectToDatabase();

  const product = await Product.create({
    title,
    description,
    price,
    images,
    category,
    inventory,
  });

  return NextResponse.json({ product }, { status: 201 });
}
