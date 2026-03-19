// Interface för en bok 
export interface Book {
  id: string;
  title: string;
  authors: string[];
  thumbnail?: string;
  description?: string;
  publishedDate?: string;
  averageRating?: number;
  categories?: string[];
}

// Interface för data från Google Books API
export interface GoogleBookItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    publishedDate?: string;
    averageRating?: number;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
  };
}