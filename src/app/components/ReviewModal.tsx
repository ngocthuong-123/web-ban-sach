'use client';

import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface ReviewModalProps {
  bookId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewModal({ bookId, isOpen, onClose }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState<number | null>(null);
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:8000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify({ book_id: bookId, rating, content }),
      });

      if (!res.ok) throw new Error('Gửi đánh giá thất bại');
      setSuccess(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <h2 className="text-xl font-bold mb-4 text-center">📝 Đánh giá sản phẩm</h2>

        {success ? (
          <div className="text-green-600 mb-4 text-center">
            🎉 Bạn đã gửi đánh giá thành công!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating bằng ngôi sao */}
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => {
                const value = i + 1;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHover(value)}
                    onMouseLeave={() => setHover(null)}
                  >
                    <FaStar
                      size={28}
                      className={`cursor-pointer ${
                        value <= (hover ?? rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Nội dung đánh giá */}
            <div>
              <textarea
                className="w-full border rounded px-3 py-2"
                placeholder="Chia sẻ cảm nhận của bạn..."
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Gửi đánh giá
            </button>
          </form>
        )}

        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-sm"
        >
          ✖
        </button>
      </div>
    </div>
  );
}
