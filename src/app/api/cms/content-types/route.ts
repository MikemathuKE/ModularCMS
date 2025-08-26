import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { ContentType } from "@/models/ContentType";

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);

  // pagination params
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = searchParams.get("search") || "";

  const query: any = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    ContentType.find(query).skip(skip).limit(limit).sort({ updatedAt: -1 }),
    ContentType.countDocuments(query),
  ]);

  return NextResponse.json({
    items,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
}

// --- CREATE content type ---
export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();

  const exists = await ContentType.findOne({ slug: body.slug });
  if (exists) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
  }

  const created = await ContentType.create(body);
  return NextResponse.json(created);
}
