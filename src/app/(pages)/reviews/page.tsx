// 'use client';
// import { useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';

// export default function ReviewFormPage() {
//   const searchParams = useSearchParams();
//   const bookId = searchParams.get('book_id');

//   const [rating, setRating] = useState(5);
//   const [content, setContent] = useState('');
//   const [submitted, setSubmitted] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const token = localStorage.getItem('access_token');
//     if (!token || !bookId) return;

//     try {
//       const res = await fetch('http://localhost:8000/api/reviews', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//         body: JSON.stringify({ book_id: bookId, rating, content }),
//       });

//       if (!res.ok) throw new Error('Lỗi khi gửi đánh giá');
//       setSubmitted(true);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (submitted)
//     return <div className="p-6 text-green-600">🎉 Đánh giá đã được gửi!</div>;

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-8">
//       <h2 className="text-xl font-bold mb-4">📝 Đánh giá sản phẩm</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block font-medium mb-1">Số sao (1 - 5)</label>
//           <input
//             type="number"
//             value={rating}
//             onChange={(e) => setRating(parseInt(e.target.value))}
//             min={1}
//             max={5}
//             className="w-full border rounded px-3 py-2"
//             required
//           />
//         </div>
//         <div>
//           <label className="block font-medium mb-1">Nội dung đánh giá</label>
//           <textarea
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             className="w-full border rounded px-3 py-2"
//             rows={4}
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//         >
//           Gửi đánh giá
//         </button>
//       </form>
//     </div>
//   );
// }
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function ReviewFormContent() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get('book_id');

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token || !bookId) return;

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

      if (!res.ok) throw new Error('Lỗi khi gửi đánh giá');
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (submitted)
    return <div className="p-6 text-green-600">🎉 Đánh giá đã được gửi!</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-8">
      <h2 className="text-xl font-bold mb-4">📝 Đánh giá sản phẩm</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Số sao (1 - 5)</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            min={1}
            max={5}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Nội dung đánh giá</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={4}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Gửi đánh giá
        </button>
      </form>
    </div>
  );
}

export default function ReviewFormPage() {
  return (
    <Suspense fallback={<p>Đang tải biểu mẫu đánh giá...</p>}>
      <ReviewFormContent />
    </Suspense>
  );
}
