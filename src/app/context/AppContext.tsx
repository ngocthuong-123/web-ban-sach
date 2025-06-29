"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getSessionId, getToken, getUser, removeToken, removeUser } from "../utils/storage";
import { getCartCount, getGuestCartCount } from "../services/api/header";
import { useRouter } from "next/navigation";
import { apiURL } from "../config";

type User = {
  id: number;
  name: string;
  email: string;
  // Thêm các fields khác của user tại đây
};
type CartItem = {
  id: number;
  book_id: number;
  quantity: number;
  book: {
    id: number;
    title: string;
    slug: string;
    thumbnail: string;
    // Các trường khác nếu cần
  };
};

type AppContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  cartCount: number;
  setCartCount: (count: number) => void;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  refreshCartCount: () => Promise<void>;

};

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const router = useRouter();

  // Tải thông tin user từ token
  const loadUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const response = await fetch(`${apiURL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Unauthorized");

      const userData = await response.json();
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Authentication error:", error);
      await logout();
    }
  }, []);

  // Tải số lượng giỏ hàng
  const loadCartCount = useCallback(async () => {
    try {
      const sessionId = getSessionId();
console.log("🔐 sessionId used in getGuestCartCount:", sessionId);

      const count = getToken() 
        ? await getCartCount() 
        : await getGuestCartCount();
      
      setCartCount(count || 0);
    } catch (error) {
      console.error("Failed to load cart count:", error);
      setCartCount(0);
    }
  }, []);

  // Xử lý logout
  const logout = useCallback(async () => {
    removeToken();
    removeUser();
    setUser(null);
    setCartCount(0);
    await router.push("/");
  }, [router]);

  // Khởi tạo dữ liệu
  useEffect(() => {
    const initialize = async () => {
      const storedUser = getUser();
      if (storedUser && getToken()) {
        setUser(storedUser);
      } else {
        await loadUser();
      }
      await loadCartCount();
    };

    initialize();
  }, [loadUser, loadCartCount]);

  return (
    <AppContext.Provider value={{ 
      user, 
      setUser, 
      cartCount, 
      setCartCount, 
      logout,
      loadUser,
       refreshCartCount: loadCartCount,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};