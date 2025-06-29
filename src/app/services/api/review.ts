// review.ts

import axios from 'axios';
import { apiURL } from '../../config';

const reviewBaseURL = `${apiURL}/reviews`;
export const getReviewsByBookId = async (bookId: number) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/reviews?book_id=${bookId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy tất cả review
export const getAllReviews = async () => {
  try {
    const response = await axios.get(reviewBaseURL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Tạo hoặc cập nhật review cho 1 sách
export const submitReview = async (data: {
  book_id: number;
  rating: number;
  content?: string;
}) => {
  try {
    const response = await axios.post(reviewBaseURL, data, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy review người dùng cho 1 sách
export const getUserReviewForBook = async (bookId: number) => {
  try {
    const response = await axios.get(`${reviewBaseURL}/${bookId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// Cập nhật review theo ID
export const updateReview = async (reviewId: number, data: {
  rating?: number;
  content?: string;
}) => {
  try {
    const response = await axios.put(`${reviewBaseURL}/${reviewId}`, data, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Xoá review
export const deleteReview = async (reviewId: number) => {
  try {
    const response = await axios.delete(`${reviewBaseURL}/${reviewId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};
