import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import path from "path";
import fs from "fs/promises";

import { GetTenantSlug } from "@/utils/getTenantSlug";
import { getTenantConnection } from "@/lib/mongodb";
import { getOrCreateMediaModel } from "@/models/Media";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await dbConnect();
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const Media = getOrCreateMediaModel(tenantConn);

  const media = await Media.findById(id);
  if (!media) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // delete file from public folder
  const filePath = path.join(process.cwd(), "public", media.url);
  await fs.unlink(filePath).catch(() => {});

  await media.deleteOne();

  return NextResponse.json({ success: true });
}
