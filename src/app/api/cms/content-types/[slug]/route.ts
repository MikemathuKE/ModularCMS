import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { ContentType } from "@/models/ContentType"; // Assuming you have this model

// --- GET a single content type by slug ---
export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  await dbConnect();
  const type = await ContentType.findOne({ slug: params.slug });
  if (!type) {
    return NextResponse.json(
      { error: "Content type not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(type);
}

// --- UPDATE a content type by slug ---
export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  await dbConnect();
  const body = await req.json();

  // Ensure createdAt & updatedAt are always present
  const updated = await ContentType.findOneAndUpdate(
    { slug: params.slug },
    {
      ...body,
      updatedAt: new Date(),
    },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json(
      { error: "Content type not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}

// --- DELETE a content type by slug ---
export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  await dbConnect();
  const deleted = await ContentType.findOneAndDelete({ slug: params.slug });
  if (!deleted) {
    return NextResponse.json(
      { error: "Content type not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true });
}
