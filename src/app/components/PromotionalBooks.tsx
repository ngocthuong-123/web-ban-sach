// components/PromotionalBooks.tsx
import React from 'react';

interface Book {
  id: number;
  title: string;
  author: { name: string };
  thumbnail: string;
  pricesale: number;
}

interface Props {
  books: Book[];
}

const PromotionalBooks: React.FC<Props> = ({ books }) => {
  return (
    <div className="section">
        <h1 className="text-center font-bold uppercase bg-blue-100 py-2 text-lg">
    Sản phẩm nổi bật
  </h1>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-6 pt-6">
        {books.length === 0 ? (
          <p>Không có sách khuyến mãi nào.</p>
        ) : (
          books.map((book) => (
            <div key={book.id} className="bg-yellow-50 p-4 shadow rounded-lg">
              <img 
                src={book.thumbnail ? `http://localhost:8000/storage/${book.thumbnail}` : '/default-thumbnail.jpg'} 
                alt={book.title} 
                className="w-full h-48 object-contain rounded-md mb-2" 
              />
              <h3 className="font-semibold">{book.title}</h3>
              <p className="text-sm">{book.author.name}</p>
              <p className="text-lg text-red-500">{book.pricesale}đ</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PromotionalBooks;
