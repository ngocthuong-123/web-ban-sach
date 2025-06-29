
// "use client";
// import { useEffect, useState } from "react";
// import { getBooksByCategory } from "./services/api/books";
// import { getCategories } from "./services/api/category";
// import { Book } from "./types/Book";
// import { Category } from "./types/Category";
// import BookCard from "./components/BookCard";
// import Pagination from "./components/Pagination";
// import { getToken, getSessionId } from "./utils/storage";
// import { addToCart, addToCartGuest } from "./services/api/cart";
// import { useRouter } from "next/navigation";
// import { showError, showSuccess, showInfo, showWarning } from "./utils/toast";
// import { useSearchContext } from "./context/SearchContext";
// import BookCardCarousel from "./components/BookCardCarousel";
// import { getCartCount, getGuestCartCount } from "./services/api/header";
// import { useAppContext } from "./context/AppContext";
// import { getBanners } from "./services/api/banner";
// import BannerCarousel from "./components/banners/BannerCarousel";
// import PromoBookCard from "./components/PromoBookCard";
// import { useCountdown } from "./hooks/useCountdown";
// import ZaloIcon from "./components/ZaloIcon";
// type Banner = {
//   id: number;
//   title: string | null;
//   image: string;
//   link: string | null;
//   position: number;
//   status: number;
// };
// const Home = () => {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [booksByCategoryMap, setBooksByCategoryMap] = useState<
//     Record<string, Book[]>
//   >({});
//   const [categoryPageMap, setCategoryPageMap] = useState<
//     Record<string, number>
//   >({});
//   const [categoryTotalPagesMap, setCategoryTotalPagesMap] = useState<
//     Record<string, number>
//   >({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [token, setToken] = useState<string | null>(null);
//   const router = useRouter();

//   const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
//   const categoriesPerPage = 3;
//   const { searchQuery, searchResults } = useSearchContext();
//   const [showAllResults, setShowAllResults] = useState(false);
//   const { setCartCount } = useAppContext();
//   const [banners, setBanners] = useState<Banner[]>([]);
//   const [flashSaleBooks, setFlashSaleBooks] = useState<Book[]>([]);

//   useEffect(() => {
//     const savedToken = getToken();
//     setToken(savedToken);
//   }, []);
//   // Lấy danh sách danh mục và 5 sách đầu mỗi danh mục hiển thị
//   useEffect(() => {
//     const fetchInitial = async () => {
//       try {
//         const bannerRes = await getBanners();
//         setBanners(bannerRes.data);

//         const catRes = await getCategories();
//         const allCategories = catRes.data;

//         // Lọc và gộp tất cả danh mục con
//         const childCategories: Category[] = [];

//         for (const parent of allCategories) {
//           if (parent.children && parent.children.length > 0) {
//             const childrenWithParent = parent.children.map(
//               (child: Category) => ({
//                 ...child,
//                 parentName: parent.name, // nếu bạn muốn biết nó thuộc danh mục cha nào
//               })
//             );
//             childCategories.push(...childrenWithParent);
//           }
//         }

//         setCategories(childCategories);
//         const firstCategories = childCategories.slice(0, categoriesPerPage);

//         const booksMap: Record<string, Book[]> = {};
//         const pageMap: Record<string, number> = {};
//         const totalMap: Record<string, number> = {};

//         for (const category of firstCategories) {
//           const res = await getBooksByCategory(category.slug, 1, 5);
//           booksMap[category.slug] = res.data.data;
//         }

//         setBooksByCategoryMap(booksMap);
//         setCategoryPageMap(pageMap);
//         setCategoryTotalPagesMap(totalMap);
//       } catch (err) {
//         console.error("Lỗi khi tải dữ liệu:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchInitial();
//   }, []);
//   useEffect(() => {
//     async function fetchFlashSale() {
//       // Gọi API lấy danh sách sách có mã FLASHSALE
//       const res = await fetch("http://localhost:8000/api/books-with-discount");
//       const data = await res.json();

