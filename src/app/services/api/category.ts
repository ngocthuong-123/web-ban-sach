import axios from "axios";
const BASE_URL = "http://localhost:8000/api";

export const getCategories = () => {
  return axios.get(`${BASE_URL}/categories`);
};