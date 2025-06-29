// import jwtDecode from "jwt-decode";

// export function getRoleFromToken(): string | null {
//   if (typeof window === "undefined") return null;

//   const token = localStorage.getItem("token");
//   if (!token) {
//     console.log("🔴 Token not found in localStorage");
//     return null;
//   }

//   try {
//     const decoded: any = jwtDecode(token);
//     console.log("🧾 Decoded token inside getRoleFromToken:", decoded);
//     return decoded.role ?? null;
//   } catch (error) {
//     console.error("❌ Failed to decode token:", error);
//     return null;
//   }
// }
import { getToken } from "@/app/utils/storage";
import jwtDecode from "jwt-decode"; // hoặc import đúng đường dẫn tới hàm getToken

export function getRoleFromToken(): string | null {
  if (typeof window === "undefined") return null;

  const token = getToken(); // ĐÚNG KEY
  if (!token) {
    console.log("🔴 Token not found in localStorage");
    return null;
  }

  try {
    const decoded: any = jwtDecode(token);
    console.log("🧾 Decoded token inside getRoleFromToken:", decoded);
    return decoded.role ?? null;
  } catch (error) {
    console.error("❌ Failed to decode token:", error);
    return null;
  }
}
