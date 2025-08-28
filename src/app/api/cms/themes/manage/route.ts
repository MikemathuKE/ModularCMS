import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Theme } from "@/models/Theme";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  await dbConnect();
  if (!id || id === "null" || id === undefined)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const doc = await Theme.findById(id).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const body = await req.json();
  const { name, slug, json, active } = body;

  // If setting this theme active, clear all others first
  if (active === true) {
    await Theme.updateMany({}, { $set: { active: false } });
  }

  const updated = await Theme.findByIdAndUpdate(
    id,
    {
      ...(name && { name }),
      ...(slug && { slug }),
      ...(json && { json }),
      ...(active !== undefined && { active }),
    },
    { new: true }
  ).lean();

  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  await dbConnect();
  const theme = await Theme.findById(id);
  if (!theme) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (theme.slug === "default") {
    return NextResponse.json(
      { error: "Cannot delete default theme" },
      { status: 400 }
    );
  }

  await theme.deleteOne();
  return NextResponse.json({ success: true });
}
