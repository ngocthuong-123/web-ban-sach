"use client";

import { useState, useEffect, useCallback } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ProfileInfo from "./ProfileInfo";
import { getToken, removeToken } from "../../utils/storage";
import { decodeToken } from "../../utils/decodeToken";
import { useAppContext } from "../../context/AppContext";
import OrderSection from "@/app/components/OrderSection";

type Order = {
  id: number;
  order_code: string;
  status: string;
  created_at: string;
  total_price?: number;
};

type UserInfo = {
  id: number;
  name: string;
  email: string;
  detail?: {
    phone?: string;
    address?: string;
  };
  orders?: Order[];
};

export default function AccountPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAppContext();
  // const pendingOrders =
  //   user?.orders?.filter((o) => o.status === "pending") || [];
  
  const confirmedOrders =
    user?.orders?.filter((o) => o.status === "confirmed") || [];
  const shippingOrders =
    user?.orders?.filter((o) => o.status === "shipping") || [];
  const completedOrders =
    user?.orders?.filter((o) => o.status === "completed") || [];
  const canceledOrders =
    user?.orders?.filter((o) => o.status === "canceled") || [];

  const checkAuth = useCallback(() => {
    const token = getToken();
    console.log("🔐 Token:", token);

    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }

    const decoded = decodeToken(token);
    console.log("🧾 Decoded Token:", decoded);

    if (decoded && decoded.id && decoded.email) {
      setUser(decoded);
      setIsAuthenticated(true);
    } else {
      removeToken();
      setUser(null);
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLoginSuccess = () => {
    console.log("✅ Login success!");
    checkAuth();
  };

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
    setUser(null);
  };
  useEffect(() => {
    const fetchUserWithDetail = async () => {
      const token = getToken();
      if (!token) return;

      const decoded = decodeToken(token);
      if (!decoded || !decoded.id) return;

      try {
        const res = await fetch(
          `http://localhost:8000/api/users/${decoded.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const data = await res.json();
        console.log("👤 Thông tin user có detail:", data);
        setUser(data); // gán vào state
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
      }
    };

    fetchUserWithDetail();
  }, []);

  if (loading) return <p>Đang kiểm tra đăng nhập...</p>;

  if (!isAuthenticated) {
    return showRegister ? (
      <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <LoginForm
        key="login-form"
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  // return <ProfileInfo user={user!} onLogout={handleLogout} />;
  return (
    <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
      {/* Hàng 1: Thông tin người dùng */}
      <div>
        <ProfileInfo user={user!} onLogout={handleLogout} />
      </div>

      {/* Hàng 2: Hai cột hiển thị thông tin liên quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cột trái */}
        <div className="space-y-4">
          {/* <OrderSection title="Các đơn vừa tạo" orders={pendingOrders} /> */}
          <OrderSection title="Các đơn đã xác nhận" orders={confirmedOrders} />
          <OrderSection title="Đơn đang giao hàng" orders={shippingOrders} />
        </div>

        {/* Cột phải */}
        <div className="space-y-4">
          <OrderSection title="Đơn đã giao" orders={completedOrders} />
          <OrderSection title="Đơn đã hủy" orders={canceledOrders} />
          {/* <ReviewHistory reviews={reviews} /> */}
        </div>
      </div>
    </div>
  );
}
