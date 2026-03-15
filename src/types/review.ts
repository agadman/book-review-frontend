export interface Review {
  id: number;
  bookId: string;
  username: string;
  text: string;
  rating: number;
  createdAt: string;
}

export interface CreateReviewData {
  bookId: string;
  text: string;
  rating: number;
}