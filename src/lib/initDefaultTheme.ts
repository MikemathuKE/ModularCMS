// lib/initDefaultTheme.ts
import { defaultTheme } from "@/theme/DefaultTheme";
import { Theme } from "@/models/Theme";

export async function ensureDefaultTheme() {
  const slug = "default";
  let theme = await Theme.findOne({ slug });

  if (!theme) {
    theme = await Theme.create({
      name: "Default Theme",
      slug,
      json: defaultTheme,
      active: true,
    });
  }

  // If no other theme is active, set default active
  const activeCount = await Theme.countDocuments({ active: true });
  if (activeCount === 0) {
    await Theme.updateMany({}, { $set: { active: false } });
    theme.active = true;
    await theme.save();
  }

  return theme;
}
