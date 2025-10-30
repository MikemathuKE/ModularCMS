import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { getOrCreateThemeModel } from "@/models/Theme";
import { GetTenantSlug } from "@/utils/getTenantSlug";
import { getTenantConnection } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const pageSize = Math.max(
    parseInt(searchParams.get("pageSize") || "10", 10),
    1
  );

  const filter = q
    ? {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { slug: { $regex: q, $options: "i" } },
        ],
      }
    : {};

  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const Theme = getOrCreateThemeModel(tenantConn);

  const total = await Theme.countDocuments(filter);
  const items = await Theme.find(filter)
    .sort({ updatedAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();

  return NextResponse.json({
    items,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { name, slug, json } = await req.json();

  if (!name || !slug || !json) {
    return NextResponse.json(
      { error: "name, slug and json are required" },
      { status: 400 }
    );
  }

  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const Theme = getOrCreateThemeModel(tenantConn);

  const exists = await Theme.findOne({ slug }).lean();
  if (exists) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const created = await Theme.create({ name, slug, json });
  return NextResponse.json(created, { status: 201 });
}
