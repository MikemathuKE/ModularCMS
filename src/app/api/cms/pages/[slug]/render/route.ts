import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { resolvePageJSON } from "@/utils/resolvePageJSON";
import { getOrCreatePageModel } from "@/models/Page";
import { getTenantConnection } from "@/lib/mongodb";
import { GetTenantSlug } from "@/utils/getTenantSlug";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  await dbConnect();
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const Page = getOrCreatePageModel(tenantConn);

  const page = await Page.findOne({
    slug: params.slug,
    status: "published",
  }).lean();
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const resolved = await resolvePageJSON(page.json);
  return NextResponse.json(resolved);
}
