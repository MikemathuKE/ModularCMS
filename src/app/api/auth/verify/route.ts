export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ token: false });
    jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ token: true });
  } catch {
    return NextResponse.json({ token: false });
  }
}
