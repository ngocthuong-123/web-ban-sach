import BookCardCarousel from "../BookCardCarousel";
import { Book } from "../../types/Book";

interface Props {
  categoryName: string;
  books: Book[];
  onAddToCart: (bookId: number) => void;
}

const CategorySection = ({ categoryName, books, onAddToCart }: Props) => {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-[#5A2D0C] bg-[#FDF4ED] py-2 px-6 rounded-md shadow-sm text-center">
        {categoryName}
      </h2>
      <div className="bg-[#FDF8F5] p-4 rounded-xl shadow-sm">
        <BookCardCarousel books={books} onAddToCart={onAddToCart} showPriceSale />
      </div>
    </div>
  );
};

export default CategorySection;
