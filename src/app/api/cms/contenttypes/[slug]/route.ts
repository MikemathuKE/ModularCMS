import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { GetTenantSlug } from "@/utils/getTenantSlug";
import { getTenantConnection } from "@/lib/mongodb";
import { getOrCreateContentTypeModel } from "@/models/ContentType";

// --- GET a single content type by slug ---
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  await dbConnect();
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return NextResponse.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const ContentType = getOrCreateContentTypeModel(tenantConn);

  const type = await ContentType.findOne({ slug });
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
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  await dbConnect();
  const body = await req.json();
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return NextResponse.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const ContentType = getOrCreateContentTypeModel(tenantConn);

  const updated = await ContentType.findOneAndUpdate(
    { slug },
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
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  await dbConnect();
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return NextResponse.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const ContentType = getOrCreateContentTypeModel(tenantConn);

  const deleted = await ContentType.findOneAndDelete({ slug });
  if (!deleted) {
    return NextResponse.json(
      { error: "Content type not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
