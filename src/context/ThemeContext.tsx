"use client";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ThemeContext, AppTheme } from "@/lib/DynamicStyles";
import { defaultTheme } from "@/theme/DefaultTheme";
import { baseUrl } from "@/lib/globals";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, SetTheme] = useState(defaultTheme);

  async function getTheme(): Promise<AppTheme | null> {
    const response = await fetch(`${baseUrl}/api/theme`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: "Bearer ",
      },
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    if (Object.keys(result).length !== 0) {
      SetTheme(result as AppTheme);
    }
    return result;
  }

  // Effect Theme On Page Load
  useEffect(() => {
    getTheme();
  }, []);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
