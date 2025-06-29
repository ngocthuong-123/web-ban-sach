// URL của API backend
export const apiURL = 'http://localhost:8000/api';
export const URL = 'http://localhost:3000';

// URL dùng để truy cập ảnh từ thư mục storage Laravel
export const imageURL = 'http://localhost:8000/storage';

// Hàm sinh URL đầy đủ cho ảnh, có fallback nếu không có ảnh
export const getImageURL = (path: string): string => {
  return path ? `${imageURL}/${path}` : '/default-thumbnail.jpg';
};
// export const getImageURL = (path: string): string => {
//   if (!path) return '/default-thumbnail.jpg';

//   const isCloudinary = path.includes('res.cloudinary.com') || !path.includes('.');

//   if (isCloudinary) {
//     const cloudName = "dfbfmzt19";
//     return `https://res.cloudinary.com/${cloudName}/image/upload/w_745,q_80,f_auto/${path}`;
//   } else {
//     // ảnh từ server nội bộ
//     // const imageURL = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:8000/storage';
//     return path ? `${imageURL}/${path}` : '/default-thumbnail.jpg';
//   }
// };

// Hàm định dạng số tiền theo kiểu Việt Nam
// export const formatPrice = (price: number): string => {
//   return price.toLocaleString('vi-VN') + ' đ';
// };
export const formatPrice = (price?: number | null): string => {
  if (typeof price !== 'number' || isNaN(price)) {
    return 'Đang cập nhật';
  }
  return price.toLocaleString('vi-VN') + ' đ';
};
