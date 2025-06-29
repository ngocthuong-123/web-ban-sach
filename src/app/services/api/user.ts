// // services/api/user.ts
// import axios from 'axios';
// import { getToken } from '../../utils/storage';
// import { apiURL } from '../../config';

// export const fetchUserDetail = async () => {
//   const token = getToken();
//   if (!token) throw new Error('Unauthenticated');

//   const res = await axios.get(`${apiURL}/user-detail`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return res.data;
// };
// services/api/user.ts
import axios from 'axios';
import { getToken, getSessionId } from '../../utils/storage';
import { apiURL } from '../../config';

// export const fetchUserDetail = async () => {
//   const token = getToken();
//   const sessionId = getSessionId();

//   const headers = token ? { Authorization: `Bearer ${token}` } : {};
//   const params = !token ? { session_id: sessionId } : {};

//   const res = await axios.get(`${apiURL}/user-detail`, {
//     headers,
//     params,
//   });

//   return res.data;
// };
export const fetchUserDetail = async () => {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await axios.get(`${apiURL}/user-detail`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (e) {
    console.log("Không có user_detail hoặc token không hợp lệ");
    return null;
  }
};

export const getProvinceShippingFee = async (provinceId: number) => {
  const res = await axios.get(`${apiURL}/provinces`);
  const province = res.data.find((p: any) => p.id === provinceId);
  return province?.shipping_fee || 0;
};

export const getCurrentUser = async () => {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await fetch("http://localhost:8000/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Không lấy được thông tin người dùng");

    return await res.json();
  } catch (err) {
    console.error("Lỗi lấy user:", err);
    return null;
  }
};
