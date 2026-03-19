// Interface för en recension som hämtas från API/db
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

// Interface för data som skickas när en ny recension skapas
export interface CreateReviewData {
  bookId: string;
  bookTitle: string;    
  bookThumbnail?: string;
  text: string;
  rating: number; 
}