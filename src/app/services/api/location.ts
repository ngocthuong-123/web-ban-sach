import axios from "axios";
import { apiURL } from "../../config";
export interface Province {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
}

export interface Ward {
  id: number;
  name: string;
}

export async function fetchProvinces(): Promise<Province[]> {
  const res = await axios.get(`${apiURL}/provinces`);
  return res.data;
}

export async function fetchDistricts(province_id: number): Promise<District[]> {
  const res = await axios.get(`${apiURL}/districts`, {
    params: { province_id },
  });
  return res.data;
}

export async function fetchWards(district_id: number): Promise<Ward[]> {
  const res = await axios.get(`${apiURL}/wards`, {
    params: { district_id },
  });
  return res.data;
}