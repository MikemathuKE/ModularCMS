import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { GetTenantSlug } from "@/utils/getTenantSlug";
import { getTenantConnection } from "@/lib/mongodb";
import { getOrCreateLayoutModel } from "@/models/Layout";
import { LayoutDocument } from "@/models/Layout";

export async function GET(req: NextRequest) {
  await dbConnect();
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const Layout = getOrCreateLayoutModel(tenantConn);

  const layouts: LayoutDocument[] = await Layout.find({}, "name").lean();
  return NextResponse.json({ layouts: layouts.map((l) => l.name) });
}
