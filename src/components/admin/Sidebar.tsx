"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { pageMappings } from "@/utils/pageMappings";
import * as Icons from "react-icons/fa";

export const Sidebar: React.FC = () => {
  const router = useRouter();
  const [user, SetUser] = useState<{ email: string; role: string }>({
    email: "",
    role: "editor",
  });
  const [fullSidebar, SetFullSidebar] = useState<boolean>(false);

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
    <aside
      className="bg-white shadow-lg justify-center"
      onMouseEnter={() => {
        SetFullSidebar(true);
      }}
      onMouseLeave={() => {
        SetFullSidebar(false);
      }}
    >
      <div className="p-4 font-bold text-xl border-b w-full text-center">
        Admin
      </div>
      <nav className="p-4">
        <ul className="space-y-2 pb-4">
          {pageMappings.map((item, index) => {
            const IconComp = (Icons as any)[item.icon] || null;
            return (
              <>
                {item.roles.includes(user.role) && (
                  <li key={index}>
                    <Link
                      href={item.path}
                      key={item.name}
                      className="flex align-middle hover:bg-gray-100 cursor-pointer py-1 justify-center"
                    >
                      {IconComp && <IconComp className="h-6 w-6" />}
                      {fullSidebar && (
                        <span
                          className={`block px-3 rounded-md w-48`}
                          key={item.path}
                        >
                          {item.name}
                        </span>
                      )}
                    </Link>
                  </li>
                )}
              </>
            );
          })}
        </ul>
        <div className="mt-auto bottom-0 pt-4 border-t border-gray-700 justify-center">
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
