import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Layout from "@/models/Layout";

export async function GET(
  req: Request,
  { params }: { params: { name: string } }
) {
  await dbConnect();
  const layout = await Layout.findOne({ name: params.name }).lean();
  if (!layout) {
    return NextResponse.json({ error: "Layout not found" }, { status: 404 });
  }
  return NextResponse.json(layout.config);
}

export async function POST(
  req: Request,
  { params }: { params: { name: string } }
) {
  await dbConnect();
  const body = await req.json();

  if (params.name === "default") {
    return NextResponse.json(
      { error: "Default layout cannot be edited" },
      { status: 400 }
    );
  }

  const existing = await Layout.findOne({ name: params.name });
  if (existing) {
    return NextResponse.json(
      { error: "Layout with this name already exists" },
      { status: 400 }
    );
  }

  await Layout.create({ name: params.name, config: body });
  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: { name: string } }
) {
  await dbConnect();
  const result = await Layout.deleteOne({ name: params.name });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Layout not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
