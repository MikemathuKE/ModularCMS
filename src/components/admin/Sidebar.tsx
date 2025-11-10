"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const navItems = [
  { name: "Dashboard", path: "/admin" },
  { name: "Layout", path: "/admin/layout" },
  { name: "Pages", path: "/admin/pages" },
  { name: "Media", path: "/admin/media" },
  { name: "Content", path: "/admin/content" },
  { name: "Content Types", path: "/admin/contenttypes" },
  { name: "Theme", path: "/admin/themes" },
  { name: "Settings", path: "/admin/settings" },
];

export const Sidebar: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

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
        <div className="mt-auto bottom-0 pt-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="bg-red-600 sticky bottom-0 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
};
