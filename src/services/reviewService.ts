import axios from "axios";
import type { CreateReviewData, Review } from "../types/review";

const API_URL = "http://localhost:5002/api/reviews";

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