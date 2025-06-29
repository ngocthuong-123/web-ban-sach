// services/api/header.ts
import { Menu } from "../../types/Menu";
import { Category } from "../../types/Category";
import { getSessionId, getToken, setToken } from "../../utils/storage";
import { apiURL } from "../../config"; // Đảm bảo bạn có file config.ts với API_URL
import { refreshToken } from "./refreshToken";
import axios from "axios";

export async function getMenus(): Promise<Menu[]> {
  try {
    const res = await fetch(`${apiURL}/menus`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Lỗi khi lấy menu");
    return await res.json();
  } catch (error) {
    console.error("Lỗi getMenus:", error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${apiURL}/categories`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Lỗi khi lấy categories");
    return await res.json();
  } catch (error) {
    console.error("Lỗi getCategories:", error);
    return [];
  }
}
export async function getCartCount(): Promise<number> {
  if (typeof window === "undefined") return 0;

  const token = getToken();
  if (!token) return 0;

  try {
    let res = await fetch("http://localhost:8000/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      const newToken = await refreshToken();
      if (!newToken) return 0;

      res = await fetch("http://localhost:8000/api/cart", {
        headers: { Authorization: `Bearer ${newToken}` },
      });
    }

    if (!res.ok) return 0;

    const data = await res.json();
    return data.items.reduce((total: number, item: any) => total + item.quantity, 0);
  } catch (err) {
    console.error("Lỗi getCartCount:", err);
    return 0;
  }
  
}
// export async function getGuestCartCount(sessionId: string): Promise<number> {
//   const res = await axios.get(`${apiURL}/cart/guest/count`, {
//     params: { session_id: sessionId },
//   });
//   const items = res.data.items || [];
//   return items.reduce((total: number, item: any) => total + (item.quantity || 0), 0);
// }

export async function getGuestCartCount(): Promise<number> {
  const sessionId = getSessionId();

  try {
    const res = await axios.get(`${apiURL}/cart/guest/count`, {
      params: { session_id: sessionId },
    });

    return parseInt(res.data.count || "0", 10);
  } catch (err: any) {
    console.error("Lỗi khi lấy tổng số lượng giỏ hàng của khách:", err.response?.data || err.message);
    return 0;
  }
}