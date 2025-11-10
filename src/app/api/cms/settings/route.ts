import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";

import { getTenantConnection } from "@/lib/mongodb";
import { GetTenantSlug } from "@/utils/getTenantSlug";

import { getOrCreateSettingModel } from "@/models/Settings";

export async function GET(req: Request) {
  await dbConnect();
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const Settings = getOrCreateSettingModel(tenantConn);
  let settings = await Settings.findOne().lean();

  if (!settings) {
    settings = await Settings.create({});
  }

  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();

  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug)
    return Response.json({ error: "Tenant missing" }, { status: 400 });

  const tenantConn = await getTenantConnection(tenantSlug);
  const Settings = getOrCreateSettingModel(tenantConn);

  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings(body);
  } else {
    Object.assign(settings, body);
  }

  await settings.save();
  return NextResponse.json(settings);
}
