import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { GetTenantSlug } from "@/utils/getTenantSlug";
import { getTenantConnection } from "@/lib/mongodb";
import { getOrCreateDataSourceEndpointsModel } from "@/models/DataSourceEndpoint";
import { getOrCreateDataSourceModel } from "@/models/DataSource";

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = searchParams.get("search") || "";
  const dataSourceId = searchParams.get("dataSourceId");

  const query: any = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
      { path: { $regex: search, $options: "i" } },
    ];
  }

  if (dataSourceId) {
    query.dataSource = dataSourceId;
  }

  const skip = (page - 1) * limit;

  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return NextResponse.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const DataSource = getOrCreateDataSourceModel(tenantConn);
  const Endpoint = getOrCreateDataSourceEndpointsModel(tenantConn);

  const [items, total] = await Promise.all([
    Endpoint.find(query)
      .populate({ path: "dataSource", model: DataSource })
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 }),
    Endpoint.countDocuments(query),
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

// --- CREATE DataSourceEndpoint ---
export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();

  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return NextResponse.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const Endpoint = getOrCreateDataSourceEndpointsModel(tenantConn);

  const exists = await Endpoint.findOne({ slug: body.slug });
  if (exists) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
  }

  const created = await Endpoint.create(body);
  return NextResponse.json(created);
}
