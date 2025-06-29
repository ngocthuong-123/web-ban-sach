import { useEffect, useState } from "react";
import { fetchBooks } from "@/lib/api";
import { Book } from "../../types/Book";
import Image from "next/image";
import { getImageURL } from "@/app/config"; // nếu có hàm build URL ảnh

interface Props {
  products: Book[]; // có thể không cần nếu bạn fetch từ API
  onSelect: (book: Book) => void;
}

export default function ProductGrid({ onSelect }: Props) {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAndSetBooks = async (term: string = "") => {
    const data = await fetchBooks(term);
    setBooks(data);
  };

  useEffect(() => {
    fetchAndSetBooks();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAndSetBooks(searchTerm);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          placeholder="Tìm sách..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="border p-3 rounded shadow hover:shadow-lg transition duration-300"
          >
            {book.thumbnail && (
              <div className="relative w-full aspect-[3/4] mb-2 rounded overflow-hidden bg-white">
                <Image
                  src={getImageURL(book.thumbnail)}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
            )}

            <p className="font-medium truncate">{book.title}</p>
            {/* <p className="text-sm text-gray-600 truncate">
              Tác giả: {book.author?.name || "Không rõ"}
            </p> */}
            <p className="text-sm text-gray-600">
              Giá: {book.price.toLocaleString()}₫
            </p>

            <button
              onClick={() => onSelect(book)}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded w-full"
            >
              Thêm
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
