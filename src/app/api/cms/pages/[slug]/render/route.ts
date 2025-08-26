import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Page } from "@/models/Page";
import { resolvePageJSON } from "@/utils/resolvePageJSON";

export async function GET(
  _: NextRequest,
  { params }: { params: { slug: string } }
) {
  await dbConnect();
  const page = await Page.findOne({
    slug: params.slug,
    status: "published",
  }).lean();
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const resolved = await resolvePageJSON(page.json);
  return NextResponse.json(resolved);
}
