"use client";
import React, { useEffect, useState } from "react";
import { JSONNode, renderJSONNode } from "@/renderer/JsonRenderer";

import { TAB_WIDTH } from "@/lib/globals";
import { useTheme } from "@/lib/DynamicStyles";

import {
  Sidebar,
  Topbar,
  Footer,
  PageContainer,
  Info,
  Main,
  NavigationDrawer,
} from "./LayoutComponents";

interface LayoutProps {
  config: {
    topbar?: JSONNode | null;
    sidebar?: JSONNode | null;
    footer?: JSONNode | null;
  };
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ config, children }) => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [showSidebar, SetShowSidebar] = useState(false);

  const [adjustInfoToSidebar, SetAdjustInfoToSidbar] = useState(true);

  useEffect(() => {
    // Function to update dimensions
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowDimensions.width < TAB_WIDTH) {
      SetAdjustInfoToSidbar(false);
    } else {
      SetAdjustInfoToSidbar(true);
    }
  }, [windowDimensions]);

  return (
    <PageContainer>
      {config.topbar && <Topbar>{renderJSONNode(config.topbar)}</Topbar>}

      <Main>
        {config.sidebar && windowDimensions.width >= TAB_WIDTH && (
          <Sidebar>{renderJSONNode(config.sidebar)}</Sidebar>
        )}
        {config.sidebar && windowDimensions.width < TAB_WIDTH && (
          <NavigationDrawer isOpen={showSidebar} toggleSidebar={SetShowSidebar}>
            {renderJSONNode(config.sidebar)}
          </NavigationDrawer>
        )}
        <Info>{children}</Info>
      </Main>

      {config.footer && <Footer>{renderJSONNode(config.footer)}</Footer>}
    </PageContainer>
  );
};
