// services/api/banner.ts
import axios from "axios";
import { apiURL } from "../../config";

export const getBanners = () => {
  return axios.get(`${apiURL}/banners`);
};
