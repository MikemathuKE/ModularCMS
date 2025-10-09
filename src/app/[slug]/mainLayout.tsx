"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import DynamicLayout from "@/theme/DynamicLayout";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [themeId, SetThemeId] = useState<string>("");
  useEffect(() => {
    async function getActiveTheme() {
      const themeRes = await fetch("/api/themes/active");
      const theme = await themeRes.json();
      console.log(theme);
      if (theme) SetThemeId(theme._id);
    }
    getActiveTheme();
  }, [themeId]);

  return (
    <ThemeProvider themeIdentifier={themeId}>
      <DynamicLayout themeId={themeId}>{children}</DynamicLayout>
    </ThemeProvider>
  );
};

export default MainLayout;
