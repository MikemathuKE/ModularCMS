"use client";
import type { ReactNode } from "react";
import { useEffect, useState, useMemo } from "react";
import { AppTheme } from "@/lib/DynamicStyles";
import { defaultTheme } from "@/theme/DefaultTheme";
import { ThemeContext, ThemeContextValue } from "@/lib/DynamicStyles";

interface ThemeProviderProps {
  children: ReactNode;
  themeIdentifier?: null | string;
  themeMode?: "light" | "dark";
}

export const ThemeProvider = ({
  children,
  themeIdentifier,
  themeMode = "light",
}: ThemeProviderProps) => {
  // ensure defaultTheme always has a themeMode
  const initialTheme: AppTheme = { ...defaultTheme, themeMode };

  const [theme, setTheme] = useState<AppTheme>(initialTheme);
  const [mode, setMode] = useState<"light" | "dark">(themeMode);
  const [layout, SetLayout] = useState<string>("default");

  async function getTheme(): Promise<void> {
    try {
      const response = await fetch(
        `/api/cms/themes/active?id=${themeIdentifier}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer ", // add token later if needed
          },
        }
      );

      if (!response.ok) {
        setTheme({ ...defaultTheme, themeMode: mode });
        return;
      }

      const result = await response.json();
      if (result && Object.keys(result).length !== 0) {
        const loaded = result["json"] as AppTheme;
        setTheme({ ...loaded, themeMode: mode });
        SetLayout(loaded.layout);
      } else {
        setTheme({ ...defaultTheme, themeMode: mode });
      }
    } catch (err) {
      console.error("Failed to load theme:", err);
      setTheme({ ...defaultTheme, themeMode: mode });
    }
  }

  useEffect(() => {
    if (!themeIdentifier || typeof themeIdentifier !== "object") {
      getTheme();
    } else if (typeof themeIdentifier === "object") {
      setTheme({ ...(themeIdentifier as AppTheme), themeMode: mode });
    }
  }, [themeIdentifier, mode]);

  const contextValue: ThemeContextValue = useMemo(
    () => ({
      theme,
      themeMode: mode,
      layout: layout,
      setThemeMode: setMode,
    }),
    [theme, mode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
