import axios from 'axios';
// import { getToken } from '../../utils/storage';
import { apiURL } from '../../config';

export const fetchProvinces = async () => {
  const res = await axios.get(`${apiURL}/provinces`);
  return res.data;
};