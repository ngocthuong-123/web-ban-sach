import React, { useRef } from "react";
import Link from "next/link";
import { formatPrice, getImageURL } from "../config";
import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/navigation";
import Colors from "../utils/colors";
// Thêm nếu bạn cần
import { FaShoppingCart } from "react-icons/fa";
import { buyNowUser, addToCartBuyNow } from "../services/api/cart";
import { getSessionId } from "../utils/storage";
import Image from "next/image";
interface Discount {
  discount_id: number;
  discount_code: string;
  discount_value: string;
  discount_type: string;
  discount_description: string;
  discount_start_date: string;
  discount_end_date: string;
}

interface PromoBookCardProps {
  book: {
    id: number;
    title: string;
    slug: string;
    thumbnail?: string;
    pricesale?: number;
    price: number;
    final_price?:number;
    author?: { name: string };
    publisher?: { name: string };
    discounts?: Discount[]; // thêm ? để tránh lỗi nếu thiếu
  };
  onAddToCart?: (bookId: number) => void;
}

export default function PromoBookCard({
  book,
  onAddToCart,
}: PromoBookCardProps) {
  const { cartCount, setCartCount } = useAppContext();
  const imgRef = useRef<HTMLImageElement>(null);
  const router = useRouter();

  const handleBuyNowClick = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const sessionId = getSessionId();
      if (token) {
        await buyNowUser(book.id, 1);
      } else {
        await addToCartBuyNow(book.id, 1, sessionId);
      }
      router.push("/cart");
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
      className="h-full flex flex-col py-2 justify-between bg-[#FFF8F2] shadow relative transition-transform duration-300 
            transform-gpu hover:scale-103 
            "
      style={{
        backgroundColor: Colors.primaryLight,
        color: Colors.textDark,
        border: `1px solid ${Colors.primary}`,
      }}
    >
<Link href={`/books/${book.slug}`} className="relative block">
  <div className="relative w-[214px] aspect-[214/335] overflow-hidden rounded-xl bg-white mx-auto mb-2">
    {/* Ảnh chính dùng next/image */}
    <Image
      src={getImageURL(book.thumbnail || "")}
      alt={book.title}
      fill
      className="object-cover rounded-xl"
      sizes="(max-width: 768px) 100vw, 214px"
      loading="lazy" // preload ảnh đầu tiên
    />

    {/* Clone ảnh HTML để dùng cho animation thêm vào giỏ hàng */}
    <img
      ref={imgRef}
      src={getImageURL(book.thumbnail || "")}
      alt=""
      className="hidden"
    />
  </div>

  {/* Badge khuyến mãi (giữ nguyên) */}
  {book.discounts && book.discounts.length > 0 && (
    <div className="absolute top-2 right-2 z-10">
      {book.discounts.map((discount, i) => (
        <span
          key={discount.discount_id}
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white"
          style={{ marginLeft: i > 0 ? 6 : 0 }}
          title={discount.discount_description}
        >
          {discount.discount_type === "percentage"
            ? `-${parseFloat(discount.discount_value)}%`
            : `-${formatPrice(parseFloat(discount.discount_value))}`}
        </span>
      ))}
    </div>
  )}
</Link>

      <div className="text-center">
        <h3 className="font-semibold text-base truncate" title={book.title}>
          {book.title}
        </h3>

        {/* --- Thêm badge giảm giá ở đây --- */}
        {/* {book.discounts && book.discounts.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 mb-1">
            {book.discounts.map((discount) => (
              <span
                key={discount.discount_id}
                className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded"
                title={discount.discount_description}
              >
                {discount.discount_code}: Giảm {discount.discount_value}
                {discount.discount_type === "percentage" ? "%" : "đ"}
              </span>
            ))}
          </div>
        )} */}
        {/* --- Kết thúc badge giảm giá --- */}

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

        {/* Nếu có giá khuyến mãi thì hiển thị giá sale và giá gạch ngang */}
        {/* {book.pricesale && book.pricesale > 0 ? (
          <>
            <p className="text-lg text-red-600 font-bold">
              {formatPrice(book.pricesale)}
            </p>
            <p className="line-through text-gray-400 text-sm">
              {formatPrice(book.price)}
            </p>
          </>
        ) : (
          <p className="text-lg">{formatPrice(book.price)}</p>
        )} */}
        {book.final_price && book.final_price < book.price ? (
  <>
    <p className="text-lg text-red-600 font-bold">
      {formatPrice(book.final_price)}
    </p>
    <p className="line-through text-gray-400 text-sm">
      {formatPrice(book.price)}
    </p>
  </>
) : (
  <p className="text-lg font-semibold">{formatPrice(book.price)}</p>
)}

      </div>

      <div className="flex justify-center gap-2 mt-2">
        <button
          className="p-2 rounded-full text-white bg-green-600 hover:bg-green-700 transition-all duration-300"
          title="Mua ngay"
          onClick={handleBuyNowClick}
        >
          Mua ngay
        </button>

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
