"use client";
import { useState } from "react";
import BookCard from "../BookCard";
import { Book } from "../../types/Book";

interface SearchResultsProps {
  searchQuery: string;
  searchResults: Book[];
  onAddToCart: (bookId: number) => void;
  onCloseSearch: () => void;
}

const SearchResults = ({
  searchQuery,
  searchResults,
  onAddToCart,
  onCloseSearch,
}: SearchResultsProps) => {
  const [showAllResults, setShowAllResults] = useState(false);

  if (!searchQuery || searchResults.length === 0) return null;

  return (
    <div className="mb-6 relative">
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
        onClick={onCloseSearch}
        title="Đóng kết quả tìm kiếm"
        aria-label="Đóng tìm kiếm"
        style={{ zIndex: 10, background: "none", border: "none" }}
      >
        &times;
      </button>

      <h2 className="text-xl font-semibold text-red-600 mb-4">
        Kết quả tìm kiếm cho: "{searchQuery}"
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-6">
        {(showAllResults ? searchResults : searchResults.slice(0, 6)).map(
          (book) => (
            <BookCard key={book.id} book={book} onAddToCart={onAddToCart} />
          )
        )}
      </div>

      {searchResults.length > 6 && (
        <div className="text-center mt-4">
          <button
            className="text-blue-600 hover:underline font-semibold"
            onClick={() => setShowAllResults((prev) => !prev)}
          >
            {showAllResults ? "Thu gọn kết quả" : "Xem tất cả kết quả"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
