import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Schema, model, models, Connection } from "mongoose";

import { getTenantConnection } from "@/lib/mongodb";
import { GetTenantSlug } from "@/utils/getTenantSlug";

const SocialLinkSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String, required: true }, // path to uploaded file or icon name
});

const SettingsSchema = new Schema(
  {
    siteTitle: { type: String, default: "" },
    siteDescription: { type: String, default: "" },
    defaultLanguage: { type: String, default: "en" },
    theme: { type: String, default: "light" },
    socialLinks: { type: [SocialLinkSchema], default: [] },
    extra: { type: Object, default: {} }, // flexible field for future extensions
  },
  { timestamps: true }
);

export function getOrCreateSettingModel(conn: Connection | any) {
  if (!conn) return models.Settings || model("Settings", SettingsSchema);
  return conn.models["Settings"] || conn.model("Settings", SettingsSchema);
}

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
