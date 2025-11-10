import { Schema, model, models, Connection } from "mongoose";

export const SocialLinkSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String, required: true }, // path to uploaded file or icon name
});

export const SettingsSchema = new Schema(
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
