"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { pageMappings } from "@/utils/pageMappings";

export const Sidebar: React.FC = () => {
  const router = useRouter();
  const [user, SetUser] = useState<{ email: string; role: string }>({
    email: "",
    role: "editor",
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((result) => {
        if (result.user) SetUser(result.user);
      });
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-4 font-bold text-xl border-b">CMS Admin</div>
      <nav className="p-4">
        <ul className="space-y-2">
          {pageMappings.map((item, index) => (
            <>
              {item.roles.includes(user.role) && (
                <li key={index}>
                  <Link href={item.path} key={item.name}>
                    <span
                      className={`block px-3 py-2 rounded-md cursor-pointer
                      hover:bg-gray-100`}
                      key={item.path}
                    >
                      {item.name}
                    </span>
                  </Link>
                </li>
              )}
            </>
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
