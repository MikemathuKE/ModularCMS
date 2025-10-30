import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { GetTenantSlug } from "@/utils/getTenantSlug";
import { getTenantConnection } from "@/lib/mongodb";
import { getOrCreateLayoutModel } from "@/models/Layout";

export async function GET(
  req: Request,
  { params }: { params: { name: string } }
) {
  await dbConnect();
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const Layout = getOrCreateLayoutModel(tenantConn);
  console.log(params.name);

  const layout = await Layout.findOne({ name: await params.name }).lean();
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

  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const Layout = getOrCreateLayoutModel(tenantConn);

  const existing = await Layout.findOne({ name: params.name });
  if (existing) {
    const updated = await Layout.findOneAndUpdate(
      { name: params.name },
      {
        ...body,
      }
    );
    return NextResponse.json(updated);
  }

  await Layout.create({ name: params.name, config: body });
  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: { name: string } }
) {
  await dbConnect();
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const Layout = getOrCreateLayoutModel(tenantConn);

  const result = await Layout.deleteOne({ name: params.name });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Layout not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
