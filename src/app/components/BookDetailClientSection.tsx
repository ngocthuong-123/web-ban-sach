"use client";

import { FaShoppingCart } from "react-icons/fa";
import { formatPrice, getImageURL } from "@/app/config";
import Image from "next/image";
import BookActionButtons from "./BookActionButtons";
import { useEffect, useState } from "react";
import { getReviewsByBookId } from "../services/api/review";

export default function BookDetailClientSection({ book }: { book: any }) {
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (showReviews) {
      getReviewsByBookId(book.id).then(setReviews).catch(console.error);
    }
  }, [showReviews]);
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-8 bg-white shadow-lg rounded-xl">
      {/* Book Image */}
      <div className="col-span-1 flex justify-center items-start">
        <Image
          src={getImageURL(book.thumbnail || "")}
          alt={book.title}
          width={300}
          height={450}
          className="rounded-lg object-contain shadow-md"
        />
      </div>

      {/* Book Info */}
      <div className="col-span-2 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">{book.title}</h1>

        <p className="text-sm text-gray-600">
          <span className="font-semibold">Tác giả:</span>{" "}
          {book.author?.name || "Không rõ"}
        </p>

        <p className="text-sm text-gray-600">
          <span className="font-semibold">Nhà xuất bản:</span>{" "}
          {book.publisher?.name || "Không rõ"}
        </p>

        <p className="text-sm text-gray-600">
          <span className="font-semibold">Thể loại:</span>{" "}
          {book.category?.name || "Không rõ"}
        </p>

        <p className="text-red-600 text-2xl font-bold">
          {book.pricesale
            ? formatPrice(book.pricesale)
            : formatPrice(book.price)}
        </p>

        <BookActionButtons bookId={book.id} />
        {/* Toggle xem review */}
        <div className="mt-4">
          <button
            className="text-blue-600 underline text-sm"
            onClick={() => setShowReviews(!showReviews)}
          >
            {showReviews ? "Ẩn phản hồi" : "Xem phản hồi trước đó"}
          </button>
        </div>

        {/* Danh sách review */}
        {showReviews && (
          <div className="bg-gray-50 border rounded p-4 space-y-2 mt-2 max-h-96 overflow-y-auto">
            {reviews.length > 0 ? (
              reviews.map((review: any) => {
                const reviewTime = new Date(review.created_at).toLocaleString(
                  "vi-VN"
                );
                return (
                  <div key={review.id} className="border-b pb-2">
                    <p className="text-sm font-semibold">
                      [user - {reviewTime}] - ⭐ {review.rating}/5
                    </p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {review.content}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-sm">
                Chưa có phản hồi nào cho sách này.
              </p>
            )}
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Mô tả</h2>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {book.description || "Chưa có mô tả cho sách này."}
          </p>
        </div>
      </div>
    </div>
  );
}
