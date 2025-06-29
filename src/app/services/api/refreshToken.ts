import { setToken } from "../../utils/storage";
import { apiURL } from "../../config";

export async function refreshToken(): Promise<string | null> {
  try {
    const res = await fetch(`${apiURL}/refresh`, {
      method: "POST",
      credentials: "include", // quan trọng: gửi cookie nếu có
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.warn("⚠️ Refresh token thất bại");
      return null;
    }

    const data = await res.json();

    if (data.access_token) {
      setToken(data.access_token);
      return data.access_token;
    }

    return null;
  } catch (error) {
    console.error("❌ Lỗi khi gọi refreshToken:", error);
    return null;
  }
}
