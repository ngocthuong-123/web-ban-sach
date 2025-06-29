// import jwt_decode from 'jwt-decode';

// export const decodeToken = <T>(token: string): T | null => {
//   try {
//     return jwt_decode<T>(token);
//   } catch (error) {
//     console.error('Lỗi decode token:', error);
//     return null;
//   }
// };
import jwt_decode from "jwt-decode";

type DecodedToken = {
  id: number;
  name: string;
  email: string;
  role: string;
  exp?: number;
};

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwt_decode(token);
  } catch (error) {
    console.error("Lỗi giải mã token:", error);
    return null;
  }
};
