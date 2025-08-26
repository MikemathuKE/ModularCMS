import React from "react";
import Link from "next/link";

const navItems = [
  { name: "Dashboard", path: "/admin" },
  { name: "Pages", path: "/admin/pages" },
  { name: "Media", path: "/admin/media" },
  { name: "Content", path: "/admin/content" },
  { name: "Content Types", path: "/admin/content-types" },
  { name: "Settings", path: "/admin/settings" },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-4 font-bold text-xl border-b">CMS Admin</div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <span
                  className={`block px-3 py-2 rounded-md cursor-pointer
                      hover:bg-gray-100`}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
