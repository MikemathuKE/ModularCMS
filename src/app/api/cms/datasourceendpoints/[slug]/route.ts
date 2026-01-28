import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { getOrCreateDataSourceEndpointsModel } from "@/models/DataSourceEndpoint";
import { getTenantConnection } from "@/lib/mongodb";
import { GetTenantSlug } from "@/utils/getTenantSlug";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  await dbConnect();
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const DataSourceEndpoint = getOrCreateDataSourceEndpointsModel(tenantConn);

  const doc = await DataSourceEndpoint.findOne({ slug })
    .populate("dataSource")
    .populate("bodyTemplate");
  if (!doc)
    return NextResponse.json(
      { error: "Unknown Data Source Endpoint!" },
      { status: 404 },
    );
  return NextResponse.json(doc);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  await dbConnect();
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const DataSourceEndpoint = getOrCreateDataSourceEndpointsModel(tenantConn);

  const body = await req.json();
  const updated = await DataSourceEndpoint.findOneAndUpdate(
    { slug },
    {
      ...body,
      updatedAt: new Date(),
    },
    { new: true },
  );

  if (!updated) {
    return NextResponse.json(
      { error: "Content type not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  await dbConnect();
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const DataSourceEndpoint = getOrCreateDataSourceEndpointsModel(tenantConn);

  await DataSourceEndpoint.findOneAndDelete({ slug });
  return NextResponse.json({ ok: true });
}
