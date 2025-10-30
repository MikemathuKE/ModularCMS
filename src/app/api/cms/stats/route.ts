import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { getOrCreatePageModel } from "@/models/Page";
import { getOrCreateContentTypeModel } from "@/models/ContentType";
import { getOrCreateMediaModel } from "@/models/Media";

import { GetTenantSlug } from "@/utils/getTenantSlug";
import { getTenantConnection } from "@/lib/mongodb";

export async function GET(req: Request) {
  await dbConnect();

  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const Page = getOrCreatePageModel(tenantConn);
  const ContentType = getOrCreateContentTypeModel(tenantConn);
  const Media = getOrCreateMediaModel(tenantConn);

  const [pagesCount, contentTypesCount, mediaCount] = await Promise.all([
    Page.countDocuments(),
    ContentType.countDocuments(),
    Media.countDocuments(),
  ]);

  const recentPages = await Page.find({}, { title: 1, slug: 1, updatedAt: 1 })
    .sort({ updatedAt: -1 })
    .limit(5)
    .lean();

  const recentMedia = await Media.find({}, { url: 1, type: 1, updatedAt: 1 })
    .sort({ updatedAt: -1 })
    .limit(6)
    .lean();

  return NextResponse.json({
    pages: pagesCount,
    contentTypes: contentTypesCount,
    media: mediaCount,
    recentPages,
    recentMedia,
  });
}
