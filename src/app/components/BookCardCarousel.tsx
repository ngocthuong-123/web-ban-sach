"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { Book } from "@/app/types/Book";
import BookCard from "./BookCard";

export default function BookCardCarousel({
  books,
  showPriceSale = false,
  onAddToCart,
}: {
  books: Book[];
  showPriceSale?: boolean;
  onAddToCart?: (bookId: number) => void;
}) {
  return (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={16}
      slidesPerView="auto"
      breakpoints={{
        0: { slidesPerView: 2 },
        480: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 5 },
        1280: { slidesPerView: 6 }, 
      }}
      className="py-2"
    >
      {books.map((book) => (
        <SwiperSlide key={book.id} className="max-h-full h-auto">
          <BookCard
            book={book}
            showPriceSale={showPriceSale}
            onAddToCart={onAddToCart}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
