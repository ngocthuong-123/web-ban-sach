import axios from 'axios';
import { apiURL } from '../../src/app/config';

export async function fetchBooks(search: string = '') {
  try {
    const response = await axios.get(`${apiURL}/getAll`, {
      params: { search }
    });

    return response.data.data; // vì backend trả về { success: true, data: [...] }
  } catch (error) {
    console.error("Lỗi khi fetch sách:", error);
    return []; // hoặc throw error nếu muốn xử lý ở component
  }
}
