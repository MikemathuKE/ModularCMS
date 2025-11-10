export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { dbConnect } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(req: NextRequest) {
  await dbConnect();
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ user: null });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).lean();
    if (!user) return NextResponse.json({ user: null });
    return NextResponse.json({
      user: { email: user.values.email, role: user.values.role },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
