import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { ContentType } from "@/models/ContentType";
import { getContentModel } from "@/utils/getContentModel";

// GET all or single ?id=, supports pagination & search
export async function GET(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  await dbConnect();
  const ct = await ContentType.findOne({ slug: params.type }).lean();
  if (!ct)
    return NextResponse.json(
      { error: "Unknown content type" },
      { status: 404 }
    );

  const Model = getContentModel(ct);
  const { searchParams } = new URL(req.url);

  // check for single item fetch
  const id = searchParams.get("id");
  if (id) {
    const item = await Model.findById(id).lean();
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  }

  // pagination & search
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = searchParams.get("search") || "";

  const query: Record<string, any> = {};
  if (search) {
    // do a generic search across all string fields
    const stringFields = ct.fields
      .filter((f: any) => ["Text", "Textarea", "Email"].includes(f.type))
      .map((f: any) => f.name);

    if (stringFields.length > 0) {
      query["$or"] = stringFields.map((f: string) => ({
        [f]: { $regex: search, $options: "i" },
      }));
    }
  }

  const total = await Model.countDocuments(query);
  const items = await Model.find(query)
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return NextResponse.json({
    items,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}

// POST create
export async function POST(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  await dbConnect();
  const ct = await ContentType.findOne({ slug: params.type }).lean();
  if (!ct)
    return NextResponse.json(
      { error: "Unknown content type" },
      { status: 404 }
    );

  const body = await req.json();
  const Model = getContentModel(ct);
  const doc = await Model.create(body); // trust JSON fields align with ct.fields
  return NextResponse.json(doc, { status: 201 });
}

// PUT update by id
export async function PUT(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  await dbConnect();
  const ct = await ContentType.findOne({ slug: params.type }).lean();
  if (!ct)
    return NextResponse.json(
      { error: "Unknown content type" },
      { status: 404 }
    );

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const body = await req.json();
  const Model = getContentModel(ct);
  const updated = await Model.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(updated);
}

// DELETE by id
export async function DELETE(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  await dbConnect();
  const ct = await ContentType.findOne({ slug: params.type }).lean();
  if (!ct)
    return NextResponse.json(
      { error: "Unknown content type" },
      { status: 404 }
    );

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const Model = getContentModel(ct);
  const deleted = await Model.findByIdAndDelete(id).lean();
  if (!deleted)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
