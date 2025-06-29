"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getSessionId, getToken } from "../../utils/storage";
import Image from "next/image";
import { getImageURL, apiURL } from "../../config";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../context/AppContext";
import { showError, showSuccess, showInfo } from "../../utils/toast";
import { checkUserDetail } from "../../services/api/orders";
import {
  fetchCart as fetchCartService,
  updateCartQuantity,
  removeCartItem,
  toggleCartItemStatus,
  createOrderFromCart,
  fetchCartGuest,
  createGuestOrderFromCart,
  toggleCartItemStatusGuest,
  updateCartItemQuantityGuest,
  removeGuestCartItem,
} from "../../services/api/cart";
import { fetchUserDetail } from "../../services/api/user";
import { fetchProvinces } from "../../services/api/province";
import CartList from "../../components/cart/CartList";
import CartSummary from "../../components/cart/CartSummary";
import { fetchAutoApplyDiscounts } from "../../services/api/orders"; // hoặc discount
import GuestDrawer from "../../components/cart/GuestDrawer";
import GuestOrderForm from "@/app/components/GuestOrderForm";
import { getCartCount, getGuestCartCount } from "@/app/services/api/header";
import OrderForm from "@/app/components/OrderForm";

interface Book {
  id: number;
  name: string;
  thumbnail: string;
  pricesale: number;
  price: number;
}

