import axios from "axios";
import { getToken, getSessionId  } from "../../utils/storage"; // đường dẫn tùy cấu trúc của bạn
import { apiURL } from "../../config";

export const checkUserOrders = async () => {
  const token = getToken();
  if (!token) throw new Error("Token không tồn tại");

  const response = await axios.get("http://localhost:8000/api/orders/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export const checkUserDetail = async () => {
  const token = getToken();
  if (!token) throw new Error("Token không tồn tại");

  const response = await axios.get("http://localhost:8000/api/user-detail", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
// export const checkUserDetail = async () => {
//   const token = getToken();
//   const sessionId = getSessionId();

//   const headers = token ? { Authorization: `Bearer ${token}` } : {};
//   const params = !token ? { session_id: sessionId } : {};

//   const response = await axios.get(`${apiURL}/user-detail`, {
//     headers,
//     params,
//   });

//   return response.data;
// };
export const fetchAutoApplyDiscounts = async (total: number) => {
  const res = await axios.post(`${apiURL}/discounts/auto-apply`, {
     apply_type: "total_price",
    order_total: total, // 👈 đổi lại đúng tên Laravel cần
  });
  return res.data; // Laravel đang trả về array chứ không phải { data: [...] }
};
export const confirmOrder = async (orderId: number) => {
  const res = await axios.post(`${apiURL}/orders/${orderId}/confirm`);
  return res.data.order;
};
export const getOrderById = async (orderId: number) => {
  const res = await axios.get(`${apiURL}/orders/${orderId}`);
  return res.data;
};
export const getGuestOrderById = async (id: number) => {
  const res = await axios.get(`${apiURL}/guest-order/${id}`);
  return res.data;
};
