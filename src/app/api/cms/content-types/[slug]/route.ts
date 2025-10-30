import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { GetTenantSlug } from "@/utils/getTenantSlug";
import { getTenantConnection } from "@/lib/mongodb";
import { getOrCreateContentTypeModel } from "@/models/ContentType";

// --- GET a single content type by slug ---
export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  await dbConnect();
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const ContentType = getOrCreateContentTypeModel(tenantConn);

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
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const ContentType = getOrCreateContentTypeModel(tenantConn);

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
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const ContentType = getOrCreateContentTypeModel(tenantConn);

  const deleted = await ContentType.findOneAndDelete({ slug: params.slug });
  if (!deleted) {
    return NextResponse.json(
      { error: "Content type not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true });
}