interface CartItem {
  id: number;
  book: Book;
  quantity: number;
  status: number;
}
type GuestInfo = {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
};
interface UserInfo {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
}
const CartPage = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [provinceId, setProvinceId] = useState<number | null>(null);
  const router = useRouter();
  const { user } = useAppContext();
  const { setCartCount } = useAppContext();
  const [autoDiscounts, setAutoDiscounts] = useState<any[]>([]);
  const [selectedDiscountCode, setSelectedDiscountCode] = useState<
    string | null
  >(null);
  const [showGuestDrawer, setShowGuestDrawer] = useState(false);
  const [showUserDrawer, setShowUserDrawer] = useState(false);
  // useEffect(() => {
  //   return () => {
  //     // gọi API dọn dẹp
  //     axios.post(`${apiURL}/cart/cleanup`, {}, {
  //       headers: {
  //         Authorization: `Bearer ${getToken()}`,
  //       }
  //     }).catch((err) => console.error("Cleanup failed", err));
  //   };
  // }, []);

  const fetchCart = async () => {
    try {
      let data;
      console.log("🧑‍💻 User hiện tại:", user);
      if (user) {
        data = await fetchCartService();
      } else {
        const { items: guestItems } = await fetchCartGuest();
        data = { items: guestItems };
      }
      console.log("🧾 Giỏ hàng lấy được:", data);
      setItems(data.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };
  const updateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      const token = getToken(); // hoặc localStorage.getItem('access_token')

      if (token) {
        await updateCartQuantity(itemId, newQuantity);
      } else {
        await updateCartItemQuantityGuest(itemId, newQuantity);
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        showError(
          error.response.data.message || "Không đủ tồn kho để cập nhật số lượng"
        );
      } else {
        console.error("Lỗi cập nhật số lượng:", error);
      }
    }
  };
  const removeItem = async (itemId: number) => {
    try {
      const token = getToken();
      const sessionId = getSessionId();

      // Cập nhật giỏ hàng
      if (token) {
        await removeCartItem(itemId); // Đã đăng nhập
        const count = await getCartCount();
        setCartCount(count);
      } else {
        await removeGuestCartItem(itemId); // Khách
        const count = await getGuestCartCount();
        setCartCount(count);
      }

      // Cập nhật danh sách hiển thị
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Lỗi xoá sản phẩm khỏi giỏ hàng:", error);
    }
  };
  const updateStatus = async (itemId: number, newStatus: number) => {
    try {
      const token = getToken(); // hoặc localStorage.getItem('access_token')

      if (token) {
        await toggleCartItemStatus(itemId, newStatus);
      } else {
        await toggleCartItemStatusGuest(itemId, newStatus);
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      console.error("Toggle status error:", err);
    }
  };
  const handleCheckboxChange = (itemId: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    updateStatus(itemId, newStatus);
  };

  const total = items
    .filter((item) => item.status === 1)
    .reduce((acc, item) => acc + item.book.price * item.quantity, 0);

  const handleConfirmOrder = async () => {
    const selectedItemIds = items
      .filter((item) => item.status === 1)
      .map((item) => item.id);

    if (selectedItemIds.length === 0) {
      showInfo("Bạn chưa chọn sản phẩm nào.");
      return;
    }

    const token = getToken();

    if (token && user) {
      // 👉 User đã đăng nhập → mở form OrderForm
      setShowUserDrawer(true);
    } else {
      // 👉 Guest → mở GuestOrderForm
      setShowGuestDrawer(true);
    }
  };

  const fetchUserProvince = async () => {
    try {
      const userDetail = await fetchUserDetail();
      const userProvinceId = userDetail?.province_id;
      setProvinceId(userProvinceId);
    } catch (error) {
      console.error("Error fetching user detail:", error);
    }
  };
  const fetchProvincesAndSetShipping = async (userProvinceId: number) => {
    try {
      const provinces = await fetchProvinces();
      const province = provinces.find((p: any) => p.id === userProvinceId);
      if (province) {
        setShippingFee(province.shipping_fee);
      }
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchAutoDiscounts = async () => {
    try {
      const res = await fetchAutoApplyDiscounts(total); // truyền order_total
      setAutoDiscounts(res || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách giảm giá:", error);
    }
  };
  const calculateDiscountedTotal = () => {
    if (!selectedDiscountCode) return total;

    const discount = autoDiscounts.find((d) => d.code === selectedDiscountCode);
    if (!discount) return total;

    if (discount.type === "percentage") {
      const percent = discount.value;
      return Math.max(0, total - total * (percent / 100));
    } else if (discount.type === "fixed") {
      return Math.max(0, total - discount.value);
    }

    return total;
  };

  useEffect(() => {
    fetchCart();
    const getShippingFee = async () => {
      await fetchUserProvince();
    };
    getShippingFee();
  }, []);

  useEffect(() => {
    if (provinceId !== null) {
      fetchProvincesAndSetShipping(provinceId);
    }
  }, [provinceId]);
  useEffect(() => {
    if (total > 0) {
      fetchAutoDiscounts();
    }
  }, [total]);

  const handleSelectAll = async () => {
    const promises = items
      .filter((item) => item.status !== 1)
      .map((item) => updateStatus(item.id, 1));

    await Promise.all(promises);
  };

  const handleDeselectAll = async () => {
    const promises = items
      .filter((item) => item.status !== 0)
      .map((item) => updateStatus(item.id, 0));

    await Promise.all(promises);
  };
  const handleGuestOrder = async (guestInfo: GuestInfo) => {
    const selectedItems = items
      .filter((item) => item.status === 1)
      .map((item) => ({
        book_id: item.book.id,
        quantity: item.quantity,
      }));

    if (selectedItems.length === 0) {
      showInfo("Bạn chưa chọn sản phẩm nào.");
      return;
    }
    setLoading(true);
    try {
      const orderData = await createGuestOrderFromCart(
        selectedItems,
        guestInfo
      );
      showSuccess("Đơn hàng đã được tạo thành công!");
      router.push(`/checkout/${orderData.id}`);
      setShowGuestDrawer(false);
      console.log("Order info:", orderData);
      await fetchCart(); // hoặc refetch nếu dùng react-query
    } catch (error: any) {
      setLoading(false);
      showError(
        error.response?.data?.message ||
          "Đã xảy ra lỗi khi tạo đơn hàng, vui lòng thử lại."
      );
    }
  };
  const handleOrder = async (userInfo: UserInfo) => {
    const selectedCartItemIds = items
      .filter((item) => item.status === 1)
      .map((item) => item.id); // Lấy cart item ID

    // ✅ Kiểm tra trước khi gửi API
    if (selectedCartItemIds.length === 0) {
      showInfo("Bạn chưa chọn sản phẩm nào.");
      return;
    }

    setLoading(true);

    try {
      const orderData = await createOrderFromCart(selectedCartItemIds);
      showSuccess("Đơn hàng đã được tạo thành công!");
      await cleanupBuyNowCart();
      router.push(`/checkout/${orderData.id}`);
      setShowUserDrawer(false);
      await fetchCart();
    } catch (error: any) {
      showError(
        error.response?.data?.message ||
          "Đã xảy ra lỗi khi tạo đơn hàng, vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };
  const cleanupBuyNowCart = async () => {
    try {
      const token = getToken();
      if (!token) return;

      await axios.post(
        `${apiURL}/cart/cleanup`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Đã cleanup cart type buy_now");
    } catch (err) {
      console.error("❌ Cleanup failed:", err);
    }
  };
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="flex items-center justify-between md:col-span-3 mb-4">
  <div className="text-gray-600 font-medium text-lg">Giỏ hàng 🛒</div>
  <button
    className="bg-gray-300 hover:bg-gray-400 text-sm text-gray-800 px-3 py-1 rounded"
    onClick={async () => {
      await cleanupBuyNowCart(); // nếu bạn muốn xoá cart "buy_now" khi rời
      router.back(); // quay về trang trước
    }}
  >
    ← Quay lại
  </button>
</div>
      <CartList
        items={items}
        onQuantityChange={updateQuantity}
        onRemove={removeItem}
        onToggleStatus={updateStatus}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
      />
      <CartSummary
        total={calculateDiscountedTotal()}
        originalTotal={total}
        shippingFee={shippingFee ?? 0}
        loading={loading}
        onConfirm={handleConfirmOrder}
        discounts={autoDiscounts}
        selectedDiscountCode={selectedDiscountCode}
        onDiscountSelect={setSelectedDiscountCode}
      />
      <GuestOrderForm
        open={showGuestDrawer}
        onClose={() => setShowGuestDrawer(false)}
        onConfirm={handleGuestOrder}
        loading={loading}
      />
      <OrderForm
        open={showUserDrawer}
        onClose={() => setShowUserDrawer(false)}
        onConfirm={handleOrder}
        loading={loading}
      />
    </div>
  );
};

export default CartPage;
