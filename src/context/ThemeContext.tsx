"use client";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ThemeContext, AppTheme } from "@/lib/DynamicStyles";
import { defaultTheme } from "@/theme/DefaultTheme";

interface ThemeContext {
  children: ReactNode;
  themeIdentifier?: null | string;
}

export const ThemeProvider = ({ children, themeIdentifier }: ThemeContext) => {
  async function getTheme(): Promise<AppTheme | null> {
    const response = await fetch(
      `/api/cms/themes/active?id=${themeIdentifier}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: "Bearer ",
        },
      }
    );

    if (!response.ok) {
      SetTheme(defaultTheme);
      return null;
    }

    const result = await response.json();
    if (Object.keys(result).length !== 0) {
      SetTheme(result["json"] as AppTheme);
      return result["json"] as AppTheme;
    } else {
      SetTheme(defaultTheme);
    }
    return null;
  }

  const [theme, SetTheme] = useState<AppTheme>(
    typeof themeIdentifier === "object" &&
      themeIdentifier !== null &&
      themeIdentifier !== undefined
      ? (themeIdentifier as AppTheme)
      : ({} as AppTheme)
  );

  // Effect Theme On Page Load
  useEffect(() => {
    if (
      !themeIdentifier ||
      (themeIdentifier && typeof themeIdentifier !== "object")
    )
      getTheme();
  }, []);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
