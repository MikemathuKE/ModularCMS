import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { getOrCreateThemeModel } from "@/models/Theme";
import { GetTenantSlug } from "@/utils/getTenantSlug";
import { getTenantConnection } from "@/lib/mongodb";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const Theme = getOrCreateThemeModel(tenantConn);

  const theme = await Theme.findById(params.id).lean();
  if (!theme) {
    return NextResponse.json({ error: "Theme not found" }, { status: 404 });
  }

  // Generate new slug by appending a unique suffix
  const baseSlug = theme.slug.replace(/-copy-\d+$/, "");
  const newSlug = `${baseSlug}-copy-${Date.now()}`;

  const newTheme = new Theme({
    name: `${theme.name} Copy`,
    slug: newSlug,
    json: theme.json,
    active: false,
  });

  await newTheme.save();

  return NextResponse.json(newTheme, { status: 201 });
}
