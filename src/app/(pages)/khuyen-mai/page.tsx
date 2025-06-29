"use client";
import React, { useEffect, useState } from "react";
import PromoBookCard from "../../components/PromoBookCard"; // hoặc đúng đường dẫn của bạn
import axios from "axios";
import FlashSaleSection from "@/app/components/home/FlashSaleSection";
import { addToCart, addToCartGuest } from "@/app/services/api/cart";
import { getCartCount, getGuestCartCount } from "@/app/services/api/header";
import { getSessionId } from "@/app/utils/storage";
import { showError, showSuccess } from "@/app/utils/toast";
import { useAppContext } from "@/app/context/AppContext";

export default function KhuyenMaiPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const { setCartCount } = useAppContext();
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/books-with-discount")
      .then((res) => setBooks(res.data.original || []))
      .catch((err) => console.error(err));
  }, []);
  const handleAddToCart = async (bookId: number) => {
    try {
      if (token) {
        await addToCart(bookId, 1);
        const count = await getCartCount();
        setCartCount(count);
      } else {
        const sessionId = getSessionId();
        await addToCartGuest(bookId, 1, sessionId);
        const count = await getGuestCartCount(sessionId);
        setCartCount(count);
      }
      showSuccess("✅ Đã thêm vào giỏ hàng!");
    } catch (error: any) {
      console.error("❌ Lỗi khi thêm vào giỏ:", error?.response?.data || error);
      showError("❌ Đã xảy ra lỗi khi thêm vào giỏ hàng.");
    }
  };
  return (
    <div className="container mx-auto h-full px-4 py-2">
      <div className="h-full py-8 px-4 bg-[#FFF8F2]">
        <h1 className="font-bold text-2xl mb-6">Chương trình giảm giá</h1>
        <FlashSaleSection onAddToCart={handleAddToCart} />
        <h1 className="font-bold text-2xl mb-6">Sách có mã giảm</h1>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-6">
          {books.map((book) => (
            <PromoBookCard
              key={book.book_id}
              book={{
                id: book.book_id,
                title: book.book_title,
                slug: book.book_slug,
                thumbnail: book.book_thumbnail,
                price: book.book_price,
                pricesale: book.pricesale || 0,
                discounts: book.discounts,
              }}
              // onAddToCart={...} // nếu muốn truyền hàm này
            />
          ))}
        </div>
      </div>
    </div>
  );
}
