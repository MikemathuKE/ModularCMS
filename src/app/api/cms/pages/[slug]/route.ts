import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Page } from "@/models/Page";

// GET a single page by slug
export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  await dbConnect();
  const { slug } = params;

  try {
    const page = await Page.findOne({ slug }).lean();
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch page" },
      { status: 500 }
    );
  }
}

// UPDATE page (status + json)
export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  await dbConnect();
  const { slug } = params;

  try {
    const body = await req.json();
    const { name, json, status } = body;

    const page = await Page.findOneAndUpdate(
      { slug },
      {
        ...(name && { name }),
        ...(json && { json }),
        ...(status && { status }), // explicitly handle published/draft
      },
      { new: true }
    );

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update page" },
      { status: 500 }
    );
  }
}

// DELETE page by slug
export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  await dbConnect();
  const { slug } = params;

  try {
    const result = await Page.findOneAndDelete({ slug });

    if (!result) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Page deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete page" },
      { status: 500 }
    );
  }
}
