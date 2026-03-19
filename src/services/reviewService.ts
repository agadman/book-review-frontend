import axios from "axios"; // Importerar axios för HTTP-anrop
import type { CreateReviewData, Review } from "../types/review";

// URL till API:t (från .env)
const API_URL = `${import.meta.env.VITE_API_URL}/reviews`;

// Skapar en ny recension (kräver token)
export const createReview = async (
  data: CreateReviewData,
  token: string
): Promise<Review> => {

  const resp = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}` // Skickar med JWT-token
    }
  });

  return resp.data; // Returnerar skapad recension
};

// Hämtar alla recensioner för en specifik bok
export const getReviewsByBook = async (
  bookId: string
): Promise<Review[]> => {

  const resp = await axios.get(`${API_URL}/${bookId}`);

  return resp.data; // Returnerar lista med recensioner
};

// Hämtar de senaste recensionerna
export const getLatestReviews = async (): Promise<Review[]> => {
  const resp = await axios.get(`${API_URL}/latest`);
  return resp.data; // Returnerar senaste recensioner
};

// Hämtar inloggad användares recensioner (kräver token)
export const getMyReviews = async (token: string): Promise<Review[]> => {
  const resp = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return resp.data; // Returnerar användarens recensioner
};

// Uppdaterar en recension (kräver token)
export const updateReview = async (
  id: number,
  text: string,
  rating: number,
  token: string
) => {
  const resp = await axios.put(
    `${API_URL}/${id}`,
    { text, rating }, // Skickar uppdaterad data
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  return resp.data; // Returnerar uppdaterad recension
};

// Tar bort en recension (kräver token)
export const deleteReview = async (id: number, token: string) => {
  const resp = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return resp.data; 
};