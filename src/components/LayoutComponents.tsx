"use client";
import { createStyledComponent } from "@/lib/DynamicStyles";
import { CommonProps } from "@/lib/globals";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useRef,
} from "react";
import { Button, Heading4, Span } from "./GeneralComponents";
import Link from "next/link";
import { JSONNode } from "@/renderer/JsonRenderer";
import { useThemeMode } from "@/lib/DynamicStyles";
import { LayoutPresets, LayoutType } from "@/utils/layoutPresets";

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
  children: React.ReactNode;
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

export interface LayoutProps extends CustomChildrenProps {
  layout?: LayoutType;
  gap?: string;
}

export const Section = createStyledComponent<LayoutProps>(
  ({ children, layout, ...props }: LayoutProps) => (
    <section {...props} style={layout ? LayoutPresets[layout] : {}}>
      {children}
    </section>
  ),
  "Section"
);

export const Layout = createStyledComponent<LayoutProps>(
  ({ children, layout, ...props }: LayoutProps) => (
    <div {...props} style={layout ? LayoutPresets[layout] : {}}>
      {children}
    </div>
  ),
  "Layout"
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

export interface TableColumn {
  key: string;
  label: string;
  render?: JSONNode;
}

export interface TableProps<T> extends CommonProps {
  data?: T[];
  columns: TableColumn[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  contentType?: string;
  filters?: Record<string, object | boolean | string | number>;
  sort?: Record<string, 1 | -1>;
  limit?: number;
  displayColumns?: string; //comma separated list of columns
}

export const Table = createStyledComponent<TableProps<any>>(
  ({
    data: externalData,
    columns,
    currentPage,
    totalPages,
    onPageChange,
    contentType,
    filters = {},
    sort = {},
    limit = 10,
    displayColumns,
    ...props
  }) => {
    const [data, setData] = useState<any[]>(externalData || []);
    const [loading, setLoading] = useState(false);
    const [pages, setPages] = useState(totalPages || 1);

    // Interactive state
    const [pageSize, setPageSize] = useState(limit);
    const [activeSort, setActiveSort] = useState<keyof any | null>(null);
    const [activeSortDir, setActiveSortDir] = useState<1 | -1>(1);
    const [columnFilters, setColumnFilters] = useState<Record<string, string>>(
      {}
    );
    const [visibleCols, setVisibleCols] = useState<string[]>(
      displayColumns ? displayColumns.split(",") : []
    );
    const [effectiveColumns, setEffectiveColumns] = useState<TableColumn[]>([]);
    const [visibleColumns, SetVisibleColumns] = useState<TableColumn[]>([]);

    // fetch when contentType given
    useEffect(() => {
      async function fetchData() {
        setLoading(true);
        try {
          if (contentType) {
            const query = {
              filters: { ...filters, ...columnFilters },
              sort: activeSort ? { [activeSort]: activeSortDir } : sort,
              limit: pageSize,
              page: currentPage,
            };
            const res = await fetch(
              `/api/cms/content/${contentType}?q=${encodeURIComponent(
                JSON.stringify(query)
              )}`
            );
            const json = await res.json();
            setData(json.items || []);
            setPages(json.pages || 1);
          }
          setEffectiveColumns(
            columns.length
              ? columns
              : data.length > 0
              ? Object.keys(data[0]).map((key) => ({ key, label: key }))
              : []
          );

          // visible columns logic
          SetVisibleColumns(
            visibleCols.length > 0
              ? effectiveColumns.filter((c) => visibleCols.includes(c.key))
              : effectiveColumns
          );
          // auto-generate columns if not provided
        } catch (e) {
          console.error("Table fetch error", e);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
      if (!contentType) {
        setEffectiveColumns(
          data.length > 0
            ? Object.keys(data[0]).map((key) => ({ key, label: key }))
            : []
        );

        // visible columns logic
        SetVisibleColumns(
          visibleCols.length > 0
            ? effectiveColumns.filter((c) => visibleCols.includes(c.key))
            : effectiveColumns
        );
      }
    }, [pageSize, currentPage]);

    return (
      <div {...props}>
        {/* Controls */}
        <div className="flex items-center gap-4 mb-4">
          {/* Page size selector */}
          {/* <label className="flex items-center gap-2">
            Show:
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                onPageChange(1); // reset to page 1
              }}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label> */}

          {/* Sort dropdown */}
          {/* <label className="flex items-center gap-2">
            Sort by:
            <select
              value={activeSort || ""}
              onChange={(e) => {
                const val = e.target.value;
                setActiveSort(val || null);
              }}
            >
              <option value="">None</option>
              {effectiveColumns.map((col) => (
                <option key={col.key} value={col.key}>
                  {col.label}
                </option>
              ))}
            </select>
            <button onClick={() => setActiveSortDir((d) => (d === 1 ? -1 : 1))}>
              {activeSortDir === 1 ? "↑" : "↓"}
            </button>
          </label> */}

          {/* Column toggles */}
          {/* <div className="flex items-center gap-2">
            Columns:
            {effectiveColumns.map((col) => (
              <label key={col.key} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={visibleColumns.some((c) => c.key === col.key)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setVisibleCols((prev) => [...prev, col.key]);
                    } else {
                      setVisibleCols((prev) =>
                        prev.filter((k) => k !== col.key)
                      );
                    }
                  }}
                />
                {col.label}
              </label>
            ))}
          </div> */}
        </div>
        {loading ? (
          <div>Loading {contentType}...</div>
        ) : (
          <>
            <TableWrapper>
              <TableHeader>
                <TableRow>
                  {visibleCols.length
                    ? visibleCols.map((col, idx) => (
                        <TableHead key={col}>
                          {col}
                          {/* Simple filter input */}
                          {/* <div>
                            <input
                              type="text"
                              value={columnFilters[col] || ""}
                              onChange={(e) =>
                                setColumnFilters((prev) => ({
                                  ...prev,
                                  [col]: e.target.value,
                                }))
                              }
                              placeholder="Filter..."
                              className="text-xs border p-1"
                            />
                          </div> */}
                        </TableHead>
                      ))
                    : data.length
                    ? Object.keys(data[0]).map((header, idx) => (
                        <TableHead key={idx}>{header}</TableHead>
                      ))
                    : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, idx) => (
                  <TableRow key={idx}>
                    {visibleCols.length > 0
                      ? visibleCols.map((col, key) => (
                          <TableData key={key}>{row[col]}</TableData>
                        ))
                      : Object.values(row).map((data, key) => (
                          <TableData key={key}>{data as string}</TableData>
                        ))}
                  </TableRow>
                ))}
              </TableBody>
            </TableWrapper>

            {/* Pagination */}
            <PaginationWrapper>
              <PageButton
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
              >
                Previous
              </PageButton>
              <Span>
                Page {currentPage} of {pages}
              </Span>
              <PageButton
                disabled={currentPage === pages}
                onClick={() => onPageChange(currentPage + 1)}
              >
                Next
              </PageButton>
            </PaginationWrapper>
          </>
        )}
      </div>
    );
  },
  "Table"
);

export interface ThemeModeSwitchProps extends CustomChildrenProps {
  label?: string;
}

export const ThemeModeSwitch = createStyledComponent<ThemeModeSwitchProps>(
  ({ label, ...props }: ThemeModeSwitchProps) => {
    const { themeMode, setThemeMode } = useThemeMode();

    useEffect(() => {
      const savedTheme = localStorage.getItem("themeMode");
      if (savedTheme && typeof savedTheme === "string")
        setThemeMode(savedTheme as "light" | "dark");
    }, []);

    const toggleMode = () => {
      localStorage.setItem(
        "themeMode",
        themeMode === "light" ? "dark" : "light"
      );
      setThemeMode(themeMode === "light" ? "dark" : "light");
    };

    return (
      <button onClick={toggleMode} {...props}>
        {label ?? (themeMode === "light" ? "🌙 Dark Mode" : "☀️ Light Mode")}
      </button>
    );
  },
  "ThemeModeSwitch"
);
