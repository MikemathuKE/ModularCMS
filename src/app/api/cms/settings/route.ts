import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Schema, model, models } from "mongoose";

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

const Settings = models.Settings || model("Settings", SettingsSchema);

export async function GET() {
  await dbConnect();
  let settings = await Settings.findOne().lean();

  if (!settings) {
    settings = await Settings.create({});
  }

  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();

  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings(body);
  } else {
    Object.assign(settings, body);
  }

  await settings.save();
  return NextResponse.json(settings);
}
