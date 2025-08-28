import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Layout from "@/models/Layout";

export async function GET() {
  await dbConnect();
  const layouts = await Layout.find({}, "name").lean();
  return NextResponse.json({ layouts: layouts.map((l) => l.name) });
}
