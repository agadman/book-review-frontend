import { create } from "zustand";
import type { Review, CreateReviewData } from "../types/review";
// Importerar funktioner som anropar API:t
import { 
  getLatestReviews, 
  getMyReviews, 
  createReview as createReviewService,
  updateReview as updateReviewService,
  deleteReview as deleteReviewService
} from "../services/reviewService";

// Typdefinition för hela store:en
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

// Skapar zustand store
export const useReviewStore = create<ReviewStore>((set) => ({
  latestReviews: [],
  myReviews: [],

  // Sparar senaste recensioner i state
  setLatestReviews: (reviews) => set({ latestReviews: reviews }),

  // Sparar användarens recensioner i state
  setMyReviews: (reviews) => set({ myReviews: reviews }),

   // Hämtar senaste recensioner från API och uppdaterar state
  fetchLatest: async () => {
    const reviews = await getLatestReviews();
    set({ latestReviews: reviews });
  },

  // Hämtar användarens recensioner (kräver token)
  fetchMyReviews: async (token: string) => {
    const reviews = await getMyReviews(token);
    set({ myReviews: reviews });
  },

  // Skapar en ny recension och lägger till den först i listorna
  createReview: async (data: CreateReviewData, token: string) => {
    const newReview = await createReviewService(data, token);
    set((state) => ({
      myReviews: [newReview, ...state.myReviews],
      latestReviews: [newReview, ...state.latestReviews],
    }));
  },

  // Uppdaterar en recension i båda listorna
  updateReview: async (id: number, text: string, rating: number, token: string) => {
    await updateReviewService(id, text, rating, token);
    set((state) => ({
      myReviews: state.myReviews.map((r) => r.id === id ? { ...r, text, rating } : r),
      latestReviews: state.latestReviews.map((r) => r.id === id ? { ...r, text, rating } : r),
    }));
  },

  // Tar bort en recension från båda listorna
  deleteReview: async (id: number, token: string) => {
    await deleteReviewService(id, token);
    set((state) => ({
      myReviews: state.myReviews.filter((r) => r.id !== id),
      latestReviews: state.latestReviews.filter((r) => r.id !== id),
    }));
  },
}));