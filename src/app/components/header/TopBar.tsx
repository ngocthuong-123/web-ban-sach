import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaUser,
  FaShoppingCart,
  FaHeart,
  FaSearch,
  FaBell,
} from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";
import { useSearchContext } from "../../context/SearchContext";
import Colors from "../../utils/colors";
import axios from "axios";
type TopBarProps = {
  onSearch?: (query: string) => void;
};
export default function TopBar({ onSearch }: TopBarProps) {
  const { cartCount, user, logout } = useAppContext();
  const [input, setInput] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const { searchQuery, setSearchQuery, handleSearch } = useSearchContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(input);
  };
  // console.log("TopBar user:", user);
  // console.log("TopBar cartCount:", cartCount);
  console.log("🛒 cartCount from context:", cartCount);


  // ✅ Lấy số lượng thông báo chưa đọc
  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("access_token");
      if (!token || !user) return;

      try {
        const res = await axios.get("http://localhost:8000/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const unread = (res.data || []).filter(
          (n: { read_at: string | null }) => n.read_at === null
        );
        setNotificationCount(unread.length);
      } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
      }
    };

    fetchNotifications();
  }, [user]);
  if (cartCount === null) return null;
  return (
    <div className="bg-[#D8CAB8] text-black">
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-3 px-4 gap-5">
          <div className="basis-2/12">
            <Link
              href="/"
              className={`text-2xl font-bold tracking-wide text-[${Colors.textDark}]`}
            >
              <h1 className="text-4xl">NGOCTHUONG</h1>
            </Link>
          </div>
          <div className="basis-6/12">
            {/* <form className="relative" onSubmit={handleSubmit}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tìm kiếm sách, truyện, sản phẩm..."
                className="w-full h-12 px-3 rounded-2xl border border-gray-500 bg-white text-[#2f302b] placeholder-[#4a5a4b]"
              />
              <button className="absolute right-0 top-0 h-12 px-3">
                <FaSearch />
              </button>
            </form> */}
            <form
              className="relative"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch(searchQuery); // dùng searchQuery của context
              }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sách, truyện, sản phẩm..."
                className="w-full h-12 px-3 rounded-2xl border border-gray-500 bg-white text-[#2f302b] placeholder-[#4a5a4b]"
              />
              <button className="absolute right-0 top-0 h-12 px-3">
                <FaSearch />
              </button>
            </form>
          </div>
          <div className="basis-3/12">
            <div className="flex justify-end items-center space-x-4 text-sm">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className={`text-[${Colors.textLight}]`}>
                    Xin chào, {user.name}
                  </span>
                  <button
                    onClick={logout}
                    className={`bg-[${Colors.accent}] text-[${Colors.textDark}] px-2 py-1 rounded hover:bg-[${Colors.accentHover}]`}
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <Link
                  href="/account"
                  className={`text-xl text-[${Colors.textDark}] hover:text-[${Colors.textLight}]`}
                >
                  <FaUser />
                </Link>
              )}
              <Link
                href="/cart"
                className={`relative text-xl text-[${Colors.textDark}] hover:text-[${Colors.textLight}]`}
              >
                <div id="cart-icon" className="relative z-50">
                  <FaShoppingCart className="text-2xl text-gray-800" />
                </div>
                {cartCount > 0 && (
                  <span className="absolute -top-4 -right-4 w-5 h-5 bg-yellow-400 text-black rounded-full text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link
                href="/notifications"
                className={`relative text-xl text-[${Colors.textDark}] hover:text-[${Colors.textLight}]`}
              >
                <div id="notification-icon" className="relative z-50">
                  <FaBell className="text-2xl text-gray-800" />
                </div>
                {notificationCount > 0 && (
                  <span className="absolute -top-4 -right-4 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Link>
              <Link
                href="/wishlist"
                className={`relative text-xl text-[${Colors.textDark}] hover:text-[${Colors.textLight}]`}
              >
                <div id="wishlist-icon" className="relative z-50">
                  <FaHeart className="text-2xl text-gray-800" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
