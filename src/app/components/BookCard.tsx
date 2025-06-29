import React, { useRef } from "react";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { formatPrice, getImageURL } from "../config";
import Colors from "../utils/colors";
import { useAppContext } from "../context/AppContext";
import { getSessionId, getToken } from "../utils/storage";
import { buyNowUser,addToCartBuyNow } from "../services/api/cart";
import { useRouter } from "next/navigation";
  import axios from "axios";
import Image from "next/image";
import Link from "next/link";
interface BookCardProps {
  book: Book;
  showPriceSale?: boolean;
  onAddToCart?: (bookId: number) => void;
}

interface Book {
  id: number;
  title: string;
  slug: string;
  author?: { name: string };
  publisher?: { name: string };
  thumbnail?: string;
  pricesale: number;
  price?: number;
}

export default function BookCard({
  book,
  showPriceSale = false,
  onAddToCart,
}: BookCardProps) {
  const { cartCount, setCartCount } = useAppContext();
  const imgRef = useRef<HTMLImageElement>(null);
  const router = useRouter();

  // const handleBuyNowClick = async () => {
  //   const sessionId = getSessionId(); // lấy từ localStorage
  //   try {
  //     await addToCartBuyNow(book.id, 1, sessionId);
  //     router.push("/cart"); // hoặc window.location.href = "/cart"
  //   } catch (error) {
  //     console.error("Không thể mua ngay:", error);
  //     alert("Không thể thêm sách vào giỏ hàng. Vui lòng thử lại.");
  //   }
  // };

// const handleBuyNowClick = async () => {
//   const token = localStorage.getItem("access_token");
//   const sessionId = getSessionId(); // dùng cho guest

//   try {
//     if (token) {
//       // Nếu đã đăng nhập, gửi API lưu vào giỏ hàng người dùng
//       const res = await axios.post(
//         "http://localhost:8000/api/cart/add",
//         {
//           product_id: book.id,
//           quantity: 1,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//     } else {
//       // Nếu chưa đăng nhập, thêm vào giỏ hàng guest (local/session)
//       await addToCartBuyNow(book.id, 1, sessionId);
//     }

//     // Chuyển đến trang giỏ hàng
//     router.push("/cart");
//   } catch (error) {
//     console.error("Không thể mua ngay:", error);
//     alert("Không thể thêm sách vào giỏ hàng. Vui lòng thử lại.");
//   }
// };
const handleBuyNowClick = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const sessionId = getSessionId();
console.log("Token:", token);
console.log("Gửi request:", {
  book_id: book.id,
  quantity: 1
});
    if (token) {
      await buyNowUser(book.id, 1);
    } else {
      await addToCartBuyNow(book.id, 1,sessionId);
    }

    router.push("/cart"); // chuyển trang sau khi thêm
  } catch (error: any) {
    console.error("Lỗi đầy đủ:", error);
    alert("Không thể thêm sách vào giỏ hàng. Vui lòng thử lại.");
  }
};

  const handleAddToCartClick = () => {
    if (imgRef.current) {
      const img = imgRef.current;
      const cartIcon = document.getElementById("cart-icon");

      if (cartIcon) {
        const imgRect = img.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();

        const flyingImg = img.cloneNode(true) as HTMLImageElement;
        flyingImg.style.position = "fixed";
        flyingImg.style.left = `${imgRect.left}px`;
        flyingImg.style.top = `${imgRect.top}px`;
        flyingImg.style.width = `${imgRect.width}px`;
        flyingImg.style.height = `${imgRect.height}px`;
        flyingImg.style.zIndex = "9999";
        flyingImg.style.transition = "all 0.8s ease-in-out";

        document.body.appendChild(flyingImg);

        setTimeout(() => {
          flyingImg.style.left = `${cartRect.left + cartRect.width / 2}px`;
          flyingImg.style.top = `${cartRect.top + cartRect.height / 2}px`;
          flyingImg.style.width = "0px";
          flyingImg.style.height = "0px";
          flyingImg.style.opacity = "0.5";
        }, 50);

        setTimeout(() => {
          document.body.removeChild(flyingImg);
        }, 850);
      }
    }
    if (onAddToCart) onAddToCart(book.id);
  };
  return (
    <div
      className="max-h-full flex flex-col justify-between bg-[#FFF8F2] p-2 shadow relative transition-transform duration-300 
            transform-gpu hover:scale-103 
            "
      style={{
        backgroundColor: Colors.primaryLight,
        color: Colors.textDark,
        border: `1px solid ${Colors.primary}`,
      }}
    >
<Link href={`/books/${book.slug}`}>
  <div className="relative w-[200px] aspect-[214/335] overflow-hidden rounded-xl bg-[#FDF4ED] mx-auto mb-2">
    <Image
  src={getImageURL(book.thumbnail || "")}
  alt={book.title}
  fill
  className="object-cover rounded-xl"
  sizes="(max-width: 768px) 50vw, 175px"
  loading="lazy"
/>

    {/* Ảnh ẩn để clone bay vào giỏ */}
    <img
      ref={imgRef}
      src={getImageURL(book.thumbnail || "")}
      alt=""
      className="hidden"
    />
  </div>
</Link>



      <div className="text-center">
        <h3 className="font-semibold text-base truncate" title={book.title}>
          {book.title}
        </h3>

        {book.author && (
          <p className="text-xs truncate" title={book.author.name}>
            {book.author.name}
          </p>
        )}

        {book.publisher && (
          <p
            className="text-xs truncate"
            style={{ color: Colors.textDark }}
            title={book.publisher.name}
          >
            {book.publisher.name}
          </p>
        )}
        <p className="text-lg">{formatPrice(book.price)}</p>
      </div>

      <div className="flex justify-center gap-2 mt-2">
        {/* Nút thả tim luôn hiển thị */}
        {/* <button
          className="p-2 rounded-full text-red-400 border border-red-300 bg-white hover:bg-red-500 hover:text-white transition-all duration-300"
          title="Yêu thích"
          onClick={() => console.log("Thả tim", book.id)}
        >
          <FaHeart size={16} />
        </button> */}
        <button
          className="p-2 rounded-full text-white bg-green-600 hover:bg-green-700 transition-all duration-300"
          title="Mua ngay"
          onClick={handleBuyNowClick}
        >
          Mua ngay
        </button>

        {/* Nút giỏ hàng chỉ hiển thị nếu có hàm onAddToCart */}
        {onAddToCart && (
          <button
            className="p-2 rounded-full text-white transition-all duration-300"
            style={{
              backgroundColor: Colors.primaryDark,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = Colors.primaryDarker)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = Colors.primaryDark)
            }
            title="Thêm vào giỏ hàng"
            onClick={handleAddToCartClick}
          >
            <FaShoppingCart size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
