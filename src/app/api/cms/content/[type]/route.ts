import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { getOrCreateContentTypeModel } from "@/models/ContentType";
import { getContentModel } from "@/utils/getContentModel";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import { getTenantConnection } from "@/lib/mongodb";
import { GetTenantSlug } from "@/utils/getTenantSlug";

// GET all or single ?id=, supports pagination & search
export async function GET(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  await dbConnect();
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const ContentType = getOrCreateContentTypeModel(tenantConn);

  const ct = await ContentType.findOne({ slug: params.type }).lean();
  if (!ct)
    return NextResponse.json(
      { error: "Unknown content type" },
      { status: 404 }
    );

  const Model = getContentModel(ct, tenantConn);
  const { searchParams } = new URL(req.url);

  // check for single item fetch
  const id = searchParams.get("id");
  if (id) {
    const item = await Model.findById(id).lean();
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  }

  // pagination & search
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = searchParams.get("search") || "";

  const query: Record<string, any> = {};
  if (search) {
    // do a generic search across all string fields
    const stringFields = ct.fields
      .filter((f: any) => ["Text", "Textarea", "Email"].includes(f.type))
      .map((f: any) => f.name);

    if (stringFields.length > 0) {
      query["$or"] = stringFields.map((f: string) => ({
        [f]: { $regex: search, $options: "i" },
      }));
    }
  }

  const total = await Model.countDocuments(query);
  const items = await Model.find(query)
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return NextResponse.json({
    items,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}

// POST create
// Disable Next.js default body parser for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper: decide folder based on schema type
function getUploadDir(fieldType: string) {
  switch (fieldType) {
    case "image":
      return path.join(process.cwd(), "public/images");
    case "video":
      return path.join(process.cwd(), "public/videos");
    case "audio":
      return path.join(process.cwd(), "public/audios");
    case "document":
      return path.join(process.cwd(), "public/documents");
    default:
      return path.join(process.cwd(), "public/files");
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  await dbConnect();
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const ContentType = getOrCreateContentTypeModel(tenantConn);

  const ct = await ContentType.findOne({ slug: params.type }).lean();
  if (!ct) {
    return NextResponse.json(
      { error: "Unknown content type" },
      { status: 404 }
    );
  }

  const contentType = req.headers.get("content-type") || "";
  let body: Record<string, any> = {};

  if (contentType.includes("multipart/form-data")) {
    // Prepare formidable uploadDir dynamically
    const uploadBase = path.join(process.cwd(), "public/files");
    await fs.mkdir(uploadBase, { recursive: true });

    const form = formidable({
      multiples: false,
      keepExtensions: true,
      uploadDir: uploadBase, // temporary dir, we’ll move after
    });

    const [fields, files] = await new Promise<[Record<string, any>, any]>(
      (resolve, reject) => {
        form.parse(req as any, (err, fields, files) => {
          if (err) reject(err);
          else resolve([fields, files]);
        });
      }
    );

    // merge text fields
    body = { ...fields };

    // Map field definitions from contentType
    const fieldDefs = ct.fields || [];

    for (const [fieldName, file] of Object.entries(files)) {
      const f = Array.isArray(file) ? file[0] : file;
      if (!f || !f.filepath) continue;

      // find schema definition for this field
      const def = fieldDefs.find((d: any) => d.name === fieldName);
      const fieldType = def?.type || "file";

      // decide upload dir
      const targetDir = getUploadDir(fieldType);
      await fs.mkdir(targetDir, { recursive: true });

      // move file to correct location
      const targetPath = path.join(
        targetDir,
        f.originalFilename || path.basename(f.filepath)
      );
      await fs.rename(f.filepath, targetPath);

      // store relative path for DB
      switch (fieldType) {
        case "image":
          body[fieldName] = "/images/" + path.basename(targetPath);
          break;
        case "video":
          body[fieldName] = "/videos/" + path.basename(targetPath);
          break;
        case "audio":
          body[fieldName] = "/audios/" + path.basename(targetPath);
          break;
        case "document":
          body[fieldName] = "/documents/" + path.basename(targetPath);
          break;
        default:
          body[fieldName] = "/files/" + path.basename(targetPath);
      }
    }
  } else {
    body = await req.json();
  }

  const Model = getContentModel(ct, tenantConn);
  const doc = await Model.create(body);

  return NextResponse.json(doc, { status: 201 });
}

// PUT update by id
export async function PUT(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  await dbConnect();
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const ContentType = getOrCreateContentTypeModel(tenantConn);

  const ct = await ContentType.findOne({ slug: params.type }).lean();
  if (!ct)
    return NextResponse.json(
      { error: "Unknown content type" },
      { status: 404 }
    );

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const body = await req.json();
  const Model = getContentModel(ct, tenantConn);
  const updated = await Model.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(updated);
}

// DELETE by id
export async function DELETE(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  await dbConnect();
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const ContentType = getOrCreateContentTypeModel(tenantConn);

  const ct = await ContentType.findOne({ slug: params.type }).lean();
  if (!ct)
    return NextResponse.json(
      { error: "Unknown content type" },
      { status: 404 }
    );

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const Model = getContentModel(ct, tenantConn);
  const deleted = await Model.findByIdAndDelete(id).lean();
  if (!deleted)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
