// Lưu token
export const setToken = (token: string) => {
  localStorage.setItem('access_token', token);
};

// ✅ Lấy token đúng key
export const getToken = (): string | null => {
  return localStorage.getItem('access_token');
};

// ✅ Xoá token đúng key
export const removeToken = () => {
  localStorage.removeItem('access_token');
};

// Lưu user
export const setUser = (user: any) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Lấy user
export const getUser = (): any | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Xoá user
export const removeUser = () => {
  localStorage.removeItem('user');
};
// export const getSessionId = (): string => {
//   if (typeof window === 'undefined') return 'server_generated_session'; // hoặc return crypto.randomUUID()

//   let sessionId = localStorage.getItem("guest_session_id");
//   if (!sessionId) {
//     sessionId = crypto.randomUUID();
//     localStorage.setItem("guest_session_id", sessionId);
//   }
//   return sessionId;
// };
//-> hàm getSessionId dùng sessionStorage:
export const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'server_generated_session';

  let sessionId = sessionStorage.getItem("guest_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("guest_session_id", sessionId);
  }
  return sessionId;
};
