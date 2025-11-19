export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  await dbConnect();
  const email = req.cookies.get("email")?.value;
  const role = req.cookies.get("role")?.value;
  if (!email) return NextResponse.json({ user: null });
  if (!role) return NextResponse.json({ user: null });

  try {
    return NextResponse.json({
      user: { email: email, role: role },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
