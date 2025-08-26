import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Media } from "@/models/Media";
import path from "path";
import fs from "fs/promises";

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "9", 10);

  const filter: any = {};
  if (type) filter.type = type;
  if (q) filter.originalName = { $regex: q, $options: "i" };

  const total = await Media.countDocuments(filter);
  const items = await Media.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return NextResponse.json({ items, total, page, limit });
}

export async function POST(req: Request) {
  await dbConnect();

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const type = formData.get("type") as "image" | "video" | "audio";

  if (!file || !type) {
    return NextResponse.json(
      { error: "Missing file or type" },
      { status: 400 }
    );
  }

  // Save file to public folder
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const folder =
    type === "audio" ? "audios" : type === "video" ? "videos" : "images";
  const uploadDir = path.join(process.cwd(), "public", folder);

  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, file.name);
  await fs.writeFile(filePath, buffer);

  const url = `/${folder}/${file.name}`;

  // Minimal metadata handling (you can extend with ffprobe/sharp later)
  const metadata: any = {};
  if (type === "image") {
    const sharp = (await import("sharp")).default;
    const img = sharp(buffer);
    const info = await img.metadata();
    metadata.width = info.width;
    metadata.height = info.height;
  }
  if (type === "audio" || type === "video") {
    // placeholder: real-world use ffprobe or similar
    metadata.duration = 0;
    if (type === "video") {
      metadata.width = 0;
      metadata.height = 0;
    }
  }

  const media = await Media.create({
    filename: file.name,
    url,
    type,
    ...metadata,
  });

  return NextResponse.json(media);
}
