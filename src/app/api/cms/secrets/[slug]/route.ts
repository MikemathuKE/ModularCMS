import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { GetTenantSlug } from "@/utils/getTenantSlug";
import { getTenantConnection } from "@/lib/mongodb";
import { getOrCreateSecretModel } from "@/models/Secret";
import { encrypt, decrypt } from "@/lib/crypto";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  await dbConnect();

  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return NextResponse.json({ error: "Tenant missing" }, { status: 400 });

  const conn = await getTenantConnection(tenantSlug);
  const Secret = getOrCreateSecretModel(conn);

  const secret = await Secret.findOne({ slug });

  if (!secret)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    data: {
      name: secret.name,
      slug: secret.slug,
      value: decrypt(secret.value),
    },
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  await dbConnect();

  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return NextResponse.json({ error: "Tenant missing" }, { status: 400 });

  const conn = await getTenantConnection(tenantSlug);
  const Secret = getOrCreateSecretModel(conn);

  const { name, value } = await req.json();

  const update: any = {};

  if (name) update.name = name;
  if (value) update.value = encrypt(value);

  const secret = await Secret.findOneAndUpdate({ slug }, update, { new: true });

  if (!secret)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    data: { name: secret.name, slug: secret.slug },
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  await dbConnect();

  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return NextResponse.json({ error: "Tenant missing" }, { status: 400 });

  const conn = await getTenantConnection(tenantSlug);
  const Secret = getOrCreateSecretModel(conn);

  await Secret.deleteOne({ slug });

  return NextResponse.json({ success: true });
}
