import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { getOrCreateContentTypeModel } from "@/models/ContentType";
import { getContentModel } from "@/utils/getContentModel";
import { getTenantConnection } from "@/lib/mongodb";
import { GetTenantSlug } from "@/utils/getTenantSlug";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params;

  await dbConnect();
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const ContentType = getOrCreateContentTypeModel(tenantConn);

  const ct = await ContentType.findOne({ slug: type }).lean();
  if (!ct)
    return NextResponse.json(
      { error: "Unknown content type" },
      { status: 404 }
    );
  const Model = getContentModel(ct);
  const doc = await Model.findById(id).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params;

  await dbConnect();
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const ContentType = getOrCreateContentTypeModel(tenantConn);

  const ct = await ContentType.findOne({ slug: type }).lean();
  if (!ct)
    return NextResponse.json(
      { error: "Unknown content type" },
      { status: 404 }
    );
  const Model = getContentModel(ct);
  const body = await req.json();
  const doc = await Model.findByIdAndUpdate(id, body, {
    new: true,
  }).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params;

  await dbConnect();
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const ContentType = getOrCreateContentTypeModel(tenantConn);

  const ct = await ContentType.findOne({ slug: type }).lean();
  if (!ct)
    return NextResponse.json(
      { error: "Unknown content type" },
      { status: 404 }
    );
  const Model = getContentModel(ct);
  await Model.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
