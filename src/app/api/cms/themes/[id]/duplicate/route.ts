import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Theme } from "@/models/Theme";

export async function POST(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

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
