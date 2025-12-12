import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email.toLowerCase() }).lean();

  return NextResponse.json({
    user: user
      ? { id: user._id.toString(), email: user.email, name: user.name }
      : { id: session.user.id, email: session.user.email, name: session.user.name },
  });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, password } = body ?? {};

  if (!name && !password) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  await connectToDatabase();

  const updatePayload: { name?: string; password?: string } = {};
  if (name) {
    updatePayload.name = name;
  }
  if (password) {
    updatePayload.password = await bcrypt.hash(password, 10);
  }

  const user = await User.findOneAndUpdate(
    { email: session.user.email.toLowerCase() },
    updatePayload,
    { new: true, upsert: true }
  );

  return NextResponse.json({ user: { id: user._id.toString(), email: user.email, name: user.name } });
}
