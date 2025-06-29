"use client";
import React, { useEffect, useState } from "react";
import { getBooksByCategory } from "@/app/services/api/books";
import { getCategories } from "@/app/services/api/category";
import { Book } from "@/app/types/Book";
import { Category } from "@/app/types/Category";
import BookCardCarousel from "@/app/components/BookCardCarousel";
import { addToCart, addToCartGuest } from "@/app/services/api/cart";
import { getSessionId } from "@/app/utils/storage";
import { getGuestCartCount } from "@/app/services/api/header";
import { showError, showSuccess } from "@/app/utils/toast";
import { useAppContext } from "@/app/context/AppContext";

const CategoryAllPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [booksByCategoryMap, setBooksByCategoryMap] = useState<Record<string, Book[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
    const { setCartCount, refreshCartCount } = useAppContext();
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const catRes = await getCategories();
        const allCategories = catRes.data;

        // Lọc tất cả danh mục con
        const childCategories: Category[] = [];
        for (const parent of allCategories) {
          if (parent.children && parent.children.length > 0) {
            const childrenWithParent = parent.children.map((child: Category) => ({
              ...child,
              parentName: parent.name,
            }));
            childCategories.push(...childrenWithParent);
          }
        }

        setCategories(childCategories);

        const booksMap: Record<string, Book[]> = {};
        for (const category of childCategories) {
          const res = await getBooksByCategory(category.slug, 1, 5);
          booksMap[category.slug] = res.data.data;
        }
        setBooksByCategoryMap(booksMap);
      } catch (err) {
        // console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitial();
  }, []);
  
    const handleAddToCart = async (bookId: number) => {
      try {
        if (token) {
          await addToCart(bookId, 1);
          // const count = await getCartCount();
          // setCartCount(count);
          await refreshCartCount();
        } else {
          const sessionId = getSessionId();
          await addToCartGuest(bookId, 1, sessionId);
          const count = await getGuestCartCount();
          setCartCount(count);
        }
        showSuccess("✅ Đã thêm vào giỏ hàng!");
      } catch (error: any) {
        // console.error("❌ Lỗi khi thêm vào giỏ:", error?.response?.data || error);
        showError("❌ Đã xảy ra lỗi khi thêm vào giỏ hàng.");
      }
    };

  return (
    <div className="container mx-auto px-4 py-2 bg-[#FDF8F5]">
      <h1 className="text-2xl font-bold mb-6 text-[#5A2D0C] text-center uppercase tracking-wider">Tất cả danh mục</h1>
      {categories.map((category) => (
        <div key={category.id} className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-[#5A2D0C] bg-[#FDF4ED] py-2 px-6 rounded-md shadow-sm text-center">
            {category.name}
          </h2>
          <div className="bg-[#FDF8F5] p-4 rounded-xl shadow-sm">
            <BookCardCarousel
              books={(booksByCategoryMap[category.slug] || []).slice(0, 6)}
              onAddToCart={handleAddToCart}
              showPriceSale={true}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryAllPage;