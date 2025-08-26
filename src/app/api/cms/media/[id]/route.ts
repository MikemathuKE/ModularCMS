import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Media } from "@/models/Media";
import path from "path";
import fs from "fs/promises";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const media = await Media.findById(params.id);
  if (!media) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // delete file from public folder
  const filePath = path.join(process.cwd(), "public", media.url);
  await fs.unlink(filePath).catch(() => {});

  await media.deleteOne();

  return NextResponse.json({ success: true });
}
