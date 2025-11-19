// src/app/api/tenants/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Tenant } from "@/models/Tenant";

export async function GET() {
  await dbConnect();
  const tenants = await Tenant.find({}).sort({ createdAt: -1 });
  return NextResponse.json({ tenants });
}
