import axios from "axios";
const BASE_URL = "http://localhost:8000/api";

export const getPromotionalBooks = () => {
  return axios.get(`${BASE_URL}/promotions`);
};

export const getLatestBooks = (page: number, perPage: number) => {
  return axios.get(`${BASE_URL}/latest?page=${page}&per_page=${perPage}`);
};

// export const getBooksByCategory = (
//   slug: string,
//   page: number,
//   perPage: number
// ) => {
//   return axios.get(
//     `${BASE_URL}/getBooksByCategory/${slug}?page=${page}&per_page=${perPage}`
//   );
// };
export const getBooksByCategory = (slug: string, p0: number, p1: number) => {
  return axios.get(`${BASE_URL}/getBooksByCategory/${slug}`);
};
export async function getOtherBookIds(slug: string) {
  return axios.get(`${BASE_URL}/books/other-book-ids/${slug}`);
}
export async function getBooksByIds(ids: number[]) {
  return axios.post(`${BASE_URL}/books/by-ids', { ids }`);
}
export async function getOtherBooksByCategory(slug: string) {
  const response = await axios.get(`${BASE_URL}/books/other-books/${slug}`);
  return response.data;
}
export async function getBookBySlug(slug: string) {
  return axios.get(`${BASE_URL}/books/slug/${slug}`);
}
export const getBooksBySearch = async (query: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/getAll`, {
      params: { search: query }
    });
    return res;
  } catch (err) {
    console.error("Error fetching search results:", err);
    return null;
  }
};