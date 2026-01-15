import { NextResponse } from "next/server";
import { dbConnect, getTenantConnection } from "@/lib/mongodb";
import { GetTenantSlug } from "@/utils/getTenantSlug";
import { getOrCreateDataSourceModel } from "@/models/DataSource";

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
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

  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return NextResponse.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const DataSourceModel = getOrCreateDataSourceModel(tenantConn);

  console.log(tenantSlug);
  console.log(skip);
  console.log(limit);

  const [items, total] = await Promise.all([
    DataSourceModel.find(query).skip(skip).limit(limit).sort({ updatedAt: -1 }),
    DataSourceModel.countDocuments(query),
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

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();

  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return NextResponse.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const DataSourceModel = getOrCreateDataSourceModel(tenantConn);

  const exists = await DataSourceModel.findOne({ slug: body.slug });
  if (exists) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
  }

  const created = await DataSourceModel.create(body);
  return NextResponse.json(created);
}
