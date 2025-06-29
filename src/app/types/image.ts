export const getImageURL = (path: string): string => {
  if (!path) return '/default-thumbnail.jpg'; // fallback khi không có ảnh
  return `http://localhost:8000/storage/${path}`;
};