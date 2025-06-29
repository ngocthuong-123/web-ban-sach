"use client";
import { useEffect, useState } from "react";
import { getBooksByCategory } from "./services/api/books";
import { getCategories } from "./services/api/category";
import { Book } from "./types/Book";
import { Category } from "./types/Category";
import { getToken, getSessionId } from "./utils/storage";
import { addToCart, addToCartGuest } from "./services/api/cart";
import { showError, showSuccess } from "./utils/toast";
import { useSearchContext } from "./context/SearchContext";
import { getCartCount, getGuestCartCount } from "./services/api/header";
import { useAppContext } from "./context/AppContext";
import { useCountdown } from "./hooks/useCountdown";
import Link from "next/link";
import ZaloIcon from "./components/ZaloIcon";
// import SearchResults from "./components/home/SearchResults";
// import CategorySection from "./components/home/CategorySection";
// import FlashSaleSection from "./components/home/FlashSaleSection";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import {
  SearchResultsSkeleton,
  BannerSkeleton,
  FlashSaleSkeleton,
  CategorySkeleton,
} from "./components/LoadingSkeleton";
const SearchResults = dynamic(() => import("./components/home/SearchResults"), {
  loading: () => <SearchResultsSkeleton />,
  ssr: false,
});

const BannerSection = dynamic(() => import("./components/home/BannerSection"), {
  loading: () => <BannerSkeleton />,
  ssr: false,
});

const FlashSaleSection = dynamic(() => import("./components/home/FlashSaleSection"), {
  loading: () => <FlashSaleSkeleton />,
  ssr: false,
});

const CategorySection = dynamic(() => import("./components/home/CategorySection"), {
  loading: () => <CategorySkeleton />,
  ssr: false,
});
// const BannerSection = dynamic(() => import("./components/home/BannerSection"), { ssr: false });

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [booksByCategoryMap, setBooksByCategoryMap] = useState<Record<string, Book[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const { searchQuery, searchResults, setSearchQuery, setSearchResults } = useSearchContext();
  // const { setCartCount } = useAppContext();
  const { setCartCount, refreshCartCount } = useAppContext();


  useEffect(() => {
    const savedToken = getToken();
    setToken(savedToken);
  }, []);

useEffect(() => {
  const fetchInitial = async () => {
    try {
      const catRes = await getCategories();
      const allCategories = catRes.data;

      const childCategories: Category[] = [];
      for (const parent of allCategories) {
        if (parent.children && parent.children.length > 0) {
          const childrenWithParent = parent.children.map((child: Category) => ({
            ...child,
            parentName: parent.name,
          }));
          childCategories.push(...childrenWithParent);
        }
      }
      setCategories(childCategories);

      // 🔁 Gọi song song các API getBooksByCategory
      const bookFetchPromises = childCategories.map((category) =>
        getBooksByCategory(category.slug, 1, 5).then((res) => ({
          slug: category.slug,
          books: res.data.data,
        }))
      );

      const booksResponses = await Promise.all(bookFetchPromises);
      const booksMap: Record<string, Book[]> = {};
      booksResponses.forEach(({ slug, books }) => {
        booksMap[slug] = books;
      });

      setBooksByCategoryMap(booksMap);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchInitial();
}, []);


  const handleCloseSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleAddToCart = async (bookId: number) => {
    try {
      if (token) {
        await addToCart(bookId, 1);
        // const count = await getCartCount();
        // setCartCount(count);
        await refreshCartCount();
      } else {
        const sessionId = getSessionId();
        await addToCartGuest(bookId, 1, sessionId);
        const count = await getGuestCartCount();
        setCartCount(count);
      }
      showSuccess("✅ Đã thêm vào giỏ hàng!");
    } catch (error: any) {
      console.error("❌ Lỗi khi thêm vào giỏ:", error?.response?.data || error);
      showError("❌ Đã xảy ra lỗi khi thêm vào giỏ hàng.");
    }
  };

  {isLoading && <div className="text-center py-4 text-sm text-gray-500">Đang tải dữ liệu...</div>}


  return (
    <div className="container mx-auto px-4 py-2 bg-[#FDF8F5]">
      <Suspense fallback={<SearchResultsSkeleton />}>
            <SearchResults
        searchQuery={searchQuery}
        searchResults={searchResults}
        onAddToCart={handleAddToCart}
        onCloseSearch={handleCloseSearch}
      /></Suspense>

<Suspense fallback={<BannerSkeleton />}><BannerSection /></Suspense>
      
<Suspense fallback={<FlashSaleSkeleton />}><FlashSaleSection onAddToCart={handleAddToCart} /></Suspense>
      

      {categories.slice(0, 2).map((category) => (
        <Suspense key={category.id} fallback={<CategorySkeleton />}><CategorySection
          key={category.id}
          categoryName={category.name}
          books={booksByCategoryMap[category.slug] || []}
          onAddToCart={handleAddToCart}
        /></Suspense>
        
      ))}

      <div className="flex justify-center my-8">
        <Link
          href="/category"
          className="text-xl font-semibold mb-4 text-[#5A2D0C] bg-[#FDF4ED] py-2 px-6 rounded-md shadow-sm text-center"
          title="Xem tất cả danh mục"
        >
          Xem tất cả danh mục
        </Link>
      </div>

      <div className="flex justify-center mt-6 gap-1 items-center">
        <a
          href="https://zaloapp.com/qr/p/1h5433h44fo2g"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed z-50 right-4 bottom-6 md:right-8 md:bottom-8 rounded-full shadow-lg bg-[#018fe0] hover:bg-[#006cb7] transition-colors p-3 flex items-center justify-center animate-bounce"
          title="Chat Zalo"
        >
          <ZaloIcon className="w-10 h-10" />
        </a>
      </div>
    </div>
  );
};

export default Home;