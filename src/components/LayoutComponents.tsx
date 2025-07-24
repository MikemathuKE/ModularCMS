"use client";
import { createStyledComponent } from "@/lib/DynamicStyles";
import { CommonProps } from "@/lib/globals";
import React, { Dispatch, SetStateAction } from "react";
import { Button } from "./GeneralComponents";

interface CustomChildrenProps extends CommonProps {
  children?: React.ReactNode;
}

export const PageContainer = createStyledComponent<CustomChildrenProps>(
  ({ children, ...props }: CustomChildrenProps) => (
    <div {...props}>{children}</div>
  ),
  "PageContainer"
);

interface SidebarProps extends CustomChildrenProps {
  visibility?: string | "visible" | "hidden";
}

export const Sidebar = createStyledComponent<SidebarProps>(
  ({ children, visibility: _, ...props }: SidebarProps) => (
    <aside {...props}>{children}</aside>
  ),
  "Sidebar",
  ({ visibility }: SidebarProps) => ({
    visibility,
  })
);

interface SidebarProps extends CustomChildrenProps {
  visibility?: string | "visible" | "hidden";
  showSideBar?: boolean;
  toggleSideBar?: Dispatch<SetStateAction<boolean>>;
}

export const Topbar = createStyledComponent<SidebarProps>(
  ({ children, toggleSideBar, showSideBar, ...props }: SidebarProps) => {
    return (
      <header {...props}>
        {toggleSideBar && showSideBar !== undefined && (
          <Button
            onClick={() => toggleSideBar(!showSideBar)}
            style={{ backgroundColor: "transparent" }}
          >
            {!showSideBar && (
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M5 7h14M5 12h14M5 17h14"
                />
              </svg>
            )}
            {showSideBar && (
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                style={{ transform: "scaleX(-1)" }}
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"
                />
              </svg>
            )}
          </Button>
        )}
        {children}
      </header>
    );
  },
  "Topbar"
);
export const Main = createStyledComponent<CustomChildrenProps>(
  ({ children, ...props }: CustomChildrenProps) => (
    <main {...props}>{children}</main>
  ),
  "Main"
);
export const Info = createStyledComponent<CustomChildrenProps>(
  ({ children, ...props }: CustomChildrenProps) => (
    <div {...props}>{children}</div>
  ),
  "Info"
);
export const Footer = createStyledComponent<CustomChildrenProps>(
  ({ children, ...props }: CustomChildrenProps) => (
    <footer {...props}>{children}</footer>
  ),
  "Footer"
);
export const Section = createStyledComponent<CustomChildrenProps>(
  ({ children, ...props }: CustomChildrenProps) => (
    <section {...props}>{children}</section>
  ),
  "Section"
);

// Card
export const Card = createStyledComponent<CustomChildrenProps>(
  ({ children, ...props }: CustomChildrenProps) => (
    <div {...props}>{children}</div>
  ),
  "Card"
);
export const CardContent = createStyledComponent<CustomChildrenProps>(
  ({ children, ...props }: CustomChildrenProps) => (
    <div {...props}>{children}</div>
  ),
  "CardContent"
);
export const CardHeader = createStyledComponent<CustomChildrenProps>(
  ({ children, ...props }: CustomChildrenProps) => (
    <div {...props}>{children}</div>
  ),
  "CardHeader"
);
export const CardFooter = createStyledComponent<CustomChildrenProps>(
  ({ children, ...props }: CustomChildrenProps) => (
    <div {...props}>{children}</div>
  ),
  "CardFooter"
);

export const Grid = createStyledComponent<CustomChildrenProps>(
  ({ children, ...props }: CustomChildrenProps) => (
    <div {...props}>{children}</div>
  ),
  "Grid"
);
