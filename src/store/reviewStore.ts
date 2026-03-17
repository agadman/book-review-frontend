import { create } from "zustand";
import type { Review, CreateReviewData } from "../types/review";
import { 
  getLatestReviews, 
  getMyReviews, 
  createReview as createReviewService,
  updateReview as updateReviewService,
  deleteReview as deleteReviewService
} from "../services/reviewService";

interface ReviewStore {
  latestReviews: Review[];
  myReviews: Review[];
  setLatestReviews: (reviews: Review[]) => void;
  setMyReviews: (reviews: Review[]) => void;

  fetchLatest: () => Promise<void>;
  fetchMyReviews: (token: string) => Promise<void>;

  createReview: (data: CreateReviewData, token: string) => Promise<void>;
  updateReview: (id: number, text: string, rating: number, token: string) => Promise<void>;
  deleteReview: (id: number, token: string) => Promise<void>;
}

export const useReviewStore = create<ReviewStore>((set) => ({
  latestReviews: [],
  myReviews: [],

  setLatestReviews: (reviews) => set({ latestReviews: reviews }),
  setMyReviews: (reviews) => set({ myReviews: reviews }),

  fetchLatest: async () => {
    const reviews = await getLatestReviews();
    set({ latestReviews: reviews });
  },

  fetchMyReviews: async (token: string) => {
    const reviews = await getMyReviews(token);
    set({ myReviews: reviews });
  },

  createReview: async (data: CreateReviewData, token: string) => {
    const newReview = await createReviewService(data, token);
    set((state) => ({
      myReviews: [newReview, ...state.myReviews],
      latestReviews: [newReview, ...state.latestReviews],
    }));
  },

  updateReview: async (id: number, text: string, rating: number, token: string) => {
    await updateReviewService(id, text, rating, token);
    set((state) => ({
      myReviews: state.myReviews.map((r) => r.id === id ? { ...r, text, rating } : r),
      latestReviews: state.latestReviews.map((r) => r.id === id ? { ...r, text, rating } : r),
    }));
  },

  deleteReview: async (id: number, token: string) => {
    await deleteReviewService(id, token);
    set((state) => ({
      myReviews: state.myReviews.filter((r) => r.id !== id),
      latestReviews: state.latestReviews.filter((r) => r.id !== id),
    }));
  },
}));