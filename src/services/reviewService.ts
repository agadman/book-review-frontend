import axios from "axios";
import type { CreateReviewData, Review } from "../types/review";

const API_URL = `${import.meta.env.VITE_API_URL}/reviews`;

export const createReview = async (
  data: CreateReviewData,
  token: string
): Promise<Review> => {

  const resp = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return resp.data;
};


export const getReviewsByBook = async (
  bookId: string
): Promise<Review[]> => {

  const resp = await axios.get(`${API_URL}/${bookId}`);

  return resp.data;
};

export const getLatestReviews = async (): Promise<Review[]> => {
  const resp = await axios.get(`${API_URL}/latest`);
  return resp.data;
};

export const getMyReviews = async (token: string): Promise<Review[]> => {
  const resp = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return resp.data;
};