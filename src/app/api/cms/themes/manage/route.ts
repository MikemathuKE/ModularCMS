import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { getOrCreateThemeModel } from "@/models/Theme";
import { GetTenantSlug } from "@/utils/getTenantSlug";
import { getTenantConnection } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const Theme = getOrCreateThemeModel(tenantConn);

  await dbConnect();
  if (!id || id === "null" || id === undefined)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const doc = await Theme.findById(id).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const body = await req.json();
  const { name, slug, json, active } = body;

  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const Theme = getOrCreateThemeModel(tenantConn);

  // If setting this theme active, clear all others first
  if (active === true) {
    await Theme.updateMany({}, { $set: { active: false } });
  }

  const updated = await Theme.findByIdAndUpdate(
    id,
    {
      ...(name && { name }),
      ...(slug && { slug }),
      ...(json && { json }),
      ...(active !== undefined && { active }),
    },
    { new: true }
  ).lean();

  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const Theme = getOrCreateThemeModel(tenantConn);

  await dbConnect();
  const theme = await Theme.findById(id);
  if (!theme) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (theme.slug === "default") {
    return NextResponse.json(
      { error: "Cannot delete default theme" },
      { status: 400 }
    );
  }

  await theme.deleteOne();
  return NextResponse.json({ success: true });
}
