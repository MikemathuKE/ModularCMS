import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Theme } from "@/models/Theme";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await dbConnect();
  if (!id || id === "null" || id === undefined) {
    await dbConnect();
    const filter = { active: true };

    const items = await Theme.find(filter).lean();

    return NextResponse.json(items.length > 0 ? items[0] : null);
  }
  const doc = await Theme.findById(id).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { name, slug, json } = await req.json();

  if (!name || !slug || !json) {
    return NextResponse.json(
      { error: "name, slug and json are required" },
      { status: 400 }
    );
  }

  const exists = await Theme.findOne({ slug }).lean();
  if (exists) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const created = await Theme.create({ name, slug, json });
  return NextResponse.json(created, { status: 201 });
}
