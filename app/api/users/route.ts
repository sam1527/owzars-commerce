import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, name } = body ?? {};

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  await connectToDatabase();
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email: email.toLowerCase(), password: hashedPassword, name });

  return NextResponse.json(
    { user: { id: user._id.toString(), email: user.email, name: user.name } },
    { status: 201 }
  );
}
