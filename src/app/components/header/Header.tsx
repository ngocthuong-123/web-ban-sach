"use client";
import React, { useEffect, useState } from "react";
import { getMenus, getCategories } from "../../services/api/header";
import { Menu } from "../../types/Menu";
import { Category } from "../../types/Category";
import TopBar from "./TopBar";
import MainMenu from "./MainMenu";

export default function Header() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const handleSearch = (query: string) => {
    console.log("Từ khóa tìm kiếm:", query);
    // Bạn có thể dùng query này để gửi lên parent component hoặc lưu vào context
    // Hoặc gọi API tìm kiếm sản phẩm luôn tại đây nếu muốn
  };
  useEffect(() => {
    getMenus().then(setMenus).catch(console.error);
    getCategories().then(setCategories).catch(console.error);
  }, []);

  return (
    <>
      <header>
        <TopBar onSearch={handleSearch} />
      </header>
      <nav className="bg-orange-400 text-white">
        <MainMenu menus={menus} categories={categories} />
      </nav>
    </>
  );
}
