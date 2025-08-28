import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Page } from "@/models/Page";
import { ContentType } from "@/models/ContentType";
import { Media } from "@/models/Media";

export async function GET() {
  await dbConnect();

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
