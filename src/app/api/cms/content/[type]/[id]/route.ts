import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { ContentType } from "@/models/ContentType";
import { getContentModel } from "@/utils/getContentModel";

export async function GET(
  _: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  await dbConnect();
  const ct = await ContentType.findOne({ slug: params.type }).lean();
  if (!ct)
    return NextResponse.json(
      { error: "Unknown content type" },
      { status: 404 }
    );
  const Model = getContentModel(ct);
  const doc = await Model.findById(params.id).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  await dbConnect();
  const ct = await ContentType.findOne({ slug: params.type }).lean();
  if (!ct)
    return NextResponse.json(
      { error: "Unknown content type" },
      { status: 404 }
    );
  const Model = getContentModel(ct);
  const body = await req.json();
  const doc = await Model.findByIdAndUpdate(params.id, body, {
    new: true,
  }).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  await dbConnect();
  const ct = await ContentType.findOne({ slug: params.type }).lean();
  if (!ct)
    return NextResponse.json(
      { error: "Unknown content type" },
      { status: 404 }
    );
  const Model = getContentModel(ct);
  await Model.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
