import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "../../types/Menu";
import { Category } from "../../types/Category";
import CategoryDropdown from "./CategoryDropdown";
import Colors from "../../utils/colors";
import { URL } from "../../config";
import { getRoleFromToken } from "@/lib/auth";
interface MainMenuProps {
  menus: Menu[];
  categories: Category[];
}

export default function MainMenu({ menus, categories }: MainMenuProps) {
  const [showCategories, setShowCategories] = useState(false);
  const [role, setRole] = useState<string | null>(null);

useEffect(() => {
  const timeout = setTimeout(() => {
    const role = getRoleFromToken();
    console.log("✅ ROLE:", role);
    setRole(role);
  }, 100); // đợi 100ms

  return () => clearTimeout(timeout);
}, []);

  return (
    <div className="container mx-auto flex space-x-6 py-3 relative">
      {menus
        .filter((menu) => menu.parent_id === null)
        .map((menu) => (
          <div
            key={menu.id}
            className="relative"
            onMouseEnter={() => menu.id === 2 && setShowCategories(true)}
            onMouseLeave={() => menu.id === 2 && setShowCategories(false)}
          >
            {menu.id === 2 ? (
              <button
                onClick={() => setShowCategories(!showCategories)}
                className={`text-[${Colors.textDark}] px-4 hover:bg-[${Colors.primaryDark}] rounded`}
              >
                {menu.name}
              </button>
            ) : (
              <Link
                href={`${URL}/${menu.url}`}
                className={`text-[${Colors.textDark}] px-4 py-2 hover:bg-[${Colors.primaryDark}] rounded`}
              >
                {menu.name}
              </Link>
            )}

            {menu.id === 2 && showCategories && (
              <CategoryDropdown
                categories={categories}
                setShowCategories={setShowCategories}
              />
            )}
          </div>
        ))}
      {role === "employee" && (
        <Link
          href="/tao-don"
          className={`text-[${Colors.textDark}] px-4 bg-neutral-500 hover:bg-[${Colors.primaryDark}] rounded`}
        >
          Tạo Đơn
        </Link>
      )}
    </div>
  );
}