//       // Lọc và map lại thành Book[] chuẩn interface
//       const books = (Array.isArray(data) ? data : data.original || [])
//         .filter(
//           (book: any) =>
//             book.discounts &&
//             book.discounts.some((d: any) =>
//               d.discount_code.toUpperCase().includes("FLASHSALE")
//             )
//         )
//         .map((book: any) => ({
//           id: book.book_id,
//           title: book.book_title,
//           slug: book.book_slug,
//           thumbnail: book.book_thumbnail,
//           price: book.book_price,
//           discounts: book.discounts,
//         }));

//       setFlashSaleBooks(books);
//     }
//     fetchFlashSale();
//   }, []);

//   const flashSaleDiscount = flashSaleBooks[0]?.discounts?.find((d) =>
//     d.discount_code.toUpperCase().includes("FLASHSALE")
//   );
//   const flashSaleEndDate = flashSaleDiscount?.discount_end_date;
//   const countdown = useCountdown(flashSaleEndDate);
//   // Tải sách cho nhóm danh mục hiện tại khi chuyển trang nhóm danh mục
//   const loadBooksForCategoryGroup = async (page: number) => {
//     setIsLoading(true);
//     const start = (page - 1) * categoriesPerPage;
//     const group = categories.slice(start, start + categoriesPerPage);

//     const booksMap: Record<string, Book[]> = {};
//     const pageMap: Record<string, number> = {};
//     const totalMap: Record<string, number> = {};

//     for (const category of group) {
//       const res = await getBooksByCategory(category.slug, 1, 5);
//       booksMap[category.slug] = res.data.data;
//     }

//     setBooksByCategoryMap(booksMap);
//     setCategoryPageMap(pageMap);
//     setCategoryTotalPagesMap(totalMap);
//     setIsLoading(false);
//   };

//   const displayedCategories = categories.slice(
//     (currentCategoryPage - 1) * categoriesPerPage,
//     currentCategoryPage * categoriesPerPage
//   );
//   const totalCategoryPages = Math.ceil(categories.length / categoriesPerPage);
//   const handleAddToCart = async (bookId: number) => {
//     try {
//       if (token) {
//         console.log("📦 Gửi cho user đã đăng nhập:", { bookId, quantity: 1 });
//         await addToCart(bookId, 1);
//         const count = await getCartCount();
//         setCartCount(count);
//       } else {
//         const sessionId = getSessionId();
//         console.log("🧑‍💻 Gửi cho khách vãng lai:", {
//           bookId,
//           quantity: 1,
//           sessionId,
//           headers: { "X-Session-ID": sessionId },
//         });
//         await addToCartGuest(bookId, 1, sessionId);
//         const count = await getGuestCartCount(sessionId);
//         setCartCount(count);
//       }

//       showSuccess("✅ Đã thêm vào giỏ hàng!");
//     } catch (error: any) {
//       console.error("❌ Lỗi khi thêm vào giỏ:", error?.response?.data || error);
//       showError("❌ Đã xảy ra lỗi khi thêm vào giỏ hàng.");
//     }
//   };

//   if (isLoading) return <div className="text-center py-10">Đang tải...</div>;
//   return (
//     <div className="container mx-auto px-4 py-2 bg-[#FDF8F5]">
//       {searchQuery && searchResults.length > 0 && (
//         <div className="mb-6">
//           <h2 className="text-xl font-semibold text-red-600 mb-4">
//             Kết quả tìm kiếm cho: "{searchQuery}"
//           </h2>

//           <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-6">
//             {(showAllResults ? searchResults : searchResults.slice(0, 6)).map(
//               (book) => (
//                 <BookCard
//                   key={book.id}
//                   book={book}
//                   onAddToCart={handleAddToCart}
//                 />
//               )
//             )}
//           </div>

