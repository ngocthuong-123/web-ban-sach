"use client";

import { useEffect, useState } from "react";
import PromoBookCard from "../PromoBookCard";
import { useCountdown } from "../../hooks/useCountdown";
import { Book } from "../../types/Book";

const FlashSaleSection = ({ onAddToCart }: { onAddToCart: (id: number) => void }) => {
  const [flashSaleBooks, setFlashSaleBooks] = useState<Book[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    async function fetchFlashSale() {
      try {
        const res = await fetch("http://localhost:8000/api/books-with-discount");
        const data = await res.json();

        const books = (Array.isArray(data) ? data : data.original || [])
          .filter((book: any) =>
            book.discounts?.some((d: any) => d.discount_code.toUpperCase().includes("FLASHSALE"))
          )
          .map((book: any) => ({
            id: book.book_id,
            title: book.book_title,
            slug: book.book_slug,
            thumbnail: book.book_thumbnail,
            price: book.book_price,
            final_price: book.final_price,
            discounts: book.discounts,
          }));

        setFlashSaleBooks(books);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu Flash Sale:", error);
      }
    }

    fetchFlashSale();
  }, []);

  const flashSaleDiscount = flashSaleBooks[0]?.discounts?.find((d) =>
    d.discount_code.toUpperCase().includes("FLASHSALE")
  );
  const countdown = useCountdown(flashSaleDiscount?.discount_end_date);

  if (!flashSaleBooks.length) return null;

  return (
    <div className="mb-10 rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 relative">
      <div className="p-6 backdrop-blur-[1.5px] bg-white/10">
        <h2 className="text-2xl font-bold text-center text-white py-4 mb-2 tracking-wide uppercase animate-pulse drop-shadow-lg">
          ⚡ FLASH SALE HÔM NAY ⚡
        </h2>
        {countdown && (
          <div className="text-center mb-4 text-lg text-yellow-100 drop-shadow font-semibold">
            Kết thúc sau: <span className="font-extrabold text-yellow-300">{countdown}</span>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {flashSaleBooks.slice(0, visibleCount).map((book) => (
            <PromoBookCard key={book.id} book={book} onAddToCart={onAddToCart} />
          ))}
        </div>
        {flashSaleBooks.length > visibleCount && (
          <div className="text-center mt-4">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="bg-white text-red-600 font-semibold px-4 py-2 rounded hover:bg-yellow-100 shadow-md transition"
            >
              Xem thêm sách giảm giá
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashSaleSection;
