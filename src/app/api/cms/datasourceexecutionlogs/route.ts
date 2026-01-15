import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { GetTenantSlug } from "@/utils/getTenantSlug";
import { getTenantConnection } from "@/lib/mongodb";
import { getOrCreateExecutionLogModel } from "@/models/DataSourceExecutionLog";

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const success = searchParams.get("success");
  const dataSourceSlug = searchParams.get("dataSourceSlug");
  const endpointSlug = searchParams.get("endpointSlug");

  const query: any = {};
  if (success !== null) query.success = success === "true";
  if (dataSourceSlug) query.dataSourceSlug = dataSourceSlug;
  if (endpointSlug) query.endpointSlug = endpointSlug;

  const skip = (page - 1) * limit;

  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return NextResponse.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const ExecutionLog = getOrCreateExecutionLogModel(tenantConn);

  const [items, total] = await Promise.all([
    ExecutionLog.find(query).skip(skip).limit(limit).sort({ executedAt: -1 }),
    ExecutionLog.countDocuments(query),
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