//           {searchResults.length > 6 && (
//             <div className="text-center mt-4">
//               {showAllResults ? (
//                 <button
//                   className="text-blue-600 hover:underline font-semibold"
//                   onClick={() => setShowAllResults(false)}
//                 >
//                   Thu gọn kết quả
//                 </button>
//               ) : (
//                 <button
//                   className="text-blue-600 hover:underline font-semibold"
//                   onClick={() => setShowAllResults(true)}
//                 >
//                   Xem tất cả kết quả
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       )}
//       <BannerCarousel banners={banners} />
//       {flashSaleBooks.length > 0 && (
//         <div
//           className="mb-10 rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 relative"
//           style={{
//             boxShadow: "0 8px 32px 0 rgba(255, 105, 0, 0.18)",
//             border: "2px solid #fff3",
//           }}
//         >
//           <div className="p-6 backdrop-blur-[1.5px] bg-white/10">
//             <h2 className="text-2xl font-bold text-center text-white py-4 mb-2 tracking-wide uppercase animate-pulse drop-shadow-lg">
//               ⚡ FLASH SALE HÔM NAY ⚡
//             </h2>
//             {/* Hiển thị countdown */}
//             {flashSaleEndDate && (
//               <div className="text-center mb-4 text-lg text-yellow-100 drop-shadow font-semibold">
//                 Kết thúc sau:{" "}
//                 <span className="font-extrabold text-yellow-300">
//                   {countdown}
//                 </span>
//               </div>
//             )}
//             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
//               {flashSaleBooks.map((book) => (
//                 <PromoBookCard key={book.id} book={book}
//                 onAddToCart={handleAddToCart} />
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {displayedCategories.map((category) => (
//         <div key={category.id} className="mb-10">
//           <h2 className="text-xl font-semibold mb-4 text-[#5A2D0C] bg-[#FDF4ED] py-2 px-6 rounded-md shadow-sm text-center">
//             {category.name}
//           </h2>

//           <div className="bg-[#FDF8F5] p-4 rounded-xl shadow-sm">
//             <BookCardCarousel
//               books={(booksByCategoryMap[category.slug] || []).slice(0, 6)}
//               onAddToCart={handleAddToCart}
//               showPriceSale={true}
//             />
//           </div>

//           {/* <Pagination
//             currentPage={categoryPageMap[category.slug] || 1}
//             totalPages={categoryTotalPagesMap[category.slug] || 1}
//             onPageChange={(page) =>
//               handleCategoryBookPageChange(category.slug, page)
//             }
//           /> */}
//         </div>
//       ))}

//       {totalCategoryPages > 1 && (
//         <div className="flex justify-center mt-6 gap-1 items-center">
//           {/* Nút trang trước */}
//           <button
//             onClick={() =>
//               setCurrentCategoryPage((prev) => Math.max(prev - 1, 1))
//             }
//             disabled={currentCategoryPage === 1}
//             className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-sm disabled:opacity-50"
//           >
//             ←
//           </button>

//           {/* Các nút số trang */}
//           {[...Array(totalCategoryPages)].map((_, index) => {
//             const pageNum = index + 1;
//             const isActive = currentCategoryPage === pageNum;

//             return (
//               <button
//                 key={pageNum}
//                 onClick={() => {
//                   setCurrentCategoryPage(pageNum);
//                   loadBooksForCategoryGroup(pageNum);
//                 }}
//                 className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 ${
//                   isActive
//                     ? "bg-[#8B4513] text-white shadow-md scale-105"
//                     : "bg-gray-100 hover:bg-gray-200 text-gray-700"
//                 }`}
//               >
//                 {pageNum}
//               </button>
//             );
//           })}

          
//           <button
//             onClick={() =>
//               setCurrentCategoryPage((prev) =>
//                 Math.min(prev + 1, totalCategoryPages)
//               )
//             }
//             disabled={currentCategoryPage === totalCategoryPages}
//             className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-sm disabled:opacity-50"
//           >
//             →
//           </button>
//           <a
//             href="https://zaloapp.com/qr/p/1h5433h44fo2g"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="fixed z-50 right-4 bottom-6 md:right-8 md:bottom-8 rounded-full shadow-lg bg-[#018fe0] hover:bg-[#006cb7] transition-colors p-3 flex items-center justify-center animate-bounce"
//             title="Chat Zalo"
//           >
//             <ZaloIcon className="w-10 h-10" />
//           </a>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;
