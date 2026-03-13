export interface Book {
  id: string;
  title: string;
  authors: string[];
  thumbnail?: string;
}

export interface GoogleBookItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
  };
}