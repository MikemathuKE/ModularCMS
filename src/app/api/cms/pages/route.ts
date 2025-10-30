import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { getOrCreatePageModel } from "@/models/Page";
import { getTenantConnection } from "@/lib/mongodb";
import { GetTenantSlug } from "@/utils/getTenantSlug";

// GET all pages with optional filters, pagination, sorting, and search
export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);

    // Filtering
    const status = searchParams.get("status"); // "draft" | "published"
    const query: any = {};
    if (status) query.status = status;

    // Search
    const q = searchParams.get("q");
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { slug: { $regex: q, $options: "i" } },
      ];
    }

    // Pagination
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    // Sorting
    const sortParam = searchParams.get("sort") || "createdAt"; // e.g. "name", "-createdAt"
    const sort: Record<string, 1 | -1> = {};
    if (sortParam.startsWith("-")) {
      sort[sortParam.substring(1)] = -1;
    } else {
      sort[sortParam] = 1;
    }

    const tenantSlug = await GetTenantSlug(req.headers.get("host"));
    if (!tenantSlug)
      return Response.json({ error: "Tenant missing" }, { status: 400 });

    const tenantConn = await getTenantConnection(tenantSlug);
    const Page = getOrCreatePageModel(tenantConn);

    // Query
    const [pages, total] = await Promise.all([
      Page.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Page.countDocuments(query),
    ]);

    return NextResponse.json({
      data: pages,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
}

// CREATE new page
export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { name, slug, layout, json, status } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const tenantSlug = await GetTenantSlug(req.headers.get("host"));
    if (!tenantSlug)
      return Response.json({ error: "Tenant missing" }, { status: 400 });

    const tenantConn = await getTenantConnection(tenantSlug);
    const Page = getOrCreatePageModel(tenantConn);

    // Ensure slug uniqueness
    const existing = await Page.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "Page with this slug already exists" },
        { status: 400 }
      );
    }

    const page = new Page({
      name,
      slug,
      layout,
      json: json || { component: "", children: [] },
      status: status || "draft",
    });

    await page.save();
    return NextResponse.json(page, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    );
  }
}
