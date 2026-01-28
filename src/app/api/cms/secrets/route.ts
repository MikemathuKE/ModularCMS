import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { GetTenantSlug } from "@/utils/getTenantSlug";
import { getTenantConnection } from "@/lib/mongodb";
import { getOrCreateSecretModel } from "@/models/Secret";
import { encrypt } from "@/lib/crypto";

export async function GET(req: NextRequest) {
  await dbConnect();

  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return NextResponse.json({ error: "Tenant missing" }, { status: 400 });

  const conn = await getTenantConnection(tenantSlug);
  const Secret = getOrCreateSecretModel(conn);

  const secrets = await Secret.find().select("name slug createdAt updatedAt");

  return NextResponse.json({ data: secrets });
}

export async function POST(req: NextRequest) {
  await dbConnect();

  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return NextResponse.json({ error: "Tenant missing" }, { status: 400 });

  const conn = await getTenantConnection(tenantSlug);
  const Secret = getOrCreateSecretModel(conn);

  const { name, slug, value } = await req.json();

  if (!name || !slug || !value)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const encrypted = encrypt(value);

  const secret = await Secret.create({
    name,
    slug,
    value: encrypted,
  });

  return NextResponse.json({
    data: {
      name: secret.name,
      slug: secret.slug,
    },
  });
}
