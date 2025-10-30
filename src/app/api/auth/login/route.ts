import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { getTenantConnection } from "@/lib/mongodb";
import { UserSchema } from "@/models/User";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { GetTenantSlug } from "@/utils/getTenantSlug";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function POST(req: Request) {
  await dbConnect();

  const { email, password } = await req.json();

  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const User = tenantConn.model("User", UserSchema);

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // ✅ Generate JWT using jose
  const token = await new SignJWT({ id: user._id, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);

  const res = NextResponse.json({ message: "Login successful" });
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
