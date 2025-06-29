interface CategoryFilterProps {
    categories: Category[];
    selectedCategory: string;
    onSelect: (slug: string) => void;
  }
  interface Category {
    id: number;
    name: string;
    slug: string;
  }
  
  
  export default function CategoryFilter({ categories, selectedCategory, onSelect }: CategoryFilterProps) {
    return (
      <div className="flex justify-center space-x-1 mb-6 pt-6">
        <button
          onClick={() => onSelect("all")}
          className={`px-4 py-2 border rounded ${selectedCategory === "all" ? "bg-yellow-500 text-black" : "bg-black"} hover:underline`}
        >
          Mới nhất
        </button>
  
        {/* Phần tử tạm thời vô hiệu hóa */}
        <button
          className="px-4 py-2 text-gray-500 cursor-not-allowed"
          style={{ pointerEvents: 'none' }}
        >
          &gt;&gt;
        </button>
  
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.slug)}
            className={`px-4 py-2 border rounded ${selectedCategory === category.slug ? "bg-yellow-500 text-black" : "bg-white"} hover:underline`}
          >
            {category.name}
          </button>
        ))}
      </div>
    );
  }
  