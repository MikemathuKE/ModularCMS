import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function POST(req: Request) {
  await dbConnect();
  const { email, password } = await req.json();

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });

  // ✅ Optionally auto-login the user after registration:
  // const token = await new SignJWT({ id: user._id, email: user.email })
  //   .setProtectedHeader({ alg: "HS256" })
  //   .setIssuedAt()
  //   .setExpirationTime("7d")
  //   .sign(secretKey);

  const res = NextResponse.json({ message: "Registered successfully" });
  // res.cookies.set("token", token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   path: "/",
  //   maxAge: 60 * 60 * 24 * 7,
  // });

  return res;
}
