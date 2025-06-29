import axios from "axios";
import { apiURL } from "../../config";
import { getToken, getSessionId } from "../../utils/storage";
const sessionId = getSessionId();
// Thêm sách vào giỏ hàng
// export const addToCart = async (bookId: number, quantity: number = 1) => {
//   const token = getToken();
//   console.log("🔑 Token trong addToCart:", token); // Debug

// if (!token) {
//   throw new Error("Unauthenticated");
// }

//   return axios.post(
//     `${apiURL}/cart/add`,
//     { book_id: bookId, quantity },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
// };
export const addToCart = async (bookId: number, quantity: number = 1) => {
  const token = localStorage.getItem("access_token");
  const sessionId = getSessionId(); // Lấy từ localStorage hoặc tự tạo nếu chưa có

  // Không ném lỗi nếu không có token
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const params = !token && sessionId ? { session_id: sessionId } : {};

  return axios.post(
    `${apiURL}/cart/add`,
    { book_id: bookId, quantity },
    {
      headers,
      params,
    }
  );
};
export const buyNowUser = async (bookId: number, quantity: number = 1) => {
  const token = localStorage.getItem("access_token");

  const response = await axios.post(
    "http://localhost:8000/api/cart/buy-now-user",
    {
      book_id: bookId,
      quantity,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// Lấy danh sách giỏ hàng
// export const fetchCart = async () => {
//   const token = localStorage.getItem("access_token");
// if (!token) {
//   throw new Error("Unauthenticated");
// }

//   const res = await axios.get(`${apiURL}/cart`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       withCredentials: true,
//     },
//   });

//   return res.data;
// };
export async function fetchCart() {
  const token = localStorage.getItem("access_token");

  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await axios.get(`${apiURL}/cart`, {
      headers,
    });

    return res.data;
  } catch (err: any) {
    console.error("Lỗi lấy giỏ hàng:", err.response?.data || err.message);
    throw err;
  }
}
export async function fetchCartGuest() {
  const sessionId = getSessionId(); // đảm bảo luôn có session

  try {
    const res = await axios.get(`${apiURL}/cart/guest`, {
      params: {
        session_id: sessionId,
      },
    });

    return res.data;
  } catch (err: any) {
    console.error(
      "Lỗi lấy giỏ hàng khách vãng lai:",
      err.response?.data || err.message
    );
    throw err;
  }
}
// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = async (bookId: number, quantity: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Unauthenticated");
  }

  return axios.put(
    `${apiURL}/cart/update/${bookId}`,
    { quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
// Xoá 1 sản phẩm khỏi giỏ hàng
export const removeFromCart = async (bookId: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Unauthenticated");
  }

  return axios.delete(`${apiURL}/cart/remove/${bookId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const fetchCartItem = async (id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Unauthenticated");
  }

  const response = await fetch(`${apiURL}/cart/item/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text(); // Gợi ý debug chi tiết hơn
    console.error("Lỗi fetchCartItem:", response.status, errorText);
    throw new Error(`Lỗi khi lấy item ${id}`);
  }

  return await response.json();
};
export const updateCartQuantity = async (itemId: number, quantity: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Unauthenticated");
  }

  const res = await axios.put(
    `${apiURL}/cart/update-quantity/${itemId}`,
    { quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
// Hàm xoá 1 item khỏi giỏ hàng
export const removeCartItem = async (itemId: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Unauthenticated");
  }

  await axios.delete(`${apiURL}/cart/remove/${itemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const toggleCartItemStatus = async (
  itemId: number,
  newStatus: number
) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Unauthenticated");
  }

  await axios.put(
    `${apiURL}/cart/toggle-status/${itemId}`,
    { status: newStatus },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const createOrderFromCart = async (cartItemIds: number[]) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Unauthenticated");
console.log("cart_item_ids to send:", cartItemIds);
console.log("typeof cartItemIds:", typeof cartItemIds); // phải là 'object'
console.log("Array.isArray(cartItemIds):", Array.isArray(cartItemIds)); // phải là true
console.log("cartItemIds:", cartItemIds); // nên là [23]

  const res = await axios.post(
    `${apiURL}/from-cart`,
    { cart_item_ids: cartItemIds, },
    
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return res.data;
};

export const createGuestOrderFromCart = async (
  cartItems: { book_id: number; quantity: number }[],
  guestInfo: any
) => {
  const res = await axios.post(`${apiURL}/guest-order`, {
    session_id: sessionId,
    cart_items: cartItems,
    customer_name: guestInfo.customer_name,
    customer_phone: guestInfo.customer_phone,
    customer_email: guestInfo.customer_email,
    customer_address: guestInfo.customer_address,
  });

  return res.data;
};

export const updateStatus = async (itemId: number, newStatus: number) => {
  const token = getToken();
  await axios.put(
    `${apiURL}/cart/toggle-status/${itemId}`,
    { status: newStatus },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
export const confirmOrder = async (cart_item_ids: number[]) => {
  const token = getToken();
  const res = await axios.post(
    `${apiURL}/from-cart`,
    { cart_item_ids },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}; // hoặc axios trực tiếp nếu không dùng wrapper

// export const addToCartGuest = async (bookId: number, quantity: number, sessionId: string) => {
//   return axios.post(`${apiURL}/cart/add-guest`, {
//     book_id: bookId,
//     quantity,
//   }, {
//     headers: {
//       'X-Session-ID': sessionId
//     }
//   });
// };
export const addToCartGuest = (
  bookId: number,
  quantity: number,
  sessionId: string
) => {
  return axios.post(`${apiURL}/cart/add-guest`, {
    book_id: bookId,
    quantity,
    session_id: sessionId, // 👈 giống hệt Postman
  });
};

export const addToCartBuyNow = async (
  bookId: number,
  quantity: number,
  sessionId: string
) => {
  const response = await axios.post(`${apiURL}/cart/buy-now`, {
    book_id: bookId,
    quantity,
    session_id: sessionId,
  });

  return response.data;
};
export const buyNowGuest = async (bookId: number, quantity: number = 1) => {
  const sessionId = getSessionId();

  const response = await axios.post(
    "http://localhost:8000/api/cart/buy-now", // API cho guest
    {
      book_id: bookId,
      quantity,
      session_id: sessionId,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
//đã cập nhật
export const toggleCartItemStatusGuest = async (
  itemId: number,
  newStatus: number
) => {
  const sessionId = getSessionId();

  await axios.put(`${apiURL}/cart/toggle-status-guest/${itemId}`, {
    session_id: sessionId,
    status: newStatus,
  });
};
//đã cập nhật
export const updateCartItemQuantityGuest = async (
  itemId: number,
  quantity: number
) => {
  const sessionId = getSessionId();

  await axios.put(`${apiURL}/cart/update-quantity-guest/${itemId}`, {
    session_id: sessionId,
    quantity,
  });
};
//
export const removeGuestCartItem = async (itemId: number) => {
  const sessionId = getSessionId();

  await axios.delete(`${apiURL}/cart/remove-guest/${itemId}`, {
    data: {
      session_id: sessionId,
    },
  });
};
//
export const clearGuestCart = async () => {
  const sessionId = getSessionId();

  await axios.post(`${apiURL}/cart/clear-guest`, {
    session_id: sessionId,
  });
};
//
export const fetchGuestCartItem = async (itemId: number) => {
  const sessionId = getSessionId();

  const res = await axios.post(`${apiURL}/cart/item-guest/${itemId}`, {
    session_id: sessionId,
  });

  return res.data;
};
