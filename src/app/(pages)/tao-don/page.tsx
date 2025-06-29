
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRoleFromToken } from "@/lib/auth";
import ProductGrid from "../../components/employee/ProductGrid";
import SelectedItemsPanel from "../../components/employee/SelectedItemsPanel";
import { Book } from "../../types/Book";
import { Category } from "@/app/types/Category";
import {
  getBooksByCategory,
  getBooksBySearch
} from "../../services/api/books"; // Update the import path
import { 
  getCategories
} from "../../services/api/category";
export default function TaoDonPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [childCategories, setChildCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [products, setProducts] = useState<Book[]>([]);
  const [selectedItems, setSelectedItems] = useState<{ product: Book; quantity: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // Thêm state cho tìm kiếm
  const [isSearching, setIsSearching] = useState(false); // Trạng thái tìm kiếm
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const role = getRoleFromToken();
    if (role !== "employee") {
      router.push("/");
    }
  }, [router]);

useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        const allCategories = response.data;
        
        const filteredChildCategories: Category[] = [];
        for (const parent of allCategories) {
          if (parent.children && parent.children.length > 0) {
            const childrenWithParent = parent.children.map((child: Category) => ({
              ...child,
              parentName: parent.name,
            }));
            filteredChildCategories.push(...childrenWithParent);
          }
        }
        
        setCategories(allCategories);
        setChildCategories(filteredChildCategories);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };
    
    fetchCategories();
  }, []);

  // Hàm fetch sản phẩm theo danh mục hoặc tìm kiếm
  const fetchProducts = async () => {
    setLoading(true);
    try {
      if (searchQuery) {
        // Nếu có query tìm kiếm
        setIsSearching(true);
        const response = await getBooksBySearch(searchQuery);
        if (response) {
          setProducts(response.data?.data || []);
        }
      } else if (selectedCategorySlug) {
        // Nếu chọn danh mục
        setIsSearching(false);
        const response = await getBooksByCategory(selectedCategorySlug, 1, 100);
        setProducts(response.data?.data || []);
      } else {
        // Nếu không có gì
        setIsSearching(false);
        setProducts([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategorySlug, searchQuery]);

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setSearchQuery(""); // Reset search query khi chọn danh mục
    
    if (categoryId) {
      const category = childCategories.find(cat => cat.id === categoryId);
      if (category) {
        setSelectedCategorySlug(category.slug);
      } else {
        setSelectedCategorySlug(null);
      }
    } else {
      setSelectedCategorySlug(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleAddToOrder = (book: Book) => {
    setSelectedItems((prev) => {
      const exists = prev.find((item) => item.product.id === book.id);
      if (exists) {
        return prev.map((item) =>
          item.product.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { product: book, quantity: 1 }];
      }
    });
  };

  const handleRemove = (bookId: number) => {
    setSelectedItems((prev) => prev.filter((item) => item.product.id !== bookId));
  };

  const handleChangeQty = (bookId: number, quantity: number) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.product.id === bookId ? { ...item, quantity } : item
      )
    );
  };
  // Hàm làm mới dữ liệu
  const handleRefresh = () => {
    setSelectedItems([]); // Xóa danh sách đã chọn
    setSearchQuery(""); // Reset tìm kiếm
    setSelectedCategory(null); // Reset danh mục
    setSelectedCategorySlug(null);
    setRefreshKey(prev => prev + 1); // Force re-render
  };

  // Thêm useEffect để fetch lại dữ liệu khi refreshKey thay đổi
  useEffect(() => {
    fetchProducts();
  }, [selectedCategorySlug, searchQuery, refreshKey]); // Thêm refreshKey vào dependencies
return (
    <div className="grid grid-cols-3 gap-4 p-6">
      <div className="col-span-2">
        <div className="flex gap-4 mb-4">
          {/* Ô tìm kiếm */}
          <form onSubmit={handleSearch} className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="border rounded px-2 py-1 w-full"
            />
          </form>
          
          {/* Dropdown danh mục */}
          <select
            value={selectedCategory || ""}
            onChange={(e) => handleCategoryChange(Number(e.target.value) || null)}
            className="border rounded px-2 py-1 w-64"
          >
            <option value="">Tất cả danh mục</option>
            {childCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.parentName ? `${cat.parentName} > ${cat.name}` : cat.name}
              </option>
            ))}
          </select>
        </div>
        
        {loading && <p className="p-4 text-center">Đang tải sản phẩm...</p>}
        
        {!loading && isSearching && searchQuery && products.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            Không tìm thấy sản phẩm nào phù hợp với "{searchQuery}"
          </div>
        )}
        
        {!loading && !isSearching && selectedCategory && products.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            Không tìm thấy sản phẩm nào trong danh mục này
          </div>
        )}
        
        {!loading && products.length > 0 && (
          <>
            {isSearching && (
              <div className="mb-4 text-sm text-gray-500">
                Kết quả tìm kiếm cho "{searchQuery}" ({products.length} sản phẩm)
              </div>
            )}
            <ProductGrid products={products} onSelect={handleAddToOrder} />
          </>
        )}
      </div>
      
      <div className="col-span-1">
        <SelectedItemsPanel
          selectedItems={selectedItems}
          onRemove={handleRemove}
          onChangeQty={handleChangeQty}
          onSuccess={handleRefresh}
        />
      </div>
    </div>
  );
}