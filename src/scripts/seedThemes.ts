import fs from "fs";
import path from "path";
import { dbConnect } from "../lib/mongodb"; // relative path = safest
import { Theme } from "../models/Theme";

async function seedThemes() {
  await dbConnect();

  const themesDir = path.join(process.cwd(), "public/theme_data");
  const files = fs.readdirSync(themesDir).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    const filePath = path.join(themesDir, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(raw);

    const name = path.basename(file, ".json");

    const existing = await Theme.findOne({ name });

    if (existing) {
      if (JSON.stringify(existing.data) === JSON.stringify(json)) {
        continue;
      }
      await Theme.updateOne({ name }, { data: json });
    } else {
      await Theme.create({ name, data: json });
    }
  }

  process.exit(0);
}

seedThemes().catch((err) => {
  console.error("❌ Theme seeding failed:", err);
  process.exit(1);
});
