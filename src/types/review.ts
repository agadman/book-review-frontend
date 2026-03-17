export interface Review {
  id: number;
  bookId: string;
  bookTitle?: string;  
  bookThumbnail?: string;
  username: string;
  text: string;
  rating: number;
  createdAt: string;
}

export interface CreateReviewData {
  bookId: string;
  bookTitle: string;    
  bookThumbnail?: string;
  text: string;
  rating: number; 
}