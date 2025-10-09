"use client";
import React, { useState, useEffect } from "react";
import {
  PageContainer,
  Topbar,
  Main,
  Sidebar,
  Footer,
  Info,
} from "@/components/LayoutComponents";
import { useTheme } from "@/lib/DynamicStyles";
import { LayoutConfig } from "@/models/Layout";
import { JSONNode, renderJSONNode } from "@/renderer/JsonRenderer";

export default function DynamicLayout({
  themeId,
  children,
}: {
  themeId: string;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const [config, SetConfig] = useState<LayoutConfig>({
    topbar: null,
    sidebar: null,
    footer: null,
  });

  useEffect(() => {
    async function getLayout() {
      const themeRes = await fetch(`/api/cms/themes/active?id=${themeId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: "Bearer ", // add token later if needed
        },
      });
      const layout = (await themeRes.json()).layout;
      const result = await fetch(`/api/cms/layouts/${layout}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const res = await result.json();
      SetConfig(res as LayoutConfig);
    }

    getLayout();
  }, [theme, themeId]);

  return (
    <PageContainer>
      {config.topbar !== null && (
        <Topbar>{renderJSONNode(config.topbar as JSONNode)}</Topbar>
      )}
      <Main>
        {config.sidebar !== null && (
          <Sidebar>{renderJSONNode(config.sidebar as JSONNode)}</Sidebar>
        )}
        <Info style={config.sidebar === null ? { marginLeft: 0 } : {}}>
          {children}
        </Info>
      </Main>
      {config.footer !== null && (
        <Footer>{renderJSONNode(config.footer as JSONNode)}</Footer>
      )}
    </PageContainer>
  );
}
