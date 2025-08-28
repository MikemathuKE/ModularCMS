"use client";
import { createStyledComponent } from "@/lib/DynamicStyles";
import { CommonProps } from "@/lib/globals";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Button, Heading4, Span } from "./GeneralComponents";
import Link from "next/link";
import { TableColumn } from "@/lib/globals";

export interface CustomChildrenProps extends CommonProps {
  children?: React.ReactNode;
}

export const PageContainer = createStyledComponent<CustomChildrenProps>(
  ({ children, ...props }: CustomChildrenProps) => (
    <div {...props}>{children}</div>
  ),
  "PageContainer"
);

export interface SidebarProps extends CustomChildrenProps {
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

export interface ALinkProps extends CommonProps {
  href: string;
}

export const ALink = createStyledComponent<ALinkProps>(
  ({ href, children, ...props }) => (
    <Link href={href} {...props}>
      {children}
    </Link>
  ),
  "Link"
);

export interface TopbarProps extends CustomChildrenProps {
  visibility?: string | "visible" | "hidden";
}

export const Topbar = createStyledComponent<TopbarProps>(
  ({ children, ...props }: TopbarProps) => {
    return <div {...props}>{children}</div>;
  },
  "Topbar"
);

export interface LogoProps extends CustomChildrenProps {
  showSideBar?: boolean;
  toggleSideBar?: Dispatch<SetStateAction<boolean>>;
}

export const Logo = createStyledComponent<LogoProps>(
  ({ children, toggleSideBar, showSideBar, ...props }: LogoProps) => (
    <div {...props}>
      {toggleSideBar && showSideBar !== undefined && (
        <Button
          onClick={() => toggleSideBar(!showSideBar)}
          style={{
            backgroundColor: "transparent",
            margin: "0px",
            width: "auto",
          }}
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
    </div>
  ),
  "Logo"
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

export interface SideNavProps extends CustomChildrenProps {
  title?: string;
  textColor?: string;
}

export const SideNavigation = createStyledComponent<SideNavProps>(
  ({ children, title, textColor, ...props }: SideNavProps) => (
    <nav {...props}>
      {title && (
        <>
          <Heading4 style={{ color: textColor }}>{title}</Heading4>
          <hr />
        </>
      )}
      {children}
    </nav>
  ),
  "SideNavigation"
);

export interface NavigationDrawerProps extends CustomChildrenProps {
  isOpen?: boolean;
  position?: "left" | "right";
  title?: string;
  toggleSidebar: Dispatch<SetStateAction<boolean>>;
}

export const NavigationDrawer = createStyledComponent<NavigationDrawerProps>(
  ({
    children,
    isOpen = true,
    position = "left",
    toggleSidebar,
    ...props
  }: NavigationDrawerProps) => (
    <div {...props}>
      <div
        style={{
          width: "100%",
          alignItems: "right",
          justifyContent: "right",
          textAlign: "right",
        }}
      >
        <Button
          onClick={() => toggleSidebar(false)}
          style={{ backgroundColor: "transparent" }}
        >
          <svg
            className="w-6 h-6 text-white dark:text-gray-800"
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
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18 17.94 6M18 18 6.06 6"
            />
          </svg>
        </Button>
      </div>
      {children}
    </div>
  ),
  "NavigationDrawer",
  ({ isOpen = true, position = "left" }: NavigationDrawerProps) => {
    const translateX = isOpen ? "0%" : position === "left" ? "-100%" : "100%";

    return {
      transform: `translateX(${translateX})`,
    };
  }
);

export const MenuNav = createStyledComponent<CustomChildrenProps>(
  ({ children, ...props }: CustomChildrenProps) => (
    <div {...props}>{children}</div>
  ),
  "MenuNavbar"
);

export const Navbar = createStyledComponent<CustomChildrenProps>(
  ({ children, ...props }: CustomChildrenProps) => (
    <div {...props}>{children}</div>
  ),
  "Navbar"
);

export interface NavItemProps extends CustomChildrenProps {
  href: string;
}

export const NavItem = createStyledComponent<NavItemProps>(
  ({ children, ...props }: NavItemProps) => <Link {...props}>{children}</Link>,
  "NavItem"
);

export interface MenuProps extends CustomChildrenProps {
  title: string;
}

export const Menu = createStyledComponent<MenuProps>(
  ({ children, title, ...props }: MenuProps) => {
    const [toggleMenu, SetToggleMenu] = useState(false);
    return (
      <>
        <button onClick={() => SetToggleMenu(!toggleMenu)} {...props}>
          {title} ▾
        </button>
        {toggleMenu && children}
      </>
    );
  },
  "Menu"
);

export interface MenuListProps extends CustomChildrenProps {
  visible?: boolean;
}

export const MenuList = createStyledComponent<MenuListProps>(
  ({ children, ...props }: MenuListProps) => <ul {...props}>{children}</ul>,
  "MenuList"
);

export const MenuItem = createStyledComponent<CustomChildrenProps>(
  ({ children, ...props }: CustomChildrenProps) => (
    <li {...props}>{children}</li>
  ),
  "MenuItem"
);

export const TableWrapper = createStyledComponent<CustomChildrenProps>(
  ({ children, ...props }: CustomChildrenProps) => (
    <table {...props}>{children}</table>
  ),
  "TableWrapper"
);

export const PaginationWrapper = createStyledComponent<CustomChildrenProps>(
  ({ children, ...props }: CustomChildrenProps) => (
    <div {...props}>{children}</div>
  ),
  "PaginationWrapper"
);

export interface PageButtonProps extends CustomChildrenProps {
  disabled: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const PageButton = createStyledComponent<PageButtonProps>(
  ({ children, ...props }: PageButtonProps) => (
    <button {...props}>{children}</button>
  ),
  "PageButton"
);

export const TableHead = createStyledComponent<CustomChildrenProps>(
  ({ children, ...props }: CustomChildrenProps) => (
    <th {...props}>{children}</th>
  ),
  "TableHead"
);

export const TableBody = createStyledComponent<CustomChildrenProps>(
  ({ children, ...props }: CustomChildrenProps) => (
    <tbody {...props}>{children}</tbody>
  ),
  "TableBody"
);

export const TableHeader = createStyledComponent<CustomChildrenProps>(
  ({ children, ...props }: CustomChildrenProps) => (
    <thead {...props}>{children}</thead>
  ),
  "TableHeader"
);

export const TableRow = createStyledComponent<CustomChildrenProps>(
  ({ children, ...props }: CustomChildrenProps) => (
    <tr {...props}>{children}</tr>
  ),
  "TableRow"
);

export const TableData = createStyledComponent<CustomChildrenProps>(
  ({ children, ...props }: CustomChildrenProps) => (
    <td {...props}>{children}</td>
  ),
  "TableData"
);

export interface TableProps<T> extends CustomChildrenProps {
  data: T[];
  columns: TableColumn[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Table = createStyledComponent<TableProps<any>>(
  ({ data, columns, currentPage, totalPages, onPageChange, ...props }) => {
    return (
      <div {...props}>
        <TableWrapper>
          <TableHeader>
            <TableRow>
              {columns.map((col: TableColumn) => (
                <TableHead key={col.key as string}>{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((col) => (
                  <TableData key={col.key as string}>{row[col.key]}</TableData>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </TableWrapper>

        <PaginationWrapper>
          <PageButton
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </PageButton>
          <Span>
            Page {currentPage} of {totalPages}
          </Span>
          <PageButton
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </PageButton>
        </PaginationWrapper>
      </div>
    );
  },
  "Table",
  {
    width: "100%",
    overflowX: "auto",
  }
);
